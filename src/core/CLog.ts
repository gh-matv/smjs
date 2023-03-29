
class Log {

    static SERVER_API_ENDPOINT = "/api/log";

    static buildMessage(...args: any[]) {
        let message = "";
        for (let arg of args) {
            if (typeof arg === "object") {
                message += JSON.stringify(arg);
            } else {
                message += arg;
            }
        }
        return message;
    }

    static getTime() {
        const now = new Date();
        return now.toLocaleTimeString();
    }

    static info(...args: any[]) {
        console.log(...args);
    }

    static error(...args: any[]) {
        console.error(...args);

        const message = Log.buildMessage(...args);
        const time = Log.getTime();

        if(window && window.localStorage) {
            const errors = window.localStorage.getItem("errors");
            if(errors) {
                const errorsArray = JSON.parse(errors);
                errorsArray.push({time, message});
                window.localStorage.setItem("errors", JSON.stringify(errorsArray));
            } else {
                window.localStorage.setItem("errors", JSON.stringify([{time, message}]));
            }
        }
    }

    static warn(...args: any[]) {
        console.warn(...args);
    }

    static debug(...args: any[]) {
        console.log("%c[DEBUG] ", "color: blue", ...args);
    }

    static SendErrorsToServer() {
        if(window && window.localStorage) {
            const errors = window.localStorage.getItem("errors");
            if(errors) {
                const errorsArray = JSON.parse(errors);
                if(errorsArray.length > 0) {
                    const errorsToSend = errorsArray.splice(0, 10);
                    window.localStorage.setItem("errors", JSON.stringify(errorsArray));
                    // @ts-ignore
                    const _ = fetch( Log.SERVER_API_ENDPOINT, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(errorsToSend)
                    });
                }
            }
        }
    }
}

export default Log;
