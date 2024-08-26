/**
 * This component will provide a modal to edit the group details such as
 * choosing the members of the group, setting the group description, etc.
 * Since the number of input fields are at most 5, it made sense to put it
 * in a modal. (Change to full webpage if needed)
 */

import TextAreaInput from "@/Components/App/TextAreaInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import UserPicker from "@/Components/App/UserPicker";
import { useEffect, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { useEventBus } from "@/EventBus";

export default function GroupModal({ show = false, onClose = () => {}}) {

    const page = usePage();
    const conversations = page.props.conversations;
    const { on, emit } = useEventBus();
    const [group, setGroup] = useState({});

    // The modal will contain a form to edit the group details
    const {
        data,
        setData,
        processing,
        reset,
        post,
        put,
        errors
    } = useForm({
        id: "",
        name: "",
        description: "",
        user_ids: []
    });

    // Get a list of conversations that are personal chats
    const users = conversations.filter((c) => !c.is_group);

    // Method to create a new group or update an existing group
    const createOrUpdateGroup = (e) => {
        e.preventDefault();

        if (group.id) {

            // Inertia will automatically send the form data (defined above)
            // when the put() method is invoked
            put(route("group.update", group.id), {
                onSuccess: () => {
                    closeModal();
                    emit("toast.show", `Group "${data.name}" just got updated`);
                }
            });

            return;
        }
        post(route("group.store"), {
            onSuccess: () => {
                emit("toast.show", `Group "${data.name}" was created`);
                closeModal();
            }
        });
    };

    // Method to close the modal
    const closeModal = () => {
        reset();
        onClose();
        setTimeout(() => {
            setGroup({});
        }, 1000);
    };

    useEffect(() => {
        return on("GroupModal.show", (group) => {
            setData({
                name: group.name,
                description: group.description,
                user_ids: group.users
                    .filter((u) => group.owner_id !== u.id)
                    .map((u) => u.id)
            });
            setGroup(group);
        });
    }, [on]);

    return (
        <Modal
            show={show}
            onClose={closeModal}
        >
            <form
                onSubmit={createOrUpdateGroup}
                className="p-6 overflow-y-auto"
            >
                {/* Modal header */}
                <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 select-none">
                    {group.id 
                        ? `Edit Group "${group.name}"`
                        : "Create a new group"
                    }
                </h2>

                {/* Form fields */}

                {/* The group name field */}
                <div className="mt-8 select-none">
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput 
                        id="name"
                        className="mt-1 block w-full disabled:bg-gray-100"
                        value={data.name}
                        disabled={!!group.id}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* The group description field */}
                <div className="mt-4 select-none">
                    <InputLabel htmlFor="description" value="Description" />
                    <TextAreaInput 
                        id="description"
                        rows="3"
                        className="mt-1 block w-full resize-none"
                        value={data.description || ""}
                        onChange={(e) => setData("description", e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.description} />
                </div>

                {/* The group members field */}
                <div className="mt-4 select-none">
                    <InputLabel value="Select Members" />

                    {/* Show the group members except the group owner */}
                    <UserPicker 
                        value={
                            users.filter(
                                (u) => group.owner_id !== u.id &&
                                    data.user_ids.includes(u.id)
                            ) || []
                        }
                        options={users}
                        onSelect={(users) => 
                            setData("user_ids", users.map((u) => u.id))
                        }

                    />
                    <InputError className="mt-2" message={errors.user_ids} />
                </div>


                {/* Modal footer */}
                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={closeModal}>
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton className="ms-3" disabled={processing}>
                        {group.id ? "Update" : "Create"}
                    </PrimaryButton>
                </div>
            </form>

        </Modal>
    );
}