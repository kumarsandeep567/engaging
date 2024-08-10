/**
 * =============================================================================
 * Helpers a.k.a utility functions that will be used across the application, 
 * when needed.
 * =============================================================================
 */

/**
 * A helper function to format the message date as a long string.
 */

const formatMessageDate = (date, longString=false) => {
    const now       = new Date();
    const givenDate = new Date(date);

    if (isToday(givenDate, now)) {
        return givenDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true 
        });
    } else if (isYesterday(givenDate, now)) {
        let dateString = "Yesterday";
        if (longString) {
            dateString = dateString.concat(" ", givenDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true 
            }));
        }
        return dateString;
    } else if (givenDate.getFullYear() === now.getFullYear()) {
        return givenDate.toLocaleDateString([], {
            day: "2-digit",
            month: "short"
        });
    } else {
        return givenDate.toLocaleDateString([], {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }
};


/**
 * A helper function to check if given date is the current date.
 */

export const isToday = (date, today) => {
    return (
        date.getDate()      === today.getDate()     &&
        date.getMonth()     === today.getMonth()    &&
        date.getFullYear()  === today.getFullYear()
    );
};


/**
 * A helper function to check if given date is yesterday.
 */

export const isYesterday = (date, yesterday) => {
    yesterday.setDate(yesterday.getDate() - 1);
    return (
        date.getDate()      === yesterday.getDate()     &&
        date.getMonth()     === yesterday.getMonth()    &&
        date.getFullYear()  === yesterday.getFullYear()
    );
};

/**
 * A helper function to truncate texts.
 */

export const truncateText = (text, maxLength = 34) => {

    if (!text) {
        return;
    }

    if (text.length <= maxLength) {
        return text;
    }
    
    // Length of the text exceeds the specified length, truncate it.
    let truncated = text.slice(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');

    if (lastSpaceIndex > 0) {
        truncated = truncated.slice(0, lastSpaceIndex).concat(' ...');
    }

    return truncated;
};


/**
 * A helper function to check if given file is an image.
 */

export const isImage = (attachment) => {
    let mime = attachment.mime || attachment.type;
    mime = mime.split("/");
    return mime[0].toLowerCase() === "image";
};


/**
 * A helper function to check if given file is a video.
 */

export const isVideo = (attachment) => {
    let mime = attachment.mime || attachment.type;
    mime = mime.split("/");
    return mime[0].toLowerCase() === "video";
};


/**
 * A helper function to check if given file is an audio.
 */

export const isAudio = (attachment) => {
    let mime = attachment.mime || attachment.type;
    mime = mime.split("/");
    return mime[0].toLowerCase() === "audio";
};


/**
 * A helper function to check if given file is a PDF.
 */

export const isPDF = (attachment) => {
    let mime = attachment.mime || attachment.type;
    mime = mime.split("/");
    return mime[0] === "application" && mime[1] === "pdf";
};


/**
 * A helper function to check if the given file can be previewed.
 */

export const isPreviewable = (attachment) => {
    return (
        isImage(attachment) ||
        isVideo(attachment) ||
        isAudio(attachment) ||
        isPDF(attachment)
    );
};


/**
 * A helper function to format the file size.
 */

export const fileSizeInBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];

    let _index = 0;
    let _size = bytes;
    while (_size >= k) {
        _size /= k;
        _index++;
    }

    return parseFloat(_size.toFixed(dm)) + " " + sizes[_index];
};

export default formatMessageDate;