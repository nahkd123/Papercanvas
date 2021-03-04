import { Session } from "../app/Session.js";
import { csson } from "../csson/CSSon.js";
import { MenuBoxPosition } from "../stdmenu/MenuBox.js";
import { DrawingTool, Tools } from "../tools/Tool.js";
import { isInsideBox } from "../utils/BoundaryBox.js";
import { CanvasSelection } from "./CanvasSelection.js";

export class DrawableCanvas {
    display: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor(public session: Session) {
        this.display = document.createElement("canvas");
        csson(this.display, {
            width: "100%", height: "100%"
        });
        document.body.appendChild(this.display);
        this.ctx = this.display.getContext("2d");

        document.addEventListener("paste", async (event) => {
            this.session.tools.unselectTool();
            this.selection = await CanvasSelection.fromClipboard(event);
            this.selection.x = this.hoverScreenX;
            this.selection.y = this.hoverScreenY;
            this.renderNextFrame = true;
        });
    }

    get project() {return this.session.project;}

    scrollLeft = 0;
    scrollTop = 0;
    zoom = 1;
    rotation = 0; // In radian
    renderNextFrame = true;

    selection: CanvasSelection;
    get isInsideSelection() {
        return isInsideBox(
            this.selection.x, this.selection.y,
            this.selection.width, this.selection.height,
            this.hoverScreenX, this.hoverScreenY
        );
    }
    isInsideCorner(corner: MenuBoxPosition) {
        return (
            (corner === "top-left" && isInsideBox(this.selection.x - 10, this.selection.y - 10, 10, 10, this.hoverScreenX, this.hoverScreenY)) ||
            (corner === "top-middle" && isInsideBox(this.selection.x + 15, this.selection.y - 10, this.selection.width - 30, 10, this.hoverScreenX, this.hoverScreenY)) ||
            (corner === "top-right" && isInsideBox(this.selection.x + this.selection.width, this.selection.y - 10, 10, 10, this.hoverScreenX, this.hoverScreenY)) ||
            (corner === "middle-left" && isInsideBox(this.selection.x - 10, this.selection.y + 15, 10, this.selection.height - 30, this.hoverScreenX, this.hoverScreenY)) ||
            (corner === "middle-right" && isInsideBox(this.selection.x + this.selection.width, this.selection.y + 15, 10, this.selection.height - 30, this.hoverScreenX, this.hoverScreenY)) ||
            (corner === "bottom-left" && isInsideBox(this.selection.x - 10, this.selection.y + this.selection.height, 10, 10, this.hoverScreenX, this.hoverScreenY)) ||
            (corner === "bottom-middle" && isInsideBox(this.selection.x + 15, this.selection.y + this.selection.height, this.selection.width - 30, 10, this.hoverScreenX, this.hoverScreenY)) ||
            (corner === "bottom-right" && isInsideBox(this.selection.x + this.selection.width, this.selection.y + this.selection.height, 10, 10, this.hoverScreenX, this.hoverScreenY)) ||
            false
        );
    }

    render(ts: number) {
        if (this.display.offsetWidth !== this.display.width || this.display.offsetHeight !== this.display.height) {
            this.renderNextFrame = true;
            this.display.width = this.display.offsetWidth;
            this.display.height = this.display.offsetHeight;
        }

        let ctx = this.ctx;
        let self = this;
        if (!this.renderNextFrame) return;
        ctx.fillStyle = "#cecece";
        ctx.fillRect(0, 0, this.display.width, this.display.height);
        this.renderNextFrame = false;

        function transformToTopLeft(mul = 1) {
            ctx.translate(
                ((self.display.width - self.project.width) / 2 + self.scrollLeft) * mul,
                ((self.display.height - self.project.height) / 2 + self.scrollTop) * mul
            );
        }

        transformToTopLeft(1);
        ctx.shadowColor = "black";
        ctx.shadowBlur = 5;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, this.project.width, this.project.height);
        ctx.shadowBlur = 0;

