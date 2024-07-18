/**
 * A component to display group avatar with its users
 */

import { UsersIcon } from "@heroicons/react/24/solid";

const GroupAvatar = ({}) => {

    return (
        <>
            <div className = {`avatar placeholder `}>
                <div className = {`bg-gray-300 text-gray-800 rounded-full w-8 h-8`}>
                    <span className = "text-xl">
                        <UsersIcon className = "w-5" />
                    </span>
                </div>
            </div>
        </>
    );
};

export default GroupAvatar;