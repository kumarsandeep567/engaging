import { useEffect, useRef } from "react";

const NewMessageInput = ({ value, onChange, onSend }) => {
    const input = useRef();

    const onInputKeyDown = (ev) => {

        // Send the message only if the Enter (or Return) key is pressed
        if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            onSend();
        }
    };

    const onChangeEvent = (ev) => {
        setTimeout(() => {
            
            // Adjust the height of the input text field if the Shift+Enter keys
            // are pressed together
            adjustHeight(); 
        }, 10);
        onChange(ev);
    };

    // Adjust the height of the text area
    const adjustHeight = () => {
        setTimeout(() => {

            // Set the height of the input text field based on the 
            // number of lines
            input.current.style.height = "auto";
            input.current.style.height = input.current.scrollHeight + 1 + "px";
        }, 100);
    };

    useEffect(() => {
        adjustHeight();
    }, [value]);

    return (
        <textarea 
            ref={input}
            value={value}
            rows="1"
            placeholder="Type a message ..."
            onKeyDown={onInputKeyDown}
            onChange={(ev) => onChangeEvent(ev)}
            className="w-3/4 rounded-xl resize-none border-gray-300 focus:border-emerald-500 dark:focus:border-emerald-600 focus:ring-emerald-500 overflow-y-auto max-h-40 mx-2 shadow-sm"
        >
        </textarea>
    );
};

export default NewMessageInput;