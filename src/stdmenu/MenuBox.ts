import { MenuGadget } from "./MenuGadget";

export type MenuBoxPosition =
    | "top-left" | "top-middle" | "top-right"
    | "middle-left" | "middle-right" | "bottom-left"
    | "bottom-middle" | "bottom-right"
    | "detached";

export class MenuBox {
    container: HTMLDivElement;

    get position() {return this._position;}
    set position(pos: MenuBoxPosition) {
        this.container.classList.remove(this._position);
        this.container.classList.add(pos);
        this._position = pos;
    }

    constructor(private _position: MenuBoxPosition) {
        this.container = document.createElement("div");
        this.container.className = "menubox " + _position;
        document.body.appendChild(this.container);
    }

    gadgets: MenuGadget[] = [];
    addGadget(gadget: MenuGadget) {
        gadget.contents = document.createElement("div");
        gadget.contents.className = gadget.id;
        this.container.appendChild(gadget.contents);
        gadget.loadGadget();
        this.gadgets.push(gadget);
    }
}
