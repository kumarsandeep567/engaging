import {
    Fragment,
    useState, 
    useEffect, 
    useMemo
} from "react";
import {
    PaperClipIcon,
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import {
    isPDF,
    isAudio,
    isImage,
    isVideo,
    isPreviewable
} from "@/helpers";

export default function AttachmentPreviewModal({
    attachments,
    index,
    show = false,
    onClose = () => {}
}) {
    
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fetch the list of previewable attachments
    const previewableAttachments = useMemo(() => {
        return attachments.filter((attachment) => isPreviewable(attachment));
    }, [attachments]);

    // Computed property
    const attachment = useMemo(() => {
        return previewableAttachments[currentIndex];
    }, [attachments, currentIndex]);

    // Close button for the modal
    const close = () => {
        onClose();
    };

    // Previous button for the modal (like a carousal)
    const prev = () => {
        if (currentIndex === 0) {
            return;
        }
        setCurrentIndex(currentIndex - 1);
    };

    // Next button for the modal (like a carousal)
    const next = () => {
        if (currentIndex === previewableAttachments.length - 1) {
            return;
        }
        setCurrentIndex(currentIndex + 1);
    };

    useEffect(() => {
        setCurrentIndex(index);
    }, [index]);

    return (
        <Transition
            show={show}
            as={Fragment}
            leave="duration-200"
        >
            <Dialog
                as="div"
                id="modal"
                className="relative z-50"
                onClose={close}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    {/* Overlay */}
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
                    <div className="h-screen w-screen">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4.sm:translate-y-0.sm:scale-95"
                        >
                            <Dialog.Panel className="flex flex-col w-full h-full transform overflow-hidden bg-black/50 text-left align-middle shadow-xl transition-all rounded-lg">
                            <button 
                                onClick={close}
                                className="absolute right-3 top-3 w-10 h-10 rounded-full bg-gray-100 hover:bg-black/20 transition flex items-center justify-center text-gray-800 z-40"
                            >
                                <XMarkIcon className="w-6 h-6 " />
                            </button>

                            {/* Render the attachments */}
                            <div className="relative group h-full ">
                                {currentIndex > 0 && (
                                    <div
                                        onClick={prev}
                                        className="absolute opacity-100 text-gray-100 cursor-pointer flex items-center justify-center w-16 h-16 left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 z-30"
                                    >
                                        <ChevronLeftIcon className="w-10" />
                                    </div>
                                )}

                                {currentIndex < previewableAttachments.length - 1 && (
                                    <div
                                        onClick={next}
                                        className="absolute opacity-100 text-gray-100 cursor-pointer flex items-center justify-center w-16 h-16 right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 z-30"
                                    >
                                        <ChevronRightIcon className="w-10" />
                                    </div>
                                )}

                                {attachment && (
                                    <div className="flex items-center justify-center w-full h-full p-3">
                                        {isImage(attachment) && (
                                            <img 
                                                src={attachment.url} 
                                                alt="attachment"
                                                className="max-w-prose max-h-prose" 
                                            />
                                        )}

                                        {isVideo(attachment) && (
                                            <div className="flex items-center">
                                                <video 
                                                    src={attachment.url}
                                                    controls
                                                    autoPlay
                                                ></video>

                                            </div>
                                        )}

                                        {isAudio(attachment) && (
                                            <div className="relative flex justify-center items-center">
                                                <audio 
                                                    src={attachment.url}
                                                    controls
                                                    autoPlay
                                                >
                                                </audio>
                                            </div>
                                        )}

                                        {isPDF(attachment) && (
                                            <iframe 
                                                src={attachment.url}
                                                className="w-full h-full"
                                            >
                                            </iframe>
                                        )}

                                        {!isPreviewable(attachment) && (
                                            <div className="p-32 flex flex-col justify-center items-center text-gray-100">
                                                <PaperClipIcon className="w-10 h-10 mb-3" />
                                                <small className="select-none">{attachment.name}</small>
                                            </div>
                                        )}

                                    </div>
                                )}
                            </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}