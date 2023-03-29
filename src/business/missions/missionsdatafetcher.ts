import {SW} from "@/core/CSW";

export class missionsdatafetcher {

    _sw = SW.getInstance();

    constructor() {
        this._sw.subscribe(this.OnMessageFromSW.bind(this));

        window.addEventListener("focus", this.event_focus);
        window.addEventListener("blur", this.event_blur);
    }

    event_focus = (ev:FocusEvent) => {
        this._sw.port.postMessage("focus");
    }

    event_blur = (ev:FocusEvent) => {
        this._sw.port.postMessage("blur");
    }

    destroy() {
        // @ts-ignore
        //this._sw.port().removeEventListener('message', this.handleMessage);
        // this._sw.destroy();
        this._sw.unsubscribe(this.OnMessageFromSW.bind(this));

        window.removeEventListener("focus", this.event_focus);
        window.removeEventListener("blur", this.event_blur);
    }

    callbacks : ((message:any)=>void)[] = [];

    OnMessageFromSW(ev: MessageEvent<any>) {
        // console.log("%c[SW] Received message from shared worker\n", "color: cyan", ev.data);
        this.callbacks.forEach(cb => cb(ev.data));
    }

    subscribe(callback: (message:any)=>void) {
        this.callbacks.push(callback);
    }

    unsubscribe(callback: (message:any)=>void) {
        this.callbacks = this.callbacks.filter(cb => cb !== callback);
    }



}
