/**
 * A dropdown menu for administrators to perform 
 * special actions like block or unblock a user, or 
 * make the user an administrator (not available non-administrators)
 * This component will use the Headless UI dropdown component
 */

import { Menu, Transition } from "@headlessui/react";
import { 
    EllipsisVerticalIcon, 
    ExclamationTriangleIcon, 
    NoSymbolIcon, 
    ShieldCheckIcon, 
    ShieldExclamationIcon 
} from "@heroicons/react/24/solid";
import axios from "axios";
import { Fragment } from "react";

export default function UserOptionsDropdown({ conversation }) {

    // Change user role
    const changeUserRole = () => {

        // Send a post request to change user role and show notification on success
        if ( !conversation.is_user ) {
            return;
        }

        axios.post(route("user.changeRole", conversation.id))
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
    }; 

    // Block user
    const BlockUser = () => {

        // Send a post request to block the user and show notification on success
        if ( !conversation.is_user ) {
            return;
        }

        axios.post(route("user.blockUnblock", conversation.id))
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
    };

    return (
        <div>
            <Menu as = "div" className = "relative inline-block text-left">
                <div>
                    <Menu.Button className = "flex justify-center items-center w-8 h-8 rounded-full hover:bg-black/20">
                        <EllipsisVerticalIcon className = "w-5 h-5" />
                    </Menu.Button>
                </div>
                <Transition
                    as          = {Fragment} 
                    enter       = "transition ease-out duration-100"
                    enterFrom   = "transform opacity-0 scale-95"
                    enterTo     = "transform opacity-100 scale-95"
                    leave       = "transform ease-in duration-75"
                    leaveFrom   = "transform opacity-100"
                    leaveTo     = "transform opacity-0 scale-95"
                >
                    <Menu.Items className = "absolute right-0 mt-2 w-48 rounded-md bg-gray-100 shadow-lg z-50 dark:bg-gray-800">
                        <div className = "px-1 py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick = {BlockUser}
                                        className = {`
                                            ${
                                                active
                                                ? "bg-red-300 text-red dark:bg-red-700 "
                                                : "text-red-800 "
                                            }
                                            group font-medium flex w-full items-center rounded-md px-2 py-2 text-sm
                                        `}
                                    >

                                        {/* Provide the option to unblock user if they're blocked */}
                                        { conversation.blocked_at && (
                                            <>
                                                <ExclamationTriangleIcon className = "w-4 h-4 mr-2 " />
                                                Unblock User
                                            </>
                                        )}

                                        {/* Provide the option to block user if they're unblocked */}
                                        { !conversation.blocked_at && (
                                            <>
                                                <NoSymbolIcon className = "w-4 h-4 mr-2 " />
                                                Block User
                                            </>
                                        )}
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                        <div className = "px-1 py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick = {changeUserRole}
                                        className = {`
                                            ${
                                                active
                                                ? "bg-green-300 text-green dark:bg-green-700 "
                                                : "text-green-800 "
                                            }
                                            group font-medium flex w-full items-center rounded-md px-2 py-2 text-sm
                                        `}
                                    >

                                        {/* Provide the option to change user's role to administrator */}
                                        { conversation.is_admin && (
                                            <>
                                                <ShieldExclamationIcon className = "w-4 h-4 mr-2 " />
                                                Dismiss as administrator
                                            </>
                                        )}

                                        {/* Provide the option to change user's role to non-administrator */}
                                        { !conversation.is_admin && (
                                            <>
                                                <ShieldCheckIcon className = "w-4 h-4 mr-2 " />
                                                Make administrator
                                            </>
                                        )}
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