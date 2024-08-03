/**
 * The purpose of this Event Bus is act as a centralized point for all events
 * in order to promote simplified logging, monitoring, and debugging.
 * Should this application be scaled, the Event Bus will help distribute the 
 * load across multiple servers.
 */

import React from "react";

export const EventBusContext = React.createContext();

export const EventBusProvider = ({ children }) => {

    /**
     * The events will be a dictionary of key:value pairs where the key
     * will be the name of the event and the value will be the callback
     * function
     */
    const [events, setEvents] = React.useState({});

    /** 
     * The emit() function will go through the events, and for each event, 
     * it will execute a series of callback functions.
    */
    const emit = (name, data) => {
        if (events[name]) {
            for (let _callback of events[name]){
                _callback(data);
            }
        }
    };

    /**
     * The on() function will keep tract of events and their callback functions
     * and stop listening to them when needed.
     */
    const on = (name, _callback) => {
        if (!events[name]) {
            events[name] = [];
        }
        events[name].push(_callback);

        // Think of this as on off() function (like deactivate) for the on() function
        return () => {
            events[name] = events[name].filter(
                (callback) => callback !== _callback
            );
        };
    };

    return (
        <EventBusContext.Provider value = {{emit, on}}>
            {children}
        </EventBusContext.Provider>
    );
};

export const useEventBus = () => {
    return React.useContext(EventBusContext);
};