import {useEffect, useState} from "react";

export default function useSharedWorker() {

	const defSWValue = typeof SharedWorker === 'undefined' ? null : new SharedWorker('/sw.js');
	const [sw, setSw] = useState<SharedWorker | null>(null);

	// At first, create a shared worker and assign it to the state
	useEffect(() => {
		if(typeof SharedWorker === 'undefined') return;
		const shared_worker = new SharedWorker('/sw.js');
		setSw(shared_worker);
	}, []);

	// Then, add event listeners to the shared worker
	useEffect(() => {

		if(!sw) return;

		sw.port.onmessage = function(e) {
			console.log(e.data);
		}

		function handleBeforeUnload() {
			sw?.port.postMessage('close');
		}

		function handleBlur() {
			sw?.port.postMessage('blur');
		}

		function handleFocus() {
			sw?.port.postMessage('focus');
		}

		window.addEventListener('beforeunload', handleBeforeUnload);
		window.addEventListener('blur', handleBlur);
		window.addEventListener('focus', handleFocus);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
			window.removeEventListener('blur', handleBlur);
			window.removeEventListener('focus', handleFocus);
		}

	}, [sw]);
}