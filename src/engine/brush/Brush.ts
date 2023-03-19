import { BrushLayer } from "./BrushLayer";
import { BrushTips } from "./BrushTips";

export class Brush {
    readonly layers: BrushLayer[] = [];

    addLayer(layer: BrushLayer): this {
        this.layers.push(layer);
        return this;
    }
}