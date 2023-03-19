import { Blending } from "../graphic/Blending";

/**
 * A layer of digital brush. Papercanvas allows you to stack multiple layers, which can be
 * used to create unique brushes.
 */
export class BrushLayer {
    blending = Blending.NORMAL;
    size = 10.0;
    opacity = 1.0;
    spacing = 1.2;

    constructor(public stamp: CanvasImageSource) {}

    drawLine(layer: BaseCanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, leftOver: number = 0) {
        const spacing = this.spacing < 0.5? 0.5 : this.spacing;
        const x2x1 = x2 - x1, y2y1 = y2 - y1;
        const length = Math.sqrt(x2x1 * x2x1 + y2y1 * y2y1);

        if (length > 0) {
            const invLength = 1 / length;
            const stepX = x2x1 * invLength, stepY = y2y1 * invLength; // step = dir * 1/length(dir)

            let offsetX = 0, offsetY = 0;
            let totalLength = length + leftOver;

            while (totalLength >= spacing) {
                totalLength -= spacing;
                if (leftOver > 0) {
                    offsetX += stepX * (spacing - leftOver);
                    offsetY += stepY * (spacing - leftOver);
                    leftOver -= spacing;
                } else {
                    offsetX += stepX * spacing;
                    offsetY += stepY * spacing;
                }

                layer.globalCompositeOperation = this.blending == Blending.NORMAL? "source-over" : "destination-out";
                layer.drawImage(this.stamp, 0, 0, +this.stamp.width, +this.stamp.height, x1 + offsetX - this.size / 2, y1 + offsetY - this.size / 2, this.size, this.size);
            }

            return totalLength;
        }

        return leftOver;
    }
}