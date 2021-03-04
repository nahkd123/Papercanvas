import { Project } from "./Project.js";

export class Layer {
    /**
     * The stored image bitmap. This bitmap will be changed once the user done the
     * operation (like using pencil for example)
     */
    bitmap: ImageBitmap;

    /**
     * The offscren canvas object. Once the user done their operation, data from canvas
     * will replace the current bitmap and the old one will be closed.
     */
    canvas: OffscreenCanvas;
    ctx: OffscreenCanvasRenderingContext2D;

    constructor(public project: Project, public name = "Layer " + (project.layers.length + 1)) {
        this.canvas = new OffscreenCanvas(project.width, project.height);
        this.ctx = this.canvas.getContext("2d");
        this.bitmap = this.canvas.transferToImageBitmap();
    }

    replaceBitmap() {
        this.bitmap.close();
        this.bitmap = this.canvas.transferToImageBitmap();
    }

    bitmapToCanvas() {
        this.ctx.drawImage(this.bitmap, 0, 0);
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    selectLayer() {
        this.project.selectedLayer = this;
    }

    get isSelected() {return this.project.selectedLayer === this;}

}