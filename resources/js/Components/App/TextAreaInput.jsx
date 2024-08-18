import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextAreaInput({ 
    className = '', 
    isFocused = false, 
    ...props 
}, ref) {
    
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <textarea
            {...props}
            className={
                'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-emerald-500 dark:focus:border-emerald-600 focus:ring-emerald-500 dark:focus:ring-emerald-600 rounded-md shadow-sm ' +
                className
            }
            ref={input}
        ></textarea>
    );
});
