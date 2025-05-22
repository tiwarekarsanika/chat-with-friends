'use client'

import React, { useEffect, useRef } from "react";
import TypeIt from "typeit";

const Typewriter = () => {
    const el = useRef(null); // Ref to the element where typing happens
    const typeInstance = useRef(null);

    useEffect(() => {
        typeInstance.current = new TypeIt(el.current, {
            speed: 50,
            waitUntilVisible: true,
            loop: true,
            deleteSpeed: 30
        })
            .type("Connect with your Friends.")
            .pause(1000)
            .delete(27) // Length of "Connect with your Friends."
            .type("Connect with your Coworkers.")
            .pause(1000)
            .delete(30) // Length of "Connect with your Coworkers."
            .type("Connect with your Customers.")
            .pause(1000)
            .delete(29) // Length of "Connect with your Customers."
            .go();

        // Cleanup on unmount
        return () => {
            typeInstance.current?.destroy();
        };
    }, []);

    return <span ref={el}></span>;
};

export default Typewriter;
