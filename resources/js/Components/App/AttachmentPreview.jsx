import React from "react";
import {
    DocumentTextIcon, 
    FilmIcon, 
    PaperClipIcon
} from "@heroicons/react/24/outline";
import {
    fileSizeInBytes, 
    isPDF, 
    isPreviewable, 
    isVideo, 
    truncateText
} from "@/helpers";

const AttachmentPreview = ({ file }) => {
    return (
        <div className="w-full flex items-center gap-2 py-2 px-3 rounded-md bg-slate-300">
            <div>
                
                {/* Show icons based on file type (except audio files) */}
                {isPDF(file.file) && <DocumentTextIcon className="w-8" />}
                {isVideo(file.file) && <FilmIcon className="w-8" />}
                {!isPreviewable(file.file) && (
                    <div className="flex justify-center items-center w-10 h-10 bg-gray-100 rounded">
                        <PaperClipIcon className="w-6" />
                    </div>
                )}
            </div>

            <div className="flex-1 text-gray-400 text-nowrap text-ellipsis overflow-hidden">

                {/* Show the file name and file size */}
                <h3 className="text-slate-800">{truncateText(file.file.name, 25)}</h3>
                <p className="text-xs text-slate-500">
                    {fileSizeInBytes(file.file.size)}
                </p>
            </div>
        </div>
    );
};

export default AttachmentPreview;