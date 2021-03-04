import { DrawPoint } from "../draw/DrawPoint.js";
import { PenColor } from "../draw/PenColor.js";
import { Layer } from "../project/Layer.js";

export abstract class Tool {
    abstract id: string;
    abstract name: string;
    abstract author: string;

    width = 2;

    backedColor: PenColor;
    selectedColor: PenColor;
    toolButton: HTMLDivElement;

    abstract renderButton(button: HTMLDivElement): void;
    onColorChange() {}
}

export interface DrawingTool {
    penDown(x: number, y: number, p: number, layer: Layer): void;
    penMove(x: number, y: number, p: number, layer: Layer): void;
    penUp(x: number, y: number, p: number, layer: Layer): void;
}

export namespace Tools {
    export function isDrawingTool(obj: Tool) {
        return obj !== undefined && "penDown" in obj && "penMove" in obj && "penUp" in obj;
    }
}