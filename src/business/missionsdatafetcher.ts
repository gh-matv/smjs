import {SW} from "@/core/CSW";

export class missionsdatafetcher {

    _sw = SW.getInstance();

    constructor() {
        this._sw.subscribe(this.OnMessageFromSW);
    }

    destroy() {
        // @ts-ignore
        //this._sw.port().removeEventListener('message', this.handleMessage);
        // this._sw.destroy();
        this._sw.unsubscribe(this.handleMessage);
    }

    callbacks : ((message:any)=>void)[] = [];

    OnMessageFromSW(ev: MessageEvent<any>) {
        // console.log("%c[SW] Received message from shared worker\n", "color: blue", ev.data);
        this.callbacks.forEach(cb => cb(ev.data));
    }

    subscribe(callback: (message:any)=>void) {
        this.callbacks.push(callback);
    }

    unsubscribe(callback: (message:any)=>void) {
        this.callbacks = this.callbacks.filter(cb => cb !== callback);
    }

}