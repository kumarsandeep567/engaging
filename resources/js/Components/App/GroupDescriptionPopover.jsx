import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function GroupDescriptionPopover({ description }) {
    return (
        <Popover className="relative">
            {({ open }) => (
                <>
                    <Popover.Button 
                        className={`${
                            open 
                            ? "text-emerald-600"
                            : "text-gray-800"} 
                            hover:text-gray-500 tooltip tooltip-left`
                        }
                        data-tip="View description"
                    >
                        <InformationCircleIcon className="w-6" />
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
                        <Popover.Panel className="absolute right-0 z-50 mt-3 w-[300px] px-4 sm:px-0">
                            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                                <div className="bg-gray-100 p-4">
                                    <h4 className="text-md mb-3 select-none font-bold">
                                        Group Description
                                    </h4>
                                    {description && (
                                        <div className="text-md">
                                            {description}
                                        </div>
                                    )}
                                    {!description && (
                                        <div className="text-xs text-gray-500 text-center py-4">
                                            <i>No description... Such empty -.- </i>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}