        let layers = this.project.layers;
        for (let i = 0; i < layers.length; i++) {
            let layer = layers[i];
            ctx.drawImage(layer.canvas, 0, 0);
            if (layer.isSelected) {
                if (this.selection?.bitmap) ctx.drawImage(this.selection.bitmap, this.selection.x, this.selection.y, this.selection.width, this.selection.height);
            }
        }

        if (this.hoverScreenX !== -1 && this.hoverScreenY !== -1) {
            ctx.strokeStyle = "#000000";
            circleAt(this.hoverScreenX, this.hoverScreenY, (this.session.tools.selectedTool?.width / 2) || 5);
            ctx.stroke();
        }

        if (this.selection) {
            let oldStrokeWidth = ctx.lineWidth;
            ctx.strokeStyle = this.isInsideSelection? "#17afff" : "#171717";
            ctx.setLineDash([5, 5]);
            ctx.lineWidth = 2;
            ctx.strokeRect(this.selection.x, this.selection.y, this.selection.width, this.selection.height);
            ctx.setLineDash([]);

            ctx.fillStyle = this.isInsideCorner("top-left")? "#2c7878" : "#2c2c2c";
            ctx.fillRect(this.selection.x - 10, this.selection.y - 10, 10, 10);
            ctx.fillStyle = this.isInsideCorner("bottom-left")? "#2c7878" : "#2c2c2c";
            ctx.fillRect(this.selection.x - 10, this.selection.y + this.selection.height, 10, 10);
            ctx.fillStyle = this.isInsideCorner("top-right")? "#2c7878" : "#2c2c2c";
            ctx.fillRect(this.selection.x + this.selection.width, this.selection.y - 10, 10, 10);
            ctx.fillStyle = this.isInsideCorner("bottom-right")? "#2c7878" : "#2c2c2c";
            ctx.fillRect(this.selection.x + this.selection.width, this.selection.y + this.selection.height, 10, 10);
            
            ctx.fillStyle = this.isInsideCorner("top-middle")? "#2c7878" : "#2c2c2c";
            ctx.fillRect(this.selection.x + 15, this.selection.y - 10, this.selection.width - 30, 10);
            ctx.fillStyle = this.isInsideCorner("bottom-middle")? "#2c7878" : "#2c2c2c";
            ctx.fillRect(this.selection.x + 15, this.selection.y + this.selection.height, this.selection.width - 30, 10);
            ctx.fillStyle = this.isInsideCorner("middle-left")? "#2c7878" : "#2c2c2c";
            ctx.fillRect(this.selection.x - 10, this.selection.y + 15, 10, this.selection.height - 30);
            ctx.fillStyle = this.isInsideCorner("middle-right")? "#2c7878" : "#2c2c2c";
            ctx.fillRect(this.selection.x + this.selection.width, this.selection.y + 15, 10, this.selection.height - 30);

            ctx.lineWidth = oldStrokeWidth;
        }

        transformToTopLeft(-1);

