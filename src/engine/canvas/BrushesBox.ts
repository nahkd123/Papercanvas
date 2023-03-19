import { Brush } from "../brush/Brush";
import { BrushLayer } from "../brush/BrushLayer";
import { BrushTips } from "../brush/BrushTips";
import { Blending } from "../graphic/Blending";
import { Pointer, PointersSet } from "../pointing/Pointer";
import "./Brushes.css";

export class BrushesBox implements UIAppendable {
    readonly element: HTMLDivElement;
    readonly innerElement: HTMLDivElement;

    constructor(public readonly pointers: PointersSet) {
        const self = this;

        this.element = document.createElement("div").then(e => {
            e.className = "brushesbox";
        }).add(
            this.innerElement = document.createElement("div").add(function*() {
                let brushDraw = new Brush().addLayer(new BrushLayer(BrushTips.SOFT_TIP));
                brushDraw.layers[0].blending = Blending.NORMAL;
                yield new ToolsboxBrush(self, brushDraw).pencil();
                
                let eraser = new Brush().addLayer(new BrushLayer(BrushTips.SOFT_TIP));
                eraser.layers[0].blending = Blending.ERASE;
                yield new ToolsboxBrush(self, eraser).pencilEraser();
            })
        );
    }
}

export class ToolsboxBrush implements UIAppendable {
    readonly element: HTMLElement;

    constructor(public readonly box: BrushesBox, public brush: Brush) {
        this.element = document.createElement("div").then(e => {
            e.className = "brush";
            e.addEventListener("pointerdown", e => {
                console.log(e.pointerType);
                // TODO: show brush selected indicator
                (box.pointers[e.pointerType] as Pointer).selectedBrush = brush;
                console.log(box.pointers[e.pointerType]);
            });
        });
    }

    pencil(): this {
        this.element.className = "brush pencil";
        return this;
    }

    pencilEraser(): this {
        this.element.className = "brush pencil-eraser";
        return this;
    }
}