// Toast component will rely on Event Bus for toasts

import { useState, useEffect } from "react";
import { useEventBus } from "@/EventBus";
import { FireIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { v4 as uuidv4 } from "uuid";

export default function Toast({ type = 'info', duration = 5000 }) {

    const { on } = useEventBus();
    const [toasts, setToasts] = useState([]);
    const [isVisible, setIsVisible] = useState(0);

    // Toast styling
    const typeClasses = {
        info    : "bg-blue-200 text-black",
        success : "bg-green-200 text-black",
        warning : "bg-yellow-200 text-black",
        error   : "bg-red-200 text-black",
    };

    // Display the toast notification
    useEffect(() => {
        on('toast.show', (message) => {

            // Get a UUID for every notification
            const uuid = uuidv4();

            setToasts((oldToasts) => [
                ...oldToasts, 
                { message, uuid, type }
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
                    {/* Notification icon */}
                    <div className={`${typeClasses[type]}` + " p-2 rounded-md"}>
                        <FireIcon className="w-6" />
                    </div>

                    {/* Notification content */}
                    <span className="text-gray-800 flex-grow">{toast.message}</span>

                    {/* Close button */}
                    <button 
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        onClick={() => removeToast(toast.uuid)} 
                    >
                        <XMarkIcon className="text-black w-5" />
                    </button>
                </div>
            ))}
            </div>
        </>
    );
}