        function circleAt(pointX: number, pointY: number, rad: number) {
            ctx.beginPath();
            ctx.moveTo(pointX + rad, pointY);
            ctx.arc(pointX, pointY, rad, 0, Math.PI * 2);
            ctx.closePath();
        }
    }

    private penDown = false;
    private oldScreenX = -1;
    private oldScreenY = -1;

    private hoverScreenX = -1;
    private hoverScreenY = -1;

    private draggingSelection = false;
    private draggingSelCorner: MenuBoxPosition = "detached";

    sendInput(screenX: number, screenY: number, pressure: number) {
        let pageX = this.hoverScreenX = (screenX - (this.display.width - this.project.width) / 2) - this.scrollLeft;
        let pageY = this.hoverScreenY = (screenY - (this.display.height - this.project.height) / 2) - this.scrollTop;
        let pagePressure = pressure >= this.penMinPressure? Math.min(pressure / this.penMaxPressure, 1.0) : 0;
        this.renderNextFrame = true;

        let selectedTool = this.session.tools.selectedTool;
        let selectedLayer = this.project.selectedLayer;

        if (!this.penDown && pressure >= this.penMinPressure) {
            this.penDown = true;
            if (Tools.isDrawingTool(selectedTool)) {
                (<DrawingTool> (selectedTool as unknown)).penDown(pageX, pageY, pagePressure, selectedLayer);
            } else {
                // Moving?
                this.oldScreenX = screenX;
                this.oldScreenY = screenY;

                this.draggingSelection = false;
                this.draggingSelCorner = "detached";
                if (this.selection) {
                    if (this.isInsideSelection) this.draggingSelection = true;
                    else if (this.isInsideCorner("top-left")) this.draggingSelCorner = "top-left";
                    else if (this.isInsideCorner("top-right")) this.draggingSelCorner = "top-right";
                    else if (this.isInsideCorner("bottom-left")) this.draggingSelCorner = "bottom-left";
                    else if (this.isInsideCorner("bottom-right")) this.draggingSelCorner = "bottom-right";
                    
                    else if (this.isInsideCorner("top-middle")) this.draggingSelCorner = "top-middle";
                    else if (this.isInsideCorner("middle-left")) this.draggingSelCorner = "middle-left";
                    else if (this.isInsideCorner("middle-right")) this.draggingSelCorner = "middle-right";
                    else if (this.isInsideCorner("bottom-middle")) this.draggingSelCorner = "bottom-middle";
                }
            }
            this.renderNextFrame = true;
        } else if (this.penDown && pressure < this.penMinPressure) {
            this.penDown = false;
            if (Tools.isDrawingTool(selectedTool)) {
                (<DrawingTool> (selectedTool as unknown)).penUp(pageX, pageY, pagePressure, selectedLayer);
                selectedLayer.replaceBitmap();
                selectedLayer.bitmapToCanvas();
            }
            this.renderNextFrame = true;
        } else if (this.penDown) {
            // Pen move!
            if (Tools.isDrawingTool(selectedTool)) {
                (<DrawingTool> (selectedTool as unknown)).penMove(pageX, pageY, pagePressure, selectedLayer);
            } else {
                // Moving?
                const deltaX = screenX - this.oldScreenX;
                const deltaY = screenY - this.oldScreenY;
                const deltaEqu = Math.min(deltaX, deltaY);

                if (this.draggingSelection) {
                    this.selection.x += deltaX;
                    this.selection.y += deltaY;
                } else if (this.draggingSelCorner === "top-left") {
                    this.selection.x += deltaX;
                    this.selection.y += deltaY;
                    this.selection.width -= deltaX;
                    this.selection.height -= deltaY;
                } else if (this.draggingSelCorner === "top-right") {
                    this.selection.y += deltaY;
                    this.selection.width += deltaX;
                    this.selection.height -= deltaY;
                } else if (this.draggingSelCorner === "bottom-left") {
                    this.selection.x += deltaX;
                    this.selection.width -= deltaX;
                    this.selection.height += deltaY;
                } else if (this.draggingSelCorner === "bottom-right") {
                    this.selection.width += deltaX;
                    this.selection.height += deltaY;
                } else if (this.draggingSelCorner === "top-middle") {
                    this.selection.y += deltaY;
                    this.selection.height -= deltaY;
                } else if (this.draggingSelCorner === "middle-left") {
                    this.selection.x += deltaX;
                    this.selection.width -= deltaX;
                } else if (this.draggingSelCorner === "middle-right") {
                    this.selection.width += deltaX;
                } else if (this.draggingSelCorner === "bottom-middle") {
                    this.selection.height += deltaY;
                } else {
                    this.scrollLeft += screenX - this.oldScreenX;
                    this.scrollTop += screenY - this.oldScreenY;
                }
                this.oldScreenX = screenX;
                this.oldScreenY = screenY;
            }
            this.renderNextFrame = true;
        }
    }

    applySelection() {
        if (!this.selection) return;
        let layer = this.project.selectedLayer;

        layer.clearCanvas();
        layer.bitmapToCanvas();
        layer.ctx.drawImage(this.selection.bitmap, this.selection.x, this.selection.y, this.selection.width, this.selection.height);
        layer.replaceBitmap();
        layer.clearCanvas();
        layer.bitmapToCanvas();
        this.selection = undefined;
        this.renderNextFrame = true;
    }

    penMinPressure = 0.01;
    penMaxPressure = 1.00;

}