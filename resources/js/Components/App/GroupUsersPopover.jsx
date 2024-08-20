import { Fragment } from "react";
import { Link } from "@inertiajs/react";
import { Popover, Transition } from "@headlessui/react";
import { ArrowTopRightOnSquareIcon, UsersIcon } from "@heroicons/react/24/outline";
import UserAvatar from "@/Components/App/UserAvatar";

export default function GroupUsersPopover({ users = [] }) {
    return (
        <Popover className="relative">
            {({ open }) => (
                <>
                    <Popover.Button className={`${
                        open 
                        ? "text-emerald-600"
                        : "text-gray-800"
                    } hover:text-gray-500 tooltip tooltip-left`
                    }>
                        <UsersIcon className="w-6" />
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute right-0 z-50 mt-3 w-[200px] px-4 sm:px-0">
                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                            <div className="bg-gray-100 py-2">
                                <h4 className="text-md mb-3 pt-2 pl-4 select-none font-bold">
                                        Group members
                                </h4>
                                {users.map((user) => (
                                    <Link
                                        href={route("chat.user", user.id)}
                                        key={user.id}
                                        className="flex items-center gap-2 py-2 px-3 hover:bg-black/10"
                                    >
                                        <UserAvatar user={user} />
                                        <div className="text-xs font-medium">
                                            {user.name}
                                        </div>
                                        <div>
                                            <ArrowTopRightOnSquareIcon className="w-4 text-gray-500" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}