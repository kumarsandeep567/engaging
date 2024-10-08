import { usePage } from "@inertiajs/react";
import ReactMarkdown from "react-markdown";
import React from "react";
import UserAvatar from "./UserAvatar";
import formatMessageDate from "@/helpers";
import MessageAttachments from "@/Components/App/MessageAttachments";
import MessageOptionsDropdown from "./MessageOptionsDropdown";

/**
 * This component will provide the input field for the user to type a text 
 * message with markdown features.
 */

const MessageItem = ({ message, attachmentClick }) => {
    const currentUser = usePage().props.auth.user;

    return (

        // Render the message in a chat bubble
        <div
            className = {
                "chat " + (
                    message.sender_id === currentUser.id
                    ? "chat-end"
                    : "chat-start"
                )
            }
        >

            {/* Show the user avatar */}
            {<UserAvatar user={message.sender} />}

            <div className="chat-header select-none">
                
                {/* Show the sender's name in group chats */}
                { message.group_id && (message.sender_id !== currentUser.id)
                    ? message.sender.name
                    : ''
                }

                {/* Show the time the message was created at */}
                <time className="text-xs opacity-50 ml-2">
                    {formatMessageDate(message.created_at, true)}
                </time>
            </div>
            
            {/* Set the background color for the chat bubble */}
            <div
                className = {
                    "chat-bubble w-auto max-w-sm md:max-w-xl min-w-0  " + (
                        message.sender_id === currentUser.id
                        ? " bg-blue-200"
                        : ' bg-gray-200'
                    )
                }
            >

                {/* Render the message using React Markdown */}
                <div className="chat-message">

                    {/* Text message */}
                    <div className="chat-message-content text-slate-900">
                        <ReactMarkdown>{message.message}</ReactMarkdown>
                    </div>

                    {/* Image/file attachments, if any */}
                    <MessageAttachments
                        attachments     = {message.attachments}
                        attachmentClick = {attachmentClick}
                    />
                </div>

                {/* Additional options (overflow menu) for each message (like delete, etc) */}
                {message.sender_id == currentUser.id && (
                    <MessageOptionsDropdown message={message} />
                )}
            </div>
        </div>
    );
};

export default MessageItem;