import ChatLayout from "@/Layouts/ChatLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef, useCallback } from "react";
import ApplicationLogo from '@/Components/App/ApplicationLogo';
import ConversationHeader from "@/Components/App/ConversationHeader";
import MessageItem from "@/Components/App/MessageItem";
import MessageInput from "@/Components/App/MessageInput";
import { useEventBus } from "@/EventBus";
import axios from "axios";

/**
 * Create Home Layout as a persistent Layout to show the conversation sidebar
 * and a placeholder if no conversation is selected.
 */
function Home({ selectedConversation = null, messages = null }) {

    // Read the application name
    const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

    // Load the messages in the browser
    const [localMessages, setLocalMessages] = useState([]);
    const messagesCtrRef = useRef(null);

    // Load older messages when the user scrolls to the top
    const loadMoreIntersection = useRef(null);

    // Use the Event Bus for creating the `unsubscribe` event handlers
    const { on } = useEventBus();

    const [noMoreMessages, setNoMoreMessages] = useState(false);
    const noMoreMessagesRef = useRef(noMoreMessages);

    const [scrollFromBottom, setScrollFromBottom] = useState(0);

    const messageCreated = (message) => {

        /**
         * If the selected conversation is a group, and a new message is 
         * received in that group, then update the group chat. 
         */
        if (
            selectedConversation &&
            selectedConversation.is_group &&
            selectedConversation.id == message.group_id
        ) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        }

        /**
         * If the selected conversation is a personal chat, and a new message  
         * is received, then update the personal chat. 
         */
        if (
            selectedConversation &&
            selectedConversation.is_user && (
                selectedConversation.id == message.sender_id ||
                selectedConversation.id == message.receiver_id
            )
        ) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        }
    };

    // Update the ref value whenever noMoreMessages changes
    useEffect(() => {
        noMoreMessagesRef.current = noMoreMessages;
    }, [noMoreMessages]);

    // Load older messages
    // Cache the function and recall every time localMessages gets updated
    const loadMoreMessages = useCallback(() => {

        if (noMoreMessagesRef.current) {
            return;
        }

        // Track the very first locally available message of the chat (i.e., 
        // the topmost or the oldest message for the chat that is available 
        // in the browser)
        const firstMessage = localMessages[0];  

        // Make a GET request to fetch the messages older than the firstMessage
        axios.get(route("message.loadOlder", firstMessage.id))
        .then(({ data }) => {

            // There are no older messages in the database for this chat
            if (data.data.length == 0 || data.data.length == '0') {
                setNoMoreMessages(true);
                return;
            }

            /**
             * When older messages exist, the application must load the older 
             * messages in the background while retain the current position of the 
             * scroll bar to avoid distracting the user. 
             * To achieve this, calculate the difference in the scroll bar height 
             * from the bottom of the scrollable area, and update the location of 
             * the scroll bar without disturbing the content displayed on the screen.
             */

            // Get the overall scroll height (including the area which is invisible)
            const scrollHeight = messagesCtrRef.current.scrollHeight;

            // Get the current position of the scroll bar (from the bottom of the screen)
            const scrollTop = messagesCtrRef.current.scrollTop;

            // Get the height of the content area which is being viewed by the user
            const clientHeight = messagesCtrRef.current.clientHeight;

            // Set scroll position
            setScrollFromBottom(scrollHeight - scrollTop - clientHeight);

            // Update local messages
            setLocalMessages((prevMessages) => {
                const newMessages = data.data.reverse();
                const uniqueMessages = newMessages.filter((newMessage) => {
                    return !prevMessages.some((prevMessage) => prevMessage.id === newMessage.id);
                });
                return [...uniqueMessages, ...prevMessages];
            });
        });
    }, [localMessages, noMoreMessages]);

    // When the selected conversation changes, scroll to the bottom after 10ms
    useEffect(() => {
        setTimeout(() => {
            if (messagesCtrRef.current) {

                // THIS FORCES THE CONTENT TO SCROLL TOWARDS THE BOTTOM
                // messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
            }
        }, 10);

        // Create a handler to unsubscribe from the broadcast channel
        const offCreated = on("message.created", messageCreated);

        // Set the scroll bar to drop to the bottom
        setScrollFromBottom(0);
        
        // Reset noMoreMessages
        setNoMoreMessages(false);

        return () => {
            offCreated();
        };
    });

    // Load the messages, but in reverse order (latest at the bottom)
    useEffect(() => {
        setLocalMessages(
            messages
            ? messages.data.reverse()
            : []
        );
    }, [messages]);

    // Update the scroll bar height when older messages are loaded in localMessages
    useEffect(() => {
        if (messagesCtrRef.current && scrollFromBottom !== null) {
            messagesCtrRef.current.scrollTop = 
                messagesCtrRef.current.scrollHeight -
                messagesCtrRef.current.offsetHeight -
                scrollFromBottom;
        }

        if (noMoreMessages) {
            return;
        }

        // Observe the current scroll bar position, and when the <div> with 
        // `loadMoreIntersection` is in the viewing area, load the older messages
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(
                (entry) => entry.isIntersecting && loadMoreMessages()
            ),
            {
                rootMargin: "0% 0% 40% 0%",
            }
        );

        if (loadMoreIntersection.current) {
            setTimeout(() => {
                observer.observe(loadMoreIntersection.current);
            }, 200);
        }

        // Remove the observer when the messages get loaded
        return () => {
            observer.disconnect();
        };
    }, [localMessages]);

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
                                <div className="text-xl text-gray-500">
                                    This seems like a new chat. Say something nice ...
                                </div>
                            </div>
                        )}

                        {/* If messages exist in the conversation */}
                        {localMessages.length !== 0 && (
                            <div className="flex flex-1 flex-col">

                                {/* Load older messages in this div when the user scrolls upwards */}
                                <div ref={loadMoreIntersection}></div>

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