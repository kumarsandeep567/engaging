import { usePage } from "@inertiajs/react";

const ChatLayout = ({children}) => {

    /**
     * Get the conversations from the page
     * and the selected conversation
     * (which is the conversation currently in focus)
     */
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;

    // Let's log these conversations for now
    console.log("conversations", conversations);
    console.log('selected conversation', selectedConversation);

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