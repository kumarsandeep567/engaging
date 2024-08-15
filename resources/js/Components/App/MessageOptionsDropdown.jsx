import axios from "axios";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useEventBus } from "@/EventBus";

export default function MessageOptionsDropdown({ message }) {

    const { emit } = useEventBus();

    const MessageDelete = () => {
        console.log("Deleting message: ", message);

        // Send a POST request to delete the message and display a notification on success
        axios.delete(route("message.destroy", message.id))
        .then((res) => {
            console.log(res.data);
            emit('message.deleted', {
                message: message, 
                prevMessage: res.data.message
            });
        })
        .catch((error) => {
            console.error("Failed to delete message", error);
        });
    };

    return (
        <div className="absolute right-full text-gray-400 hover:text-gray-700 top-1/2 -translate-y-1/2 z-20">
            <Menu as = "div" className = "relative inline-block text-left">
                <div>
                    <Menu.Button className = "flex justify-center items-center w-8 h-8 rounded-full hover:bg-black/20">
                        <EllipsisVerticalIcon className = "w-5 h-5" />
                    </Menu.Button>
                </div>
                <Transition
                    as          = {Fragment} 
                    enter       ="transition duration-100 ease-out"
                    enterFrom   ="transform scale-95 opacity-0"
                    enterTo     ="transform scale-100 opacity-100"
                    leave       ="transition duration-95 ease-out"
                    leaveFrom   ="transform scale-100 opacity-100"
                    leaveTo     ="transform scale-95 opacity-0"
                >
                    <Menu.Items className = "absolute md:right-10 md:-top-1/2 xs:-left-1/2 xs:top-20 mt-2 w-32 rounded-md bg-gray-100 shadow-lg z-10 dark:bg-gray-800">
                        <div className = "px-1 py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick = {MessageDelete}
                                        className = {`
                                            ${
                                                active
                                                ? "bg-red-600 text-white "
                                                : "text-red-700 dark:bg-red-700 "
                                            }
                                            group font-medium flex w-full items-center rounded-md px-2 py-2 text-sm
                                        `}
                                    >

                                        <TrashIcon className="w-4 h-4 mr-2" />
                                        <span>Delete</span>
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
}