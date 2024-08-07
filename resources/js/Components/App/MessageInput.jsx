import { useState, Fragment, useCallback, useEffect } from "react";
import { 
    PaperClipIcon,
    PhotoIcon,
    FaceSmileIcon,
    PaperAirplaneIcon,
    XCircleIcon,
    XMarkIcon
} from "@heroicons/react/24/solid";
import NewMessageInput from "@/Components/App/NewMessageInput";
import axios from "axios";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import EmojiPicker from "emoji-picker-react";
import { Popover, Transition } from "@headlessui/react";

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

        if (newMessage.trim() === "") {
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

                // For now, just log the progress
                console.log("Upload progress: ", progress);
                setUploadProgress(progress);
            }
        }).then((response) => {
            setNewMessage("");
            setUploadProgress(0);
            setChosenFiles([]);
            setMessageSending(false);
            console.log("UPLOAD RESPONSE: ", response);
        }).catch((error) => {
            setChosenFiles([]);
            setMessageSending(false);
            const errorMessage = error?.response?.data?.message;
            setInputErrorMessage(errorMessage || "Something went wrong while trying to send the message..!");
            console.log("UPLOAD ERROR: ", errorMessage);
        });

    };


    return (
        <div className="flex flex-wrap items-start border-t shadow-2xl border-gray-200 py-3">
            {/* <div className="order-2 flex-1 xs:flex-none xs:order-1 p-2"> */}

                {/* The file attachment (file upload) button */}
                {/* <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PaperClipIcon className="w-6" />
                    <input 
                        type="file" 
                        multiple
                        className="absolute top-0 bottom-0 left-0 right-0 opacity-0 z-20 cursor-pointer"
                    />
                </button> */}

                {/* The image attachment button */}
                {/* <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PhotoIcon className="w-6" />
                    <input 
                        type="file" 
                        multiple
                        accept="image/*"
                        className="absolute top-0 bottom-0 left-0 right-0 opacity-0 z-20 cursor-pointer"
                    />
                </button> */}
            {/* </div> */}

            {/* The bottom input panel */}
            <div className="order-1 px-3 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs:order-2 flex-1 relative">
                <div className="flex">

                    {/* The file attachment (file upload) button */}
                    <button className="p-1 text-gray-400 hover:text-gray-500 relative">
                        <PaperClipIcon className="w-6 h-6" />
                        <input 
                            type="file" 
                            multiple
                            onChange={onFileChange}
                            className="absolute top-0 bottom-0 left-0 right-0 opacity-0 z-20 cursor-pointer"
                        />
                    </button>

                    {/* The image attachment button */}
                    <button className="p-1 text-gray-400 hover:text-gray-500 relative">
                        <PhotoIcon className="w-6 h-6" />
                        <input 
                            type="file" 
                            multiple
                            onChange={onFileChange}
                            accept="image/*"
                            className="absolute top-0 bottom-0 left-0 right-0 opacity-0 z-20 cursor-pointer"
                        />
                    </button>

                    {/* Show the emoji icon */}
                    <Popover className="relative">
                        <Popover.Button 
                            className="p-1 pt-3 text-gray-400 hover:text-gray-500 cursor-pointer"
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
                        className="btn bg-sky-400 rounded-xl text-gray-800 hover:bg-sky-300"
                        onClick={sendMessage}
                        disabled={messageSending}
                    >
                        {messageSending 
                            ? <span className="loading loading-spinner loding-xs"></span>
                            : (
                                <>
                                    <PaperAirplaneIcon className="w-6" />
                                    <span className="hidden sm:inline">Send</span>
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
                {!!uploadProgress && (
                    <div className="toast toast-top toast-center mt-14">
                        <div className="alert bg-sky-200 px-6 shadow-sm">
                            <div>
                                <span>Uploading</span>
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
                                <span className="text-xs">{uploadProgress}%</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Show the modal if there's an error */}
                {inputErrorMessage && (errorModal.showModal())}

                {/* The uploaded files can be previewed in this section */}
                <div className="flex flex-wrap gap-1 mt-2">
                    {chosenFiles.map((file) => {
                        <div
                            className={
                                `relative flex justify-between cursor-pointer ` + (
                                    !isImage(file.file)
                                    ? " w-[240px]"
                                    : ""
                            )}
                            key={file.file.name}
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
                            {!isImage(file.file) && isAudio(file.file) && (
                                <AttachmentPreview file={file} />
                            )}

                            {/* Provide a section to remove file(s) marked for uploading */}
                            <button
                                onClick={() => setChosenFiles(
                                    chosenFiles.filter((f) => f.file.name !== file.file.name)
                                )}
                                className="absolute w-6 h-6 rounded-full bg-gray-800 right-2 top-2 text-gray-300 hover:text-gray-100 z-10"
                            >
                                <XCircleIcon className="w-6" />
                            </button>
                        </div>
                    })}
                </div>
            </div>
        </div>
    );
};

export default MessageInput;