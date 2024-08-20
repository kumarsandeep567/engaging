import { Link, usePage } from "@inertiajs/react";
import UserAvatar from "@/Components/App/UserAvatar";
import GroupAvatar from "@/Components/App/GroupAvatar";
import { useEventBus } from "@/EventBus";
import GroupDescriptionPopover from "@/Components/App/GroupDescriptionPopover";
import GroupUsersPopover from "@/Components/App/GroupUsersPopover";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { Cog6ToothIcon, TrashIcon } from "@heroicons/react/24/outline";

/**
 * This component will render the name of the chat (group or personal),
 * chat icon, along with any additional information that needs to be displayed.
 */
const ConversationHeader = ({selectedConversation}) => {

    const page = usePage();

    const authUser = page.props.auth.user;

    const { emit } = useEventBus();

    // Method to delete a group chat
    const onDeleteGroup = () => {
        if (!window.confirm("Are you sure you want to delete the group?")) {
            return;
        }

        axios.delete(route("group.destroy", selectedConversation.id))
        .then((res) => {
            emit("toast.show", res.data.message);
            console.log("SUCCESS: Group deleted", res.data);
        })
        .catch((error) => {
            console.log("ERROR: Could not delete group", error);
        });
    };

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
                            <ChevronLeftIcon className="w-6" />
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
                            <h3 className="dark:text-gray-100">{selectedConversation.name}</h3>
                            { selectedConversation.is_group && (
                                <p className="text-xs text-grey-500 dark:text-gray-100">
                                    {selectedConversation.users.length} members
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Show the additional info about the group (like description), if available */}
                    {selectedConversation.is_group && (
                        <div className="flex gap-3">

                            {/* Group description component */}
                            <GroupDescriptionPopover 
                                description={selectedConversation.description} 
                            />

                            {/* Show the group member's avatar, if available */}
                            <GroupUsersPopover 
                                users={selectedConversation.users} 
                            />

                            {/* Group owners (i.e., the creators of the group) 
                            will see options to edit the group's additional info */}
                            {selectedConversation.owner_id == authUser.id && (
                                <>
                                    <div
                                        className="tooltip tooltip-left"
                                        data-tip="Edit Group"
                                    >
                                        <button
                                            onClick={(ev) => emit(
                                                "GroupModal.show", 
                                                selectedConversation
                                            )}
                                            className="text-gray-800 hover:text-gray-500"
                                        >
                                            <Cog6ToothIcon className="w-6" />
                                        </button>
                                    </div>
                                    <div
                                        className="tooltip tooltip-left"
                                        data-tip="Delete Group"
                                    >
                                        <button
                                            onClick={onDeleteGroup}
                                            className="text-gray-800 hover:text-red-600"
                                        >
                                            <TrashIcon className="w-6" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ConversationHeader;