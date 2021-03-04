import { Session } from "./app/Session.js";

let session = new Session();

function render(ts: number) {
    session.panes.render(ts);
    session.canvas.render(ts);
    window.requestAnimationFrame(render);
}

window.requestAnimationFrame(render);