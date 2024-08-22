/**
 * A component to display user avatar
 */

const UserAvatar = ({ user, online = null, profile = false }) => {

    // Online status indicator with Daisy UI
    // This will be used for CSS class
    let onlineClass = online === true
        ? "online"
        : "";
    
    // Define how large should the profile photo be
    const sizeClass = profile ? "w-48" : "w-8";

    return (
        <>
            {/* If the user avatar exists then display the avatar*/}
            {user.avatar_url && (
                <div className = {`chat-image avatar ${onlineClass}`}>
                    <div className = {`rounded-full ${sizeClass}`}>
                        <img src = {user.avatar_url} alt = "profile photo" />
                    </div>
                </div>
            )}

            {/* 
                If the user avatar does not exist then use a 
                placeholder with the user's initials
            */}
            {!user.avatar_url && (
                <div className = {`chat-image avatar select-none placeholder ${onlineClass}`}>
                    <div className = {`bg-slate-200 text-zinc-900 rounded-full ${sizeClass} text-center`}>
                        <span className = "text-xl">
                            {user.name.substring(0, 1)}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserAvatar;