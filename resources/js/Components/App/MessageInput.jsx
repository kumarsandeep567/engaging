import { useState } from "react";
import { 
    PaperClipIcon,
    PhotoIcon,
    FaceSmileIcon,
    HandThumbUpIcon,
    PaperAirplaneIcon
} from "@heroicons/react/24/solid";
import NewMessageInput from "@/Components/App/NewMessageInput";
import axios from "axios";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

/**
 * This component will provide a bottom panel for the text field, attachment, 
 * emojis, and the send message button.
 */

const MessageInput = ({ conversation = null }) => {

    const [newMessage, setNewMessage] = useState("");
    const [inputErrorMessage, setInputErrorMessage] = useState("");
    const [messageSending, setMessageSending] = useState(false);

    // Handler to send the message.
    const sendMessage = () => {

        // Prevent a new message from being sent if there's already a message 
        // being sent
        if (messageSending) {
            return;
        }

        if (newMessage.trim() === "") {
            setInputErrorMessage("Cannot send an empty message. Please type something or select a file.");

            // Hide the error message after 5 seconds.
            setTimeout(() => {
                setInputErrorMessage("");
            }, 5000);

            return;
        }

        // Use a form data to send the message along with attachments (if any).
        const messageData = new FormData();
        messageData.append("message", newMessage)

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
            }
        }).then((response) => {
            setNewMessage("");
            setMessageSending(false);
            console.log("UPLOAD RESPONSE: ", response);
        }).catch((error) => {
            setMessageSending(false);
            console.log("UPLOAD ERROR: ", error);
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
                            className="absolute top-0 bottom-0 left-0 right-0 opacity-0 z-20 cursor-pointer"
                        />
                    </button>

                    {/* The image attachment button */}
                    <button className="p-1 text-gray-400 hover:text-gray-500 relative">
                        <PhotoIcon className="w-6 h-6" />
                        <input 
                            type="file" 
                            multiple
                            accept="image/*"
                            className="absolute top-0 bottom-0 left-0 right-0 opacity-0 z-20 cursor-pointer"
                        />
                    </button>

                    {/* Show the emoji icon and the Like icon */}
                    <button className="p-1 text-gray-400 hover:text-gray-500 cursor-pointer">
                        <FaceSmileIcon className="w-6 h-6" />
                    </button>
                    {/* <button className="p-1 text-gray-400 hover:text-gray-500 cursor-pointer">
                        <HandThumbUpIcon className="w-6 h-6" />
                    </button> */}

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
                { inputErrorMessage && (
                    <div className="flex">
                        <div className="flex-none pr-2 py-1">
                            <ExclamationCircleIcon className="w-6 text-red-500" />
                        </div>
                        <div className="flex-none py-1.5">
                            <p className="text-sm text-red-500">
                                {inputErrorMessage}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageInput;