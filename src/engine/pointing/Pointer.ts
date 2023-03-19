import { Brush } from "../brush/Brush";
import { BrushTracker } from "../brush/BrushTracker";
import { Canvas } from "../canvas/Canvas";

export class PointersSet {
    readonly mouse: Pointer = new Pointer(PointerType.MOUSE);
    readonly pen: Pointer = new Pointer(PointerType.PEN);
    readonly touch: Pointer = new Pointer(PointerType.TOUCH);

    updateFromEvent(canvas: Canvas, e: PointerEvent, offsetX: number, offsetY: number) {
        /*if (e.pointerType == "mouse") this.mouse.updateFromEvent(e, offsetX, offsetY);
        if (e.pointerType == "pen") this.pen.updateFromEvent(e, offsetX, offsetY);
        if (e.pointerType == "touch") this.touch.updateFromEvent(e, offsetX, offsetY);*/
        (this[e.pointerType] as Pointer).updateFromEvent(canvas, e, offsetX, offsetY);
    }
}

/**
 * Each pointer can have 1 brush. You can have up to 3 brushes selected at the same time by
 * binding each one to mouse, touch and pen (eg: pen for pencil, mouse for ink, touch for
 * smudge brush).
 */
export class Pointer {
    readonly pointing: PointingData;
    selectedBrush: Brush;
    tracker: BrushTracker;

    constructor(public readonly type: PointerType) {
        this.pointing = {
            type,
            buttons: PointerButton.NONE,
            canvasX: -1, canvasY: -1, deltaX: 0, deltaY: 0,
            pressure: 0, tangentialPressure: 0,
            tiltX: 0, tiltY: 0, twist: 0
        };
    }

    updateFromEvent(canvas: Canvas, e: PointerEvent, offsetX: number, offsetY: number) {
        this.pointing.buttons = e.buttons;
        this.pointing.canvasX = offsetX + e.offsetX * devicePixelRatio;
        this.pointing.canvasY = offsetY + e.offsetY * devicePixelRatio;
        this.pointing.deltaX = e.movementX;
        this.pointing.deltaY = e.movementY;
        this.pointing.pressure = e.pressure;
        this.pointing.tangentialPressure = e.tangentialPressure;
        this.pointing.tiltX = e.tiltX;
        this.pointing.tiltY = e.tiltY;
        this.pointing.twist = e.twist;
        
        if (e.buttons & PointerButton.PEN_DOWN) {
            if (this.tracker == null) this.tracker = new BrushTracker(canvas, this.selectedBrush, this, this.pointing);
            else this.tracker.brushMove(this.pointing);
        } else {
            if (this.tracker != null) this.tracker = null;
        }
    }
}

export interface PointingData {
    type: PointerType;
    buttons: PointerButton;
    canvasX: number; canvasY: number;
    deltaX: number; deltaY: number;
    // contactWidth: number; contactHeight: number;
    pressure: number; tangentialPressure: number;
    tiltX: number; tiltY: number; twist: number;
}

export enum PointerType {
    MOUSE = "mouse",
    PEN = "pen",
    TOUCH = "touch"
}

export enum PointerButton {
    NONE        = 0b000_000,
    PEN_DOWN    = 0b000_001,
    PEN_BUTTON  = 0b000_010,
    PEN_MIDDLE  = 0b000_100,
    BACK        = 0b001_000,
    FORWARD     = 0b010_000,
    PEN_ERASE   = 0b100_000
}