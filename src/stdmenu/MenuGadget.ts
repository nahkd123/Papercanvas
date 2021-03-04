import { csson } from "../csson/CSSon.js";

export abstract class MenuGadget {
    contents: HTMLDivElement;
    constructor(public readonly id: string) {}
    abstract loadGadget(): void;
}

export class ButtonMenuGadget extends MenuGadget {
    constructor(public name: string) {
        super("button");
    }

    loadGadget() {
        let label = document.createElement("div");
        label.textContent = this.name;
        this.contents.appendChild(label);
    }
}

export class IconButtonsMenuGadget extends MenuGadget {
    buttons: HTMLDivElement[] = [];

    constructor() {
        super("icons");
    }

    addButton() {
        let b = document.createElement("div");
        this.buttons.push(b);
        return b;
    }

    loadGadget() {
        this.buttons.forEach(b => {this.contents.appendChild(b);});
    }
}