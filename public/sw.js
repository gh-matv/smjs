/**
 * This is a shared worker, which means it is shared between all tabs
 *
 */

/**
 * List of all ports
 * Each port is an object with a MessagePort and a boolean indicating if the tab is active
 * A port represents basically a tab, and the boolean indicates if the tab is focused
 * @type {{port:MessagePort, active:boolean}[]}
 */
let ports = [];

/**
 * The last active port (the last tab that was focused)
 * We can use ports.find(p => p.active) to get the active port, but this is a bit faster
 * @type {MessagePort}
 */
let last_active_port = null;

/**
 * Broadcast a message to all ports
 * @param msg {any}
 */
const broadcast = (msg) => {
    ports.forEach(port => port.port.postMessage(msg));
}

/**
 * When a tab is focused, we set the last_active_port to the port of the tab
 * We also update the tab as "active" in the ports array, and the other tabs as "inactive"
 * @param port {MessagePort}
 */
const onFocus = (port) => {
    last_active_port = port;
    let port_id = ports.findIndex(p => p.port === port);
    broadcast("focus changed to id: " + port_id);
    ports.forEach(p => p.active = p.port === port);
}

/**
 * When a tab is closed, we remove it from the ports array
 * @param port {MessagePort}
 */
const onClose = (port) => {
    ports = ports.filter(p => p.port !== port);
    broadcast("Remaining: " + ports.length);
}

onconnect = function(e) {

    /** @type {MessagePort} */
    const port = e.ports[0];
    ports.push({port, active: true});

    port.postMessage("Connected to shared worker !");
    broadcast("New client connected ! Remaining: " + ports.length);

    port.onmessage = function(e) {
        switch (e.data) {

            case "ping":
                port.postMessage("pong");
                break;

            case "close": // When the user closes the tab
                onClose(port);
                break;

            case "focus": // When the user focuses the tab
                onFocus(port);
                break;

            case "blur": // When the user blurs the tab
                // Ignored intentionally.
                // The tab will be set as inactive when another tab is focused (see onFocus)
                break;

        }
    }
}


