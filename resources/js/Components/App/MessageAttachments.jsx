import { 
    PlayCircleIcon,
    ArrowDownTrayIcon,
    DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import { 
    isPDF,
    isImage,
    isAudio,
    isVideo,
    isPreviewable
} from "@/helpers";

const MessageAttachments = ({ attachments, attachmentClick }) => {
    return (
        <>
            {attachments.length > 0 && (
                <div className="mt-2 flex flex-wrap justify-end gap-1">
                    {attachments.map((attachment, ind) => (
                        <div
                            onClick={(ev) => attachmentClick(attachments, ind)}
                            key={attachment.id}
                            className={
                                ` group flex flex-col items-center justify-center text-gray-500 relative cursor-pointer ` + (
                                    isAudio(attachment)
                                    ? "w-84"
                                    : "w-32 aspect-square bg-black/0 rounded-lg"
                            )}
                        >
                            {/* Provide a download button if the attachment is not an audio */}
                            {/* For audio attachments, utilize the browser's built-in download feature */}
                            {!isAudio(attachment) && (
                                <a
                                    onClick={(ev) => ev.stopPropagation()}
                                    download
                                    href={attachment.url}
                                    className="z-20 opacity-100 group-hover:opacity-100 transition-all w-8 h-8 flex items-center justify-center text-gray-100 bg-gray-600 rounded absolute right-0 top-0 cursor-pointer hover:bg-gray-800"
                                >
                                    <ArrowDownTrayIcon className="w-4 h-4" />
                                </a>
                            )}

                            {/* Image attachments */}
                            {isImage(attachment) && (
                                <img 
                                    src={attachment.url}
                                    alt="image"
                                    className="object-contain aspect-square"
                                />
                            )}

                            {/* Video attachments */}
                            {isVideo(attachment) && (
                                <div className="relative flex justify-center items-center">
                                    <PlayCircleIcon className="z-20 absolute w-10 h-10 text-white opacity-70" />

                                    {/* This <div> is needed to trigger the attachmentClick() method */}
                                    {/* Removing it will cause the video to directly start playing */}
                                    <div className="absolute left-0 top-0 w-full h-full bg-black/50 z-10"></div>
                                    <video src={attachment.url}></video>
                                </div>
                            )}

                            {/* Audio attachments */}
                            {isAudio(attachment) && (
                                <div className="relative flex justify-center items-center">
                                    <audio 
                                        src={attachment.url}
                                        controls
                                    ></audio>
                                </div>
                            )}

                            {/* PDF attachments */}
                            {isPDF(attachment) && (
                                <div className="relative flex justify-center items-center">

                                    {/* This <div> is needed to trigger the attachmentClick() method */}
                                    {/* Removing it will cause the video to directly start playing */}
                                    <div className="absolute left-0 top-0 right-0 bottom-0"></div>
                                    <iframe 
                                        src={attachment.url}
                                        className="w-full h-full"
                                    ></iframe>
                                </div>
                            )}

                            {/* If the attachment cannot be previewed (such as a zip file) */}
                            {!isPreviewable(attachment) && (
                                <a
                                    onClick={(ev) => ev.stopPropagation()}
                                    download
                                    href={attachment.url}
                                    className="flex flex-col justify-center items-center"
                                >
                                    <DocumentArrowDownIcon className="w-10 h-10 mb-3" />

                                    {/* Show the name of the attachment */}
                                    <small className="text-center text-gray-800">
                                        {attachment.name}
                                    </small>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default MessageAttachments;