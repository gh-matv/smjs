import { SW } from "@/core/CSW";
import { useEffect, useState } from "react";

/**
 * This hook will return true if the current page is active (focused)
 * It also signals the SW if the page is active or not, so that it can
 *  stop the sending of data to the page if it is not active.
 * 
 * This doesnt fetch any data from the SW.
 * 
 * We dont have to worry about the SW being destroyed, because the SW
 *  will be destroyed when the page is closed, and the SW will send
 *  a message to the page to unsubscribe from it.
 * 
 * Only one instance must be created per page.
 * 
 * @returns true if the current page is active (focused)
 * 
 * @example ```ts
 * // Only in the main page template
 * const active = useCurrentPageActive();
 * ```
 * 
 * @emits string "focus" when the page is focused
 * @emits string "blur" when the page is blurred
 * 
 * @satisfies SW-REQ-1 Only receive data on active pages
 * @satisfies SW-REQ-2 Only send data to active pages
 * 
 * 
 */
export default function useCurrentPageActive() {
    
    const [swInstance, _] = useState<SW>(SW.getInstance());
    const [active, setActive] = useState(true);

    useEffect(() => {
        const onFocus = () => { 
            setActive(true);

            if(swInstance && swInstance.port) {
                swInstance.port.postMessage("focus");
            }
        }

        const onBlur = () => {
            setActive(false);

            if(swInstance && swInstance.port) {
                swInstance.port.postMessage("blur");
            }
        };

        window.addEventListener("focus", onFocus);
        window.addEventListener("blur", onBlur);

        return () => {
            window.removeEventListener("focus", onFocus);
            window.removeEventListener("blur", onBlur);
        };
    }, []);

    return active;
}

