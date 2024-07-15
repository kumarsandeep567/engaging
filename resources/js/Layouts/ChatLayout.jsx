import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { useEffect } from "react";

const ChatLayout = ({children}) => {

    /**
     * Define ChatLayout to mimic the layout used by most 
     * chat applications, where all conversations are on 
     * the left side of the page, and an active 
     * (or selected) conversation is on the right side of 
     * the page.
     */

    const page = usePage();

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

    // Let's log these conversations for now
    console.log("conversations", conversations);
    console.log('selected conversation', selectedConversation);

    // Update localConversations when conversations change
    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

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
            <div>
                ChatLayout
                {children}
            </div>
        </>
    );
};

export default ChatLayout;