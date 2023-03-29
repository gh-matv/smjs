import { SW } from "@/core/CSW";
import { useEffect, useState } from "react";

export default function useUpdateDataById<T>(id: string) {

    const [swInstance, _] = useState<SW>(SW.getInstance());
    const [data, setData] = useState<T>();
    const [loading, setLoading] = useState(true);

    const handleMessage = (message:any) => {
        // console.log("Received message from shared worker", message);
        // console.log("%c[SW] Received message from shared worker\n", "color: orange", message);
        setData(message.data);
        setLoading(false);
    }

    useEffect(() => {
        console.log("%c[SW] Subscribing to id: " + id, "color: green")
        const index = swInstance.subscribeById(id, handleMessage);
        return () => {
            console.log("%c[SW] Unsubscribing from id: " + id, "color: red")
            swInstance.unsubscribeById(id, index!-1);
        }
    }, []);

    return {data, loading};
}
