import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import UserAvatar from '@/Components/App/UserAvatar';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        avatar: null,
        email: user.email,

        // For profile update route, Laravel expects a patch() method instead of 
        // post() method. But patch() method does not accept files as input data. 
        // To overcome this, _method= has to be provided in the form that will 
        // be sent out via the post() method on the React side to tell Laravel 
        // to map this post() method to a patch() method.
        _method: 'PATCH'
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('profile.update'));
    };

    return (
        <>
            <section className='max-w-4xl'>
                <header>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Profile Information</h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Update your account's profile information and email address.
                    </p>
                </header>

                <div className="flex gap-8">
                    <div className="flex-grow w-full">
                        <form onSubmit={submit} className="mt-6 space-y-6">
                            <div>
                                <InputLabel htmlFor="name" value="Name" />

                                <TextInput
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    isFocused
                                    autoComplete="name"
                                />

                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email" />

                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoComplete="username"
                                />

                                <InputError className="mt-2" message={errors.email} />
                            </div>

                            <div>
                                <InputLabel htmlFor="avatar" value="Profile Picture" className='pb-1'/>

                                <input 
                                    id='avatar'
                                    type="file" 
                                    className='file-input file-input-bordered w-full max-w-xs'
                                    onChange={(e) => setData('avatar', e.target.files[0])}
                                />
                                <p className='mt-1 text-sm text-gray-400 select-none'>Images upto 1MB are allowed</p>

                                <InputError className="mt-2" message={errors.avatar} />
                            </div>

                            {mustVerifyEmail && user.email_verified_at === null && (
                                <div>
                                    <p className="text-sm mt-2 text-gray-800 dark:text-gray-200">
                                        Your email address is unverified.
                                        <Link
                                            href={route('verification.send')}
                                            method="post"
                                            as="button"
                                            className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                                        >
                                            Click here to re-send the verification email.
                                        </Link>
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <div className="mt-2 font-medium text-sm text-green-600 dark:text-green-400">
                                            A new verification link has been sent to your email address.
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>Save</PrimaryButton>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Saved.</p>
                                </Transition>
                            </div>
                        </form>
                    </div>
                    <div className='ml-28 mt-10'>
                        <UserAvatar user={user} profile={true} />
                    </div>
                </div>
            </section>
        </>
    );
}
