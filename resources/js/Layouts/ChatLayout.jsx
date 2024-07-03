import { usePage } from "@inertiajs/react";
import { useEffect } from "react";

const ChatLayout = ({children}) => {

    /**
     * We will define our ChatLayout to mimic the most commonly used 
     * layout by most of the chat applications, which is a list of 
     * conversations on the left side of the webpage, and an active 
     * (or selected) conversation on the right side of the webpage.
     */

    const page = usePage();

    // Combine the users and their messages together
    const conversations = page.props.conversations;

    // When the user selects/clicks on a conversation on the left
    // then selectedConversation will be set
    const selectedConversation = page.props.selectedConversation;

    // Let's log these conversations for now
    console.log("conversations", conversations);
    console.log('selected conversation', selectedConversation);

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
                console.log("Users are active", users);
            })
            
            // When the user is trying to join the presence channel
            .joining((user) => {
                console.log("User is joining...", user);
            })

            // When the user is trying to leave the presence channel
            .leaving((user) => {
                console.log("User is leaving :(", user);
            })

            // Log errors, if any
            .error((error) => {
                console.log("An error occured in the 'online' channel", error);
            })
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