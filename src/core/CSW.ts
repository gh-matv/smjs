/**
 * @class SW
 * @description This class manages the unique shared worker instance, that's shared among all the components.
 *              It is used to exchange data to and from the shared worker, which will, in turn, communicate
 *              with the relay server, to the other clients and to the server.
 * @example [todo]
 */
export class SW {

    static instance:SW|null = null;

    static getInstance() {
        if(!SW.instance) {
            SW.instance = new SW();
        }
        return SW.instance;
    }

    private _sw:SharedWorker | null = null;

    constructor() {
        if(typeof SharedWorker === 'undefined') return;

        this._sw = new SharedWorker('/sw.js', {name: 'sw'});
        this._sw.port.start();

        this._sw.port.onmessage = this.OnMessageFromSW;

        this._sw.port.postMessage("open");
    }

    callbacks : ((message:any)=>void)[] = [];
    OnMessageFromSW(ev: MessageEvent<any>) {
        // console.log("%c[SW] Received message from shared worker\n", "color: blue", ev.data);
        SW.instance?.callbacks.forEach(cb => cb(ev.data));
    }

    subscribe(callback: (message:any)=>void) {
        this.callbacks.push(callback);
    }

    unsubscribe(callback: (message:any)=>void) {
        this.callbacks = this.callbacks.filter(cb => cb !== callback);
    }

}


