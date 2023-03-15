import {useEffect, useState} from "react";
import {missionsdatafetcher} from "@/business/missionsdatafetcher";

export default function useMissionData(name:string) {
	const [sw, setSw] = useState<missionsdatafetcher|null>(null);
	const [data, setData] = useState<any>(null);

	useEffect(() => {
		const sw = new missionsdatafetcher();
		setSw(sw);

		const handleMessage = (message:any) => {
			setData(message);
		}

		sw.subscribe(handleMessage);

		return () => {
			sw.unsubscribe(handleMessage);
			sw.destroy();
		}
	}, []);

	return data;
}