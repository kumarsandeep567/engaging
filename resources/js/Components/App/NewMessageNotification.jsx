// Toast component will rely on Event Bus for events to broadcast notifications

import { useState, useEffect } from "react";
import { useEventBus } from "@/EventBus";
import { FireIcon, UserCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { v4 as uuidv4 } from "uuid";
import UserAvatar from "@/Components/App/UserAvatar";
import { Link } from "@inertiajs/react";
import GroupAvatar from "./GroupAvatar";

export default function NewMessageNotification({ type = 'info', duration = 8000 }) {

    const { on } = useEventBus();
    const [toasts, setToasts] = useState([]);

    // Toast styling
    const typeClasses = {
        info    : "bg-blue-200 text-black",
        success : "bg-green-200 text-black",
        warning : "bg-yellow-200 text-black",
        error   : "bg-red-200 text-black",
    };

    // Display the toast notification
    useEffect(() => {
        on('newMessageNotification', ({message, user, group_id}) => {

            // Get a UUID for every notification
            const uuid = uuidv4();

            setToasts((oldToasts) => [
                ...oldToasts, 
                { message, uuid, user, group_id, type }
            ]);

            const timer = setTimeout(() => {
                removeToast(uuid);
            }, duration);

            return () => clearTimeout(timer);
        })
    }, [on, duration, type]);


    // Remove the toast notification
    const removeToast = (uuid) => {
        setToasts((oldToasts) => oldToasts.filter(
            (toast) => toast.uuid !== uuid
        ));
    };

    return (
        <>
            <div className="fixed top-10 left-1/2 transform -translate-x-1/2 space-y-4">
            {toasts.map((toast, index) => (
                <div
                    key={toast.uuid}
                    className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3 min-w-[200px] w-full max-w-xs transition-all ease-in-out"
                >
                    <div className="flex items-center space-x-3">
                        {/* Notification icon */}
                        <div className={`${typeClasses[type]}` + " rounded-full"}>
                            {parseInt(toast.group_id)
                                ? <GroupAvatar />
                                : <UserAvatar user={toast.user} />
                            }
                        </div>

                        <div>
                            {/* Notification content */}
                            <p className="text-gray-900 font-semibold">{toast.user.name}</p>
                            <p className="text-gray-600 text-sm">{toast.message}</p>
                        </div>
                    </div>

                    {/* Close button */}
                    {/* <button 
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        onClick={() => removeToast(toast.uuid)} 
                    >
                        <XMarkIcon className="text-black w-5" />
                    </button> */}

                    <div className="flex items-center space-x-2">
                        <Link
                            href={toast.group_id
                                ? route("chat.group", toast.group_id)
                                : route("chat.user", toast.user.id)
                            }
                        >
                            <button 
                                className="px-2 py-2 text-blue-600 hover:bg-blue-300 hover:rounded-md focus:outline-none"
                                onClick={() => {removeToast(toast.uuid)}}
                            >
                                <span>View</span>
                            </button>
                        </Link>
                    </div>
                </div>
            ))}
            </div>
        </>
    );
}