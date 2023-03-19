import { BrushLayer } from "../brush/BrushLayer";
import { BrushTips } from "../brush/BrushTips";
import { PointersSet } from "../pointing/Pointer";
import { BrushesBox } from "./BrushesBox";
import "./Canvas.css";

export class Canvas implements UIAppendable {
    readonly element: HTMLDivElement;
    readonly pointers = new PointersSet();

    readonly canvasElement: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;

    readonly toolsbox: BrushesBox;

    constructor() {
        this.element = document.createElement("div").then(e => {
            e.className = "papercanvas-canvas";
        }).add(
            this.canvasElement = document.createElement("canvas").then(e => {
                e.className = "canvas-area";

                let observer = new ResizeObserver((c) => {
                    c.forEach(e => {
                        if (e.target instanceof HTMLCanvasElement) {
                            e.target.width = e.contentRect.width * devicePixelRatio;
                            e.target.height = e.contentRect.height * devicePixelRatio;
                        }
                    });
                });
                observer.observe(e);
            }),
            this.toolsbox = new BrushesBox(this.pointers)
        );

        this.ctx = this.canvasElement.getContext("2d");
        this.canvasElement.addEventListener("pointerdown", e => this.pointers.updateFromEvent(this, e, 0, 0));
        this.canvasElement.addEventListener("pointermove", e => this.pointers.updateFromEvent(this, e, 0, 0));
        this.canvasElement.addEventListener("pointerup", e => this.pointers.updateFromEvent(this, e, 0, 0));
    }
}