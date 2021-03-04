import { csson } from "../../csson/CSSon.js";
import { Layer } from "../../project/Layer.js";
import { MenuBox } from "../../stdmenu/MenuBox.js";
import { IconButtonsMenuGadget, MenuGadget } from "../../stdmenu/MenuGadget.js";
import { Session } from "../Session.js";

export class LayersMenu extends MenuBox {
    buttons: IconButtonsMenuGadget;
    layersListing: LayersListing;

    constructor(public session: Session) {
        super("bottom-right");

        this.buttons = new IconButtonsMenuGadget();
        let addLayer = this.buttons.addButton();
        addLayer.className = "addlayer";
        addLayer.addEventListener("click", event => {
            let layer = session.project.insertLayer();
            this.layersListing.addLayerEntry(layer);
            session.project.selectedLayer = layer;
            session.canvas.renderNextFrame = true;
            this.layersListing.updateElements();
        });
        this.addGadget(this.buttons);

        this.addGadget(this.layersListing = new LayersListing(this));
    }
}

export class LayersListing extends MenuGadget {
    constructor(public parent: LayersMenu) {
        super("layerslisting");
    }

    layersMap = new Map<Layer, HTMLDivElement>();

    loadGadget() {
        csson(this.contents, {
            width: 200,
            boxShadow: "unset",
            padding: "unset",
            backgroundColor: "unset"
        });

        this.parent.session.project.layers.forEach(l => {
            this.addLayerEntry(l);
        });
        this.updateElements();
    }

    addLayerEntry(layer: Layer) {
        let element = document.createElement("div");
        element.textContent = layer.name;
        element.className = "layerentry";
        this.contents.insertBefore(element, this.contents.firstChild);
        this.layersMap.set(layer, element);

        element.addEventListener("click", () => {
            layer.selectLayer();
            this.updateElements();
        });
    }

    updateElements() {
        this.layersMap.forEach((val, key) => {
            if (!key.isSelected && val.classList.contains("selected")) val.classList.remove("selected");
            else if (key.isSelected && !val.classList.contains("selected")) val.classList.add("selected");
        });
    }
}