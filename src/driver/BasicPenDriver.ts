import { Session } from "../app/Session.js";
import { PenDriver } from "./PenDriver.js";

export class BasicPenDriver implements PenDriver {
    name = "Basic pen driver";
    manufacturer = "Papercanvas Contributors";
    onDriverLoad(session: Session) {
        let canvas = session.canvas;
        canvas.display.addEventListener("pointerdown", event => {
            canvas.sendInput(event.offsetX, event.offsetY, event.pressure);
        });
        canvas.display.addEventListener("pointermove", event => {
            canvas.sendInput(event.offsetX, event.offsetY, event.pressure);
        });
        canvas.display.addEventListener("pointerup", event => {
            canvas.sendInput(event.offsetX, event.offsetY, event.pressure);
        });
        return true;
    }
}