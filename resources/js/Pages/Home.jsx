import ChatLayout from "@/Layouts/ChatLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from "react";
import ApplicationLogo from '@/Components/App/ApplicationLogo';
import ConversationHeader from "@/Components/App/ConversationHeader";
import MessageItem from "@/Components/App/MessageItem";
import MessageInput from "@/Components/App/MessageInput";

/**
 * Create Home Layout as a persistent Layout to show the conversation sidebar
 * and a placeholder if no conversation is selected.
 */
function Home({ selectedConversation = null, messages = null }) {
    // Read the application name
    const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

    const [localMessages, setLocalMessages] = useState([]);
    const messagesCtrRef = useRef(null);

    // When the selected conversation changes, scroll to the bottom after 10ms
    useEffect(() => {
        setTimeout(() => {
            messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
        }, 10);
    });

    useEffect(() => {
        setLocalMessages(
            messages
            ? messages.data.reverse()
            : []
        );
    }, [messages]);

    return (
        <>
            {/* Show the placeholder when no conversation is selected */}
            { !messages && (
                <div className="flex flex-col gap-8 justify-center items-center text-center h-full opacity-35 select-none">
                    <div className="flex flex-col items-center text-2xl md:text-4xl">
                        <ApplicationLogo className="block h-12 mb-4 fill-current text-gray-800 dark:text-gray-200" />
                        <span>Welcome to {appName} messenger!</span>
                    </div>
                    <div className="text-xl md:text-2xl">
                        <div>Start a new chat or select a chat to see the messages</div>
                    </div>
                </div>
            )}

            {/* Show the messages if a conversation is selected */}
            { messages && (
                <>

                    {/* Show the name of the chat on the top as a sticky header*/}
                    <ConversationHeader
                        selectedConversation = {selectedConversation}
                    />

                    {/* Render the messages in a scrollable area */}
                    <div
                        ref={messagesCtrRef}
                        className="flex-1 overflow-y-auto p-5"
                    >

                        {/* If no messages exist in the conversation */}
                        {localMessages.length === 0 && (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-lg">
                                    This seems like a new chat. Say something nice ...
                                </div>
                            </div>
                        )}

                        {/* If messages exist in the conversation */}
                        {localMessages.length !== 0 && (
                            <div className="flex flex-1 flex-col">
                                { localMessages.map((message) => (
                                    <MessageItem
                                        key     = {message.id}
                                        message = {message}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <MessageInput conversation = {selectedConversation} />
                </>
            )}
        </>
    );
    
}

Home.layout = (page) => {
    return (
        <AuthenticatedLayout 
            user = {page.props.auth.user}
        >
            <Head title = "Home" />
            <ChatLayout 
                children = {page}
            >
            </ChatLayout>
        </AuthenticatedLayout>
    );
}

export default Home;