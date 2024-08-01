import { Link, usePage } from "@inertiajs/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";

/**
 * This component will render the name of the chat (group or personal)
 * along with the icon for the respective chat.
 */
const ConversationHeader = ({selectedConversation}) => {
    return (
        <>
            { selectedConversation && (
                <div className="flex justify-between items-center p-3 border-b">
                    <div className="flex items-center gap-3">

                        {/* Hide the link to the dashboard on smaller screens */}
                        <Link
                            href={route("dashboard")}
                            className="inline-block sm:hidden"
                        >

                            {/* Show the back button */}
                            <ArrowLeftIcon className="w-6" />
                        </Link>

                        {/* Show the user avatar for personal chats */}
                        { selectedConversation.is_user && (
                            <UserAvatar user = {selectedConversation}/>
                        )}

                        {/* Show the group avatar for group chats */}
                        { selectedConversation.is_group && (
                            <GroupAvatar/>
                        )}

                        {/* 
                            Show the conversation name, and for group chats, 
                            show the number of participants.
                         */}
                        <div>
                            <h3>{selectedConversation.name}</h3>
                            { selectedConversation.is_group && (
                                <p className="text-xs text-grey-500">
                                    {selectedConversation.users.length} members
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ConversationHeader;