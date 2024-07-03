import ChatLayout from "@/Layouts/ChatLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from '@inertiajs/react';

/**
 * Make Home Layout persistent
 */
function Home({ auth }) {
    return (
        <>Messages</>
    );
}

Home.layout = (page) => {
    return (
        <AuthenticatedLayout 
            user = {page.props.auth.user}
        >
            <Head title = "Home" />
            <ChatLayout 
                children = {page}
            >
            </ChatLayout>
        </AuthenticatedLayout>
    );
}

export default Home;