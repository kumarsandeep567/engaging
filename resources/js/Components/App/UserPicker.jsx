import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";

export default function UserPicker({ value, options, onSelect }) {

    const [selected, setSelected] = useState(value);
    const [query, setQuery] = useState("");

    // Find users that match the query string
    const filteredPeople = query === ""
    ? options
    : options.filter((person) => 
        person.name
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(query.toLowerCase().replace(/\s+/g, ""))
    );

    const onSelected = (persons) => {
        setSelected(persons);
        onSelect(persons);
    };

    return (
        <>
            <Combobox 
                value={selected}
                onChange={onSelected}
                multiple
            >
                {/* Show available users in the dropdown combobox */}
                <div className="relative mt-1">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                        <Combobox.Input 
                            className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:ring-emerald-600 focus:border-emerald-500 focus:ring-emerald-500 dark:focus:border-emerald-600 rounded-md shadow-sm mt-1 block w-full"
                            displayValue={(persons) => persons.length
                                ? `${persons.length} users selected`
                                : ""
                            }
                            placeholder="Click to view your contacts"
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon 
                                className="w-5 h-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </Combobox.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery("")}
                    >
                        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-100 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {filteredPeople.length === 0 && query !== ""
                                ? (<div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                        User not found (Is the name correct?)
                                    </div>
                                )
                                : (filteredPeople.map((person) => (
                                    <Combobox.Option
                                        key={person.id}
                                        className={({ active }) => 
                                            `relative cursor-default select-none py-2 pl-10 pr-4 
                                            ${active 
                                                ? " bg-teal-600 text-white"
                                                : " bg-gray-100 text-gray-700"
                                            }`    
                                        }
                                        value={person}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${
                                                        selected
                                                        ? "font-medium"
                                                        : "font-normal"
                                                    }`}
                                                >
                                                    {person.name}
                                                </span>
                                                {selected 
                                                    ? (
                                                        <span className={`absolute inset-y-0 left-0 flex items-center pl-3 text-white`}>
                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                        </span>
                                                    )
                                                    : null
                                                }
                                            </>
                                        )}
                                    </Combobox.Option>
                                    ))
                                )
                            }
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>

            {/* Show the list of users selected in the combobox */}
            
            {/* Default member (the group owner) */}

            {selected && (
                <div className="flex flex-wrap gap-2 mt-3">
                    
                    {/* Default member (the group owner) */}
                    <div className="badge badge-lg badge-ghost gap-2">
                        <span className="font-medium text-sm">Owner: You</span>
                    </div>

                    {/* Remaining members */}
                    {selected.map((person) => (
                        <div
                            key={person.id}
                            className="badge badge-lg badge-ghost gap-2"
                        >
                            <span className="font-medium text-sm">{person.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}