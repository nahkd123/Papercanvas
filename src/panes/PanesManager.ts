import { Pane } from "./Pane.js";

export class PanesManager {
    overlayDOM: HTMLDivElement;
    heldPane: Pane;

    constructor() {
        this.overlayDOM = document.createElement("div");
        this.overlayDOM.className = "panes";
        document.body.appendChild(this.overlayDOM);
    }

    /**
     * Close the current pane
     */
    closePane() {
        if (this.heldPane === undefined) return;
        this.overlayDOM.removeChild(this.heldPane.parentDOM);
        this.heldPane = undefined;
        this.overlayDOM.classList.remove("show");
    }

    /**
     * Close the current pane and open another one
     */
    openPane(pane: Pane) {
        if (this.heldPane === pane) return;
        if (this.heldPane !== undefined) {
            this.overlayDOM.removeChild(this.heldPane.parentDOM);
        }
        this.overlayDOM.appendChild(pane.parentDOM);
        this.heldPane = pane;
        this.overlayDOM.classList.add("show");
    }

    render(ts: number) {
        if (this.heldPane !== undefined) this.heldPane.render(ts);
    }
}