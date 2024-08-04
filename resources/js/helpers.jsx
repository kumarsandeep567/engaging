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

export default formatMessageDate;