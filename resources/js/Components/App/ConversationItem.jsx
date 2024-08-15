import { Link, usePage } from "@inertiajs/react";
import UserAvatar from "@/Components/App/UserAvatar";
import GroupAvatar from "@/Components/App/GroupAvatar";
import UserOptionsDropdown from "@/Components/App/UserOptionsDropdown";
import formatMessageDate, { truncateText } from "@/helpers";
import ReactMarkdown from "react-markdown";

/**
 * A custom component for rendering the list of 
 * users and their conversations with the signed in 
 * user
 */

const ConversationItem = ({
    conversation,
    selectedConversation = null,
    online = null
}) => {

    // Create an instance of the page
    const page = usePage();

    // Get the signed in user
    const currentUser = page.props.auth.user;

    // List of TailwindCSS classes that will be
    // dynamically added to the component
    let classes = " border-transparent ";

    if (selectedConversation) {

        // Apply custom classes if the selected conversation
        // is not a group 
        if (
            !selectedConversation.is_group &&
            !conversation.is_group &&
            selectedConversation.id == conversation.id
        ) {
            classes = ` border-emerald-500 bg-black/10`
        }

        // Apply custom classes if the selected conversation
        // is a group 
        if (
            selectedConversation.is_group &&
            conversation.is_group &&
            selectedConversation.id == conversation.id
        ) {
            classes = ` border-teal-500 bg-black/10`
        }
    }

    return (

        /**
         * Direct to specified routes based on whether a 
         * chat is a group chat or a personal chat
         * Also, instruct Inertia.js to preserve the 
         * current state of the page to prevent a
         * complete page load
         */
        <Link
            href = {
                conversation.is_group
                ? route("chat.group", conversation)
                : route("chat.user", conversation)
            }
            preserveState
            className = {
                "flex items-center conversation-item gap-2 p-2 text-gray-800 transition-all cursor-pointer border-l-4 rounded-r-lg hover:bg-black/10 dark:text-gray-100 dark:hover:bg-sky-900" +
                classes + (
                    conversation.is_user && currentUser.is_admin
                    ? " pr-2"
                    : " pr-4"
                )
            }
        >
            {/* 
                If the conversation is a user then
                show the user avatar
            */}
            {conversation.is_user && <UserAvatar user={conversation} online={online}/>}

            {/* 
                If the conversation is a group then
                show the group avatar
            */}
            {conversation.is_group && <GroupAvatar />}

            {/* Lower the opacity for blocked users */}
            <div
                className = {
                    `flex-1 text-xs max-w-full overflow-hidden` + (
                        conversation.is_user && conversation.blocked_at
                        ? " opacity-50"
                        : ""
                    )
                }
            >
                {/* Display the conversation name and last message date */}
                 <div
                    className = "flex items-center justify-between gap-1"
                >
                    <h3 className = "text-sm font-semibold overflow-hidden text-nowrap text-ellipsis">
                        {conversation.name}
                    </h3>
                    {
                        conversation.last_message_date &&
                        <span className="text-nowrap">
                            {formatMessageDate(conversation.last_message_date)}
                        </span>
                    }
                </div>

                {/* Show the last message if the last message date exists */}
                { conversation.last_message_date && (
                    <p className="text-xs text-nowrap overflow-hidden text-ellipsis">
                        <ReactMarkdown>
                            {truncateText(conversation.last_message, 34)}
                        </ReactMarkdown>
                    </p>
                )
                }
            </div>

            {/* Display the additional options for administrator users */}
            { currentUser.is_admin && conversation.is_user
                ? <UserOptionsDropdown conversation = {conversation} />
                : <div></div>
            }
        </Link>
    );
};

export default ConversationItem;