import { csson } from "../../csson/CSSon.js";
import { Layer } from "../../project/Layer.js";
import { DrawingTool, Tool } from "../../tools/Tool.js";

export class SolidPen extends Tool implements DrawingTool {
    id = "solid";
    name = "Solid Pen";
    author = "nahkd123";

    width = 12;
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
        if (length >= this.width * 0.25) {
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
    }
}