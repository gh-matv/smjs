/**
 * This is a shared worker, which means it is shared between all tabs
 * We use it so only the active tab receives the messages and the updates, saving bandwidth and CPU
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
 * Broadcast a message to all port,
 * including the inactive ones (the ones that are not focused)
 * @param msg {any}
 */
const broadcast = (msg) => {
    console.log("Broadcasting: " + msg)
    ports.forEach(port => port.port.postMessage(msg));
}

/**
 * Broadcast a message to all active ports
 * Tabs in the background will not receive the message
 * @param msg
 */
const broadcastToActive = (msg) => {
    console.log("Broadcasting to active: " + msg)
    ports.filter(p => p.active).forEach(port => port.port.postMessage(msg));
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
 * When a tab is closed, or a component stops, we remove it from the ports array
 * @param port {MessagePort}
 */
const onClose = (port) => {
    ports = ports.filter(p => p.port !== port);
    broadcast("Client disconnected ! Remaining: " + ports.length);
}

const onOpen = (port) => {
    ports.push({port, active: true});
    broadcast("New client connected ! Remaining: " + ports.length);
}

setInterval(async () => {
    const x = await fetch("api/hello").then(r => r.json());
    console.log(x);
    broadcastToActive({id: x.id, data: x.data});
}, 1000);

setInterval(async () => {
    const x = await fetch("https://random-data-api.com/api/v2/users?size=2").then(r => r.json());
    broadcast("IMPORTANT QMLDFKSJKLQMDSJKFKQDSJFMLKJ");
}, 5000);

onconnect = function(e) {

    /** @type {MessagePort} */
    const port = e.ports[0];
    ports.push({port, active: true});

    port.postMessage("Connected to shared worker !");
    broadcast("New client connected ! Remaining: " + ports.length);

    port.onmessage = function(e) {
        switch (e.data) {

            case "ping":
                console.log("PING>PONG")
                port.postMessage("pong");
                break;

            case "close": // When the user closes the tab
                onClose(port);
                break;

            case "focus": // When the user focuses the tab
                onFocus(port);
                break;

            case "blur": // When the user blurs the tab
                ports.find(p => p.port === port).active = false;
                break;

        }
    }
}


