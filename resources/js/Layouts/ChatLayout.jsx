import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import TextInput from "@/Components/TextInput";
import ConversationItem from "@/Components/App/ConversationItem";
import { useEventBus } from "@/EventBus";

const ChatLayout = ({children}) => {

    /**
     * Define ChatLayout to mimic the layout used by most 
     * chat applications, where all conversations are on 
     * the left side of the page, and an active 
     * (or selected) conversation is on the right side of 
     * the page.
     */

    const page = usePage();

    // Load the Event Bus
    const { on } = useEventBus();

    // Keep track of online users (as an onject instead of array)
    const [onlineUsers, setOnlineUsers] = useState({});

    // Will be used as a online status indicator
    const isUserOnline = (userId) => onlineUsers[userId];

    // Combine the users and their messages together
    const conversations = page.props.conversations;

    // When the user selects/clicks on a conversation on the left
    // then selectedConversation will be set
    const selectedConversation = page.props.selectedConversation;

    // Update local conversations everytime a coversation is received
    const [localConversations, setLocalConversations] = useState([]);

    const [sortedConversations, setSortedConversations] = useState([]);

    // Update the conversation sidebar when a new message is received
    const messageCreated = (message) => {
        setLocalConversations((oldConversations) => {
            return oldConversations.map((user) => {

                // If the message belongs to a personal chat, then update the
                // personal chat
                if (
                    message.receiver_id &&
                    !user.is_group && 
                    (user.id == message.sender_id || user.id == message.receiver_id)
                ) {
                    user.last_message = message.message;
                    user.last_message_date = message.created_at;
                }

                // If the message belongs to a group chat, then update it
                if (
                    message.group_id &&
                    user.is_group && 
                    user.id == message.group_id
                ) {
                    user.last_message = message.message;
                    user.last_message_date = message.created_at;
                }

                return user;
            });
        });
    };

    // Listen on the Event Bus for new message events
    useEffect(() => {
        const offCreated = on("message.created", messageCreated);

        return () => {
            offCreated();
        };
    }, [on]);

    // Update sortedConversations when local conversations change
    useEffect(() => {
        setSortedConversations(

            // Sort users in the conversation to show blocked 
            // users at the bottom of the conversation
            // Blocked users are visible to the group
            // administrators only
            localConversations.sort((a, b) => {
                if (a.blocked_at && b.blocked_at) {
                    return a.blocked_at > b.blocked_at ? 1 : -1;
                } else if (a.blocked_at) {
                    return 1;
                } else if (b.blocked_at) {
                    return -1;
                }

                // Place the conversation (personal or group)
                // with the latest message at the top
                if (a.last_message_date && b.last_message_date) {
                    return b.last_message_date.localeCompare(a.last_message_date);
                } else if (a.last_message_date) {
                    return -1;
                } else if (b.last_message_date) {
                    return 1;
                } else {
                    return 0;
                }
            })
        );
    }, [localConversations]);

    // Update localConversations when conversations change
    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    /**
     * Functionality to search for users and groups by
     * looking for the search term in the conversation name
     */
    const chatSearchBar = (searchEvent) => {
        const searchTerm = searchEvent.target.value.toLowerCase();
        setLocalConversations(
            conversations.filter((conversation) => {
                return conversation.name.toLowerCase().includes(searchTerm);
            })
        );
    };

    // Listen when the user goes online or offline
    useEffect(() => {

        /** 
         * Join the presence channel 'online' and listen on it.
         * The presence channel is a private channel but will allow tracking
         * presence of other users on it.
         * In the presence channel, define 3 event listeners: here, joining, 
         * and leaving 
         */
        Echo.join('online')

            // When the user successfully joins the presence channel, 
            // the user will receive a list of all users currently on the
            // channel
            .here((users) => {
                const onlineUsersObject = Object.fromEntries(
                    users.map((user) => [user.id, user])
                );

                setOnlineUsers((prevOnlineUsers) => {
                    return {...prevOnlineUsers, ...onlineUsersObject};
                });
            })
            
            // When the user is trying to join the presence channel,
            // update the list of onlineUsers
            .joining((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = { ...prevOnlineUsers };
                    updatedUsers[user.id] = user;
                    return updatedUsers;
                });
            })

            // When the user is trying to leave the presence channel,
            // update the list of onlineUsers
            .leaving((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = {...prevOnlineUsers};
                    delete updatedUsers[user.id];
                    return updatedUsers;
                });
            })

            // Log errors, if any
            .error((error) => {
                console.log("An error occured in the 'online' channel", error);
            })
        
        // When the user leaves the channel
        return () => {
            Echo.leave("Users are leaving the online channel... Byee!");
        };
    }, []);

    return (
        <>
            {
                /**
                 * Create the ChatLayout two comprise of 2 sections 
                 * The left section will consist of a list of conversations,
                 * personal chats and group chats, and the right section
                 * will display all the messages of the selected chat.
                */
            }
            <div className = "flex flex-1 w-full overflow-hidden">
                
                {/* Left section of ChatLayout */}
                <div className = {
                    `flex flex-col w-full sm:w-[220px] md:w-[300px] overflow-hidden transition-all 
                    ${ selectedConversation ? "-ml-[100%] sm:ml-0" : "" }`
                }>
                    
                    {/* Display the conversation heading */}
                    <div className = "flex items-center justify-between py-2 px-3 text-xl font-medium dark:text-gray-100">
                        <span className="select-none">Chats</span>

                        {/* A button to create a new group */}
                        <div
                            className = "tooltip tooltip-left"
                            data-tip = "Create a new group"
                        >
                            <button 
                                className = "btn btn-circle w-12 h-10 bg-sky-300 text-gray-800 hover:bg-sky-200 hover:text-gray-600"
                                onClick = {(ev) => setShowGroupModal(true)}
                            >
                                <PlusIcon className = "w-6 h-6 inline-block" />
                            </button>
                        </div>
                    </div>

                    {/* Search bar to search for chats */}
                    <div className = "p-3">
                        <TextInput
                            onKeyUp     = {chatSearchBar}
                            placeholder = "Search for people or groups"
                            className   = "w-full" 
                        />
                    </div>

                    {/* Display the list of chats (personal and group) here */}
                    <div className = "flex-1 overflow-auto">
                        {sortedConversations.map((conversation) => (
                            <ConversationItem
                                key={`${
                                    conversation.is_group
                                    ? "group_"
                                    : "user_"
                                }${conversation.id}`}
                                conversation={conversation}
                                online={!!isUserOnline(conversation.id)}
                                selectedConversation={selectedConversation} 
                            />
                        ))}
                    </div>
                </div>

                {/* Right section of ChatLayout */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {children}
                </div>
            </div>
        </>
    );
};

export default ChatLayout;