import { useState, Fragment, useCallback, useEffect } from "react";
import { 
    PaperClipIcon,
    PhotoIcon,
    FaceSmileIcon,
    PaperAirplaneIcon,
    XCircleIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import NewMessageInput from "@/Components/App/NewMessageInput";
import axios from "axios";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import EmojiPicker from "emoji-picker-react";
import { Popover, Transition } from "@headlessui/react";
import CustomAudioPlayer from "@/Components/App/CustomAudioPlayer";
import AttachmentPreview from "@/Components/App/AttachmentPreview";
import { isAudio, isImage } from "@/helpers";
import AudioRecorder from "./AudioRecorder";

/**
 * This component will provide a bottom panel for the text field, attachment, 
 * emojis, and the send message button.
 */

const MessageInput = ({ conversation = null }) => {

    const [newMessage, setNewMessage] = useState("");
    const [inputErrorMessage, setInputErrorMessage] = useState("");
    const [messageSending, setMessageSending] = useState(false);
    const [chosenFiles, setChosenFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Emoji Picker Configuration 
    const emojiPickerConfig = {
        showPreview: false
    };

    // Event handler for when the files change
    const onFileChange = (ev) => {
        const files = ev.target.files;

        // Convert the files into an array and map them to an object which
        // contains the files and their URLs (for previewing them)
        const updatedFiles = [...files].map((file) => {
            return {
                file: file,
                url: URL.createObjectURL(file)
            };
        });

        // Reset the file list (to allow choosing the same files again)
        ev.target.value = null;

        // Updated the chosen files
        setChosenFiles((prevFiles) => {
            return [...prevFiles, ...updatedFiles];
        });

    };

    // Handler to send the message.
    const sendMessage = () => {

        // Prevent a new message from being sent if there's already a message 
        // being sent
        if (messageSending) {
            return;
        }

        if (newMessage.trim() === "" && chosenFiles.length === 0) {
            setInputErrorMessage("Cannot send an empty message. Please type a message or select an image or a file.");

            // Hide the error message after 5 seconds.
            setTimeout(() => {
                errorModal.close();
                setInputErrorMessage("");
            }, 5000);

            return;
        }

        // Use a form data to send the message along with attachments (if any).
        const messageData = new FormData();
        messageData.append("message", newMessage)

        chosenFiles.forEach((file) => {
            messageData.append("attachments[]", file.file);
        });

        if (conversation.is_user) {
            messageData.append("receiver_id", conversation.id);
        } else if (conversation.is_group) {
            messageData.append("group_id", conversation.id);
        }

        // Enable the loading spinner to indicate the message is being sent.
        setMessageSending(true);

        // Make a POST request to store the message to the database.
        // If the message has any attachments, show a progress bar for the same.
        axios.post(
            route("message.store"),
            messageData,
            {onUploadProgress: (progressEvent) => {
                const progress = Math.round(
                    (progressEvent.loaded / progressEvent.total) * 100
                );
                setUploadProgress(progress);
            }
        }).then((response) => {

            setNewMessage("");
            setUploadProgress(0);
            setChosenFiles([]);
            setMessageSending(false);

        }).catch((error) => {

            setChosenFiles([]);
            setMessageSending(false);
            setUploadProgress(0);

            const errorMessage = error?.response?.data?.message;
            setInputErrorMessage(errorMessage || "Something went wrong while trying to send the message..!");
            console.log("UPLOAD ERROR: ", errorMessage);
        });

    };

    // When the recorded audio message is ready to be uploaded,
    // update chosen files
    const recordedAudioReady = (file, url) => {
        setChosenFiles((prevFiles) => {
            return [
                ...prevFiles,
                {
                    file: file,
                    url: url
                }
            ];
        });
    };


    return (
        
        // Bottom input
        // For shorter bottom input bar, use sm:px-10 md:mx-28 my-2
        <div className="flex flex-wrap border shadow-xl border-gray-300 pt-3 pb-1  rounded-xl">

            {/* Contents of the bottom panel */}
            <div className="order-1 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs:order-2 flex-1 relative">
                <div className="flex justify-center">

                    {/* The file attachment (file upload) button */}
                    <button 
                        className="tooltip tooltip-top xs:tooltip-right p-1 text-gray-400 hover:text-blue-600 relative"
                        data-tip = "Upload files"
                    >
                        <PaperClipIcon className="w-6 h-6" />
                        <input 
                            type="file" 
                            multiple
                            onChange={onFileChange}
                            className="absolute top-0 bottom-0 left-0 right-0 opacity-0 z-20 cursor-pointer"
                        />
                    </button>

                    {/* The image attachment button */}
                    <button 
                        className="tooltip tooltip-top p-1 text-gray-400 hover:text-emerald-600 relative"
                        data-tip = "Upload images"
                    >
                        <PhotoIcon className="w-6 h-6" />
                        <input 
                            type="file" 
                            multiple
                            onChange={onFileChange}
                            accept="image/*"
                            className="absolute top-0 bottom-0 left-0 right-0 opacity-0 z-20 cursor-pointer"
                        />
                    </button>

                    {/* Audio recorder button */}
                    <AudioRecorder 
                        fileReady={recordedAudioReady}
                    />

                    {/* Show the emoji icon */}
                    <Popover className="relative">
                        <Popover.Button 
                            className="tooltip tooltip-top p-1 pt-3 text-gray-400 hover:text-rose-500 cursor-pointer"
                            data-tip = "Send emoji"
                        >
                            <FaceSmileIcon className="w-6 h-6" />
                        </Popover.Button>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-1"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel className="absolute z-10 bottom-full shadow-md rounded-lg mb-2">
                                <EmojiPicker 
                                    emojiStyle="native"
                                    previewConfig={emojiPickerConfig}
                                    skinTonesDisabled={true}
                                    lazyLoadEmojis={true}
                                    onEmojiClick={(ev) => setNewMessage(newMessage + ev.emoji)}
                                />
                            </Popover.Panel>
                        </Transition>
                    </Popover>

                    {/* The text area for typing the message */}
                    <NewMessageInput 
                        value={newMessage}
                        onChange={(ev) => setNewMessage(ev.target.value)}
                        onSend={sendMessage}
                    />

                    {/* The send message button */}
                    {/* When sending a message, if the message delivery takes
                        too long, show the loader animation.
                    */}
                    <button 
                        className="btn btn-circle bg-emerald-400 text-gray-800 hover:bg-emerald-300"
                        onClick={sendMessage}
                        disabled={messageSending}
                    >
                        {messageSending 
                            ? <span className="loading loading-spinner loding-xs"></span>
                            : (
                                <>
                                    <PaperAirplaneIcon className="w-6" />
                                    {/* <span className="hidden sm:inline">Send</span> */}
                                </>
                            )
                        }
                    </button>
                </div>

                {/* Show the error message if there's an error in the input */}
                <dialog id="errorModal" className="modal">
                    <div className="modal-box">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                <XMarkIcon className="w-5" />
                            </button>
                        </form>
                        <h3 className="text-lg font-bold">
                            <ExclamationCircleIcon className="w-8 text-red-500" />
                        </h3>
                        <p className="py-4 text-md text-red-500">
                            {inputErrorMessage}
                        </p>
                    </div>
                </dialog>

                {/* Show the image/file upload progress in a toast notification */}
                {!!uploadProgress && chosenFiles.length > 0 && (
                    <div className="toast toast-bottom toast-center mx-auto w-auto mb-20">
                        <div className="alert bg-slate-200 shadow-sm px-6">
                            <div>
                                <span className="select-none">Uploading</span>
                            </div>
                            <div 
                                className="radial-progress" 
                                style={{ 
                                    "--value": `${uploadProgress || 0}`, 
                                    "--size": "3rem", 
                                    "--thickness": "5px" 
                                }} 
                                role="progressbar"
                            >
                                <span className="text-xs select-none">{uploadProgress}%</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Show the modal if there's an error */}
                {inputErrorMessage && (errorModal.showModal())}

                {/* The uploaded files can be previewed in this section */}
                <div className="flex flex-wrap pl-2 gap-2 mt-2 ">
                    {chosenFiles.map((file) => (
                        <div
                            key={file.file.name}
                            className={
                                `relative flex justify-between cursor-pointer ` + (
                                    !isImage(file.file)
                                    ? " w-[240px]"
                                    : ""
                            )}
                        >

                            {/* For image files */}
                            {isImage(file.file) && (
                                <img 
                                    src={file.url} 
                                    alt="user-uploaded-image"
                                    className="w-16 h-16 object-cover" 
                                />
                            )}

                            {/* For audio files */}
                            {isAudio(file.file) && (
                                <CustomAudioPlayer
                                    file={file}
                                    showVolume={false}
                                />
                            )}

                            {/* For all other files */}
                            {!isImage(file.file) && !isAudio(file.file) && (
                                <AttachmentPreview file={file} />
                            )}

                            {/* Provide a section to remove file(s) marked for uploading */}
                            <button
                                onClick={() => setChosenFiles(
                                    chosenFiles.filter((f) => f.file.name !== file.file.name)
                                )}
                                className="absolute w-6 h-6 rounded-full bg-gray-700 -right-2 -top-2 text-gray-300 hover:text-gray-100 z-10"
                            >
                                <XCircleIcon className="w-6" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MessageInput;