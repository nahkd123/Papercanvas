import { csson } from "../../csson/CSSon.js";
import { Pane } from "../../panes/Pane.js";

export class PenCalibrationPane extends Pane {
    constructor() {
        super("Pen calibration");
        this.initDOM();
    }

    pen: HTMLDivElement;
    diagnosticContainer: HTMLDivElement;

    initDOM() {
        let root = this.contents;

        let penContainer = document.createElement("div");
        csson(penContainer, {
            width: 20, height: 400 - 12,
            display: "inline-block",
            padding: [7, 12]
        });
        root.appendChild(penContainer);
        
        let pen = this.pen = document.createElement("div");
        pen.className = "image stylus";
        csson(pen, {
            width: 20, height: 300,
            backgroundSize: "cover"
        });
        penContainer.appendChild(pen);

        let diagnosticContainer = this.diagnosticContainer = document.createElement("div");
        csson(diagnosticContainer, {
            width: 600 - 30 - 38, height: 400 - 14,
            padding: [7, 12],
            display: "inline-block",
            whiteSpace: "pre"
        });
        diagnosticContainer.textContent = "Draw something in here with your tablet stylus";
        root.appendChild(diagnosticContainer);

        root.addEventListener("pointerdown", event => {
            this.pressure = event.pressure;
            this.deviceType = event.pointerType;
        });
        root.addEventListener("pointermove", event => {
            this.pressure = event.pressure;
            this.deviceType = event.pointerType;
        });
        root.addEventListener("pointerup", event => {
            this.pressure = 0;
            this.deviceType = event.pointerType;
        });
    }

    deviceType: string;
    pressure = 0;
    backedPressure = 0;
    oldRenderTimestamp = -1;

    render(ts: number) {
        if (this.oldRenderTimestamp === -1) {
            this.oldRenderTimestamp = ts;
            return;
        }
        
        const timeDelta = ts - this.oldRenderTimestamp;
        this.oldRenderTimestamp = ts;
        if (this.backedPressure === this.pressure) return;

        this.backedPressure = this.backedPressure * 0.6 + this.pressure * 0.4;
        if (this.backedPressure < 0.01) this.backedPressure = 0;
        this.pen.style.marginTop = (this.backedPressure * 15) + "px";

        this.diagnosticContainer.textContent =
            `Pressure: ${this.pressure}\n` +
            `Device type: ${this.deviceType}`
        ;
    }
}