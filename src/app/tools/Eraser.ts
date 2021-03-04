import { csson } from "../../csson/CSSon.js";
import { Layer } from "../../project/Layer.js";
import { DrawingTool, Tool } from "../../tools/Tool.js";

export class Eraser extends Tool implements DrawingTool {
    id = "eraser";
    name = "Eraser";
    author = "nahkd123";

    width = 15;
    colorIndicator: HTMLDivElement;
    renderButton(button: HTMLDivElement) {}

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
        layer.ctx.globalCompositeOperation = "destination-out";
        layer.ctx.strokeStyle = this.selectedColor.toCSSString();
        layer.ctx.lineWidth = this.width;
        layer.ctx.lineCap = "round";
        layer.ctx.lineJoin = "round";

        layer.ctx.beginPath();
        layer.ctx.moveTo(this.points[0][0], this.points[0][1]);
        if (this.points.length > 2) {
            let i: number;
            for (i = 1; i < this.points.length - 2; i++) {
                let xc = (this.points[i][0] + this.points[i + 1][0]) / 2;
                let yc = (this.points[i][1] + this.points[i + 1][1]) / 2;
                layer.ctx.quadraticCurveTo(this.points[i][0], this.points[i][1], xc, yc);
            }

            layer.ctx.quadraticCurveTo(this.points[i][0], this.points[i][1], this.points[i + 1][0], this.points[i + 1][1]);
        } else {
            layer.ctx.beginPath();
            layer.ctx.moveTo(this.points[0][0], this.points[0][1]);
            if (this.points.length === 2) layer.ctx.lineTo(this.points[1][0], this.points[1][1]);
            else layer.ctx.lineTo(this.points[0][0], this.points[0][1]);
            layer.ctx.stroke();
            layer.ctx.closePath();
        }

        layer.ctx.stroke();
        layer.ctx.closePath();
        layer.ctx.shadowBlur = 0;
        layer.ctx.globalCompositeOperation = "source-over";
    }
}