import {useEffect, useState} from "react";

export default function useSharedWorker() {

	if(typeof SharedWorker === 'undefined') return;
	const sw = new SharedWorker('/sw.js');

	const shared_worker = new SharedWorker('/sw.js', )
	shared_worker.port.start()

	setInterval(() => {
		shared_worker.port.postMessage('test');
	}, 1000);

	shared_worker.port.onmessage = function(e) {
		console.log(e.data);
	}

	function handleBeforeUnload() {
		shared_worker.port.postMessage('close');
	}

	function handleBlur() {
		shared_worker.port.postMessage('blur');
	}

	function handleFocus() {
		shared_worker.port.postMessage('focus');
	}

	window.addEventListener('beforeunload', handleBeforeUnload);
	window.addEventListener('blur', handleBlur);
	window.addEventListener('focus', handleFocus);

	return () => {
		window.removeEventListener('beforeunload', handleBeforeUnload);
		window.removeEventListener('blur', handleBlur);
		window.removeEventListener('focus', handleFocus);
	}
}