import { csson } from "../../csson/CSSon.js";
import { Layer } from "../../project/Layer.js";
import { DrawingTool, Tool } from "../../tools/Tool.js";

export class Pencil extends Tool implements DrawingTool {
    id = "pencil";
    name = "Pencil";
    author = "nahkd123";

    width = 3;
    colorIndicator: HTMLDivElement;
    renderButton(button: HTMLDivElement) {
        this.colorIndicator = document.createElement("div");
        csson(this.colorIndicator, {
            position: "absolute",
            left: 7, bottom: 0,
            width: 16, height: 15,
            borderRadius: [1000, 1000, 0, 0]
        });

        button.append(this.colorIndicator);
    }

    onColorChange() {
        this.colorIndicator.style.backgroundColor = this.selectedColor.toCSSString();
    }

    points: number[][] = [];
    getLastPoint() {
        return this.points[this.points.length - 1];
    }    

    penDown(x: number, y: number, p: number, layer: Layer) {
        this.points.push([x, y, p]);
        this.lastX = x;
        this.lastY = y;
        this.renderPoints(layer);
    }

    lastX = 0;
    lastY = 0;
    penMove(x: number, y: number, p: number, layer: Layer) {
        let lastPoint = this.getLastPoint();
        let length = Math.sqrt(
            (x - this.lastX) * (x - this.lastX) +
            (y - this.lastY) * (y - this.lastY)
        );
        if (length >= p * 4) {
            this.points.push([x, y, p]);
            this.lastX = x;
            this.lastY = y;
        } else {
            lastPoint[0] = x;
            lastPoint[1] = y;
            lastPoint[2] = p;
        }

        this.renderPoints(layer);
    }
    penUp(x: number, y: number, p: number, layer: Layer) {
        this.points.push([x, y, p]);
        this.renderPoints(layer);
        this.points = [];
    }

    renderPoints(layer: Layer) {
        layer.clearCanvas();
        layer.bitmapToCanvas();
        layer.ctx.strokeStyle = this.selectedColor.toCSSString();
        layer.ctx.lineWidth = this.width;
        layer.ctx.lineCap = "butt";

        if (this.points.length > 2) {
            let i: number;

            for (i = 1; i < this.points.length - 2; i++) {
                layer.ctx.beginPath();

                let xx = (this.points[i - 1][0] + this.points[i][0]) / 2;
                let yy = (this.points[i - 1][1] + this.points[i][1]) / 2;
                layer.ctx.moveTo(xx, yy);

                let xc = (this.points[i][0] + this.points[i + 1][0]) / 2;
                let yc = (this.points[i][1] + this.points[i + 1][1]) / 2;
                layer.ctx.quadraticCurveTo(this.points[i][0], this.points[i][1], xc, yc);
                
                layer.ctx.stroke();
                layer.ctx.closePath();
            }

            //layer.ctx.quadraticCurveTo(this.points[i][0], this.points[i][1], this.points[i + 1][0], this.points[i + 1][1]);
        }
    }
}