/**
 * This component will provide a modal to edit the group details such as
 * choosing the members of the group, setting the group description, etc.
 * Since the number of input fields are at most 5, it made sense to put it
 * in a modal. (Change to full webpage if needed)
 */

import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { useForm, usePage } from "@inertiajs/react";
import { useEventBus } from "@/EventBus";
import Checkbox from "@/Components/Checkbox";
import { HeartIcon } from "@heroicons/react/24/solid";

export default function NewUserModal({ show = false, onClose = () => {}}) {
    const { emit } = useEventBus();
    const appName = import.meta.env.VITE_APP_NAME || 'NULL';

    // The modal will contain a form to edit the group details
    const {
        data,
        setData,
        processing,
        reset,
        post,
        errors
    } = useForm({
        name: "",
        email: "",
        is_admin: false
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("user.store"), {
            onSuccess: () => {
                emit("toast.show", `Sent invite to "${data.name}"`);
                closeModal();
            }
        });
    };

    // Method to close the modal
    const closeModal = () => {
        reset();
        onClose();
    };

    return (
        <Modal
            show={show}
            onClose={closeModal}
        >
            <form
                onSubmit={submit}
                className="p-6 overflow-y-auto"
            >
                {/* Modal header */}
                <div>
                    <div className="flex items-center">
                        <span className="flex text-xl font-medium pr-1 text-gray-900 dark:text-gray-100 select-none">
                            Invite people to {appName} Messenger!
                        </span>
                        <HeartIcon className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="text-sm text-gray-500 select-none">
                        We'll send them an invite via email
                    </span>
                </div>

                {/* Form fields */}

                {/* The name field */}
                <div className="mt-8 select-none">
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput 
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* The email field */}
                <div className="mt-4 select-none">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput 
                        id="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {/* The Make Administrator field */}
                <div className="mt-4 select-none flex items-center">
                    <InputLabel htmlFor="admin" value="Make Administrator" className="pr-2" />
                    <Checkbox 
                        id="admin"
                        name="is_admin"
                        checked={data.is_admin}
                        onChange={(ev) => setData('is_admin', ev.target.checked)}
                    />
                    <InputError className="mt-2" message={errors.admin} />
                </div>


                {/* Modal footer */}
                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={closeModal}>
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton className="ms-3" disabled={processing}>
                        Invite
                    </PrimaryButton>
                </div>
            </form>

        </Modal>
    );
}