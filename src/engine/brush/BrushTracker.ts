import { Canvas } from "../canvas/Canvas";
import { Pointer, PointingData } from "../pointing/Pointer";
import { Brush } from "./Brush";

/**
 * Track the position of the brush. Untrack when user choose to pen up.
 */
export class BrushTracker {
    // smoothingEngine;
    public readonly pointingData: PointingData;
    leftOver = 0;

    constructor(
        public readonly canvas: Canvas, // TODO: track on layers instead
        public readonly brush: Brush,
        public readonly pointer: Pointer,
        pointingData: PointingData
    ) {
        this.pointingData = { ...pointingData };
    }

    brushMove(newData: PointingData) {
        // TODO: make brush reacts to pressure changes etc.
        this.brush.layers.forEach(bLayer => {
            this.leftOver = bLayer.drawLine(this.canvas.ctx, this.pointingData.canvasX, this.pointingData.canvasY, newData.canvasX, newData.canvasY, this.leftOver);
        });

        for (let key in this.pointingData) this.pointingData[key] = newData[key];
    }
}