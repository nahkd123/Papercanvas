import { Layer } from "./Layer.js";
import { ProjectMeta } from "./ProjectOptions.js";

export class Project {
    options: ProjectMeta;
    layers: Layer[] = [];
    selectedLayer: Layer;

    constructor(width = 1280, height = 720) {
        this.options = {
            name: "Untitled Project",
            description: "",
            timestamp: Date.now(),
            width, height
        };
        this.insertLayer();
    }

    get width() {return this.options.width;}
    get height() {return this.options.height;}

    insertLayer() {
        let layer = new Layer(this);
        this.layers.push(layer);
        if (this.selectedLayer === undefined) this.selectedLayer = layer;
        return layer;
    }
}