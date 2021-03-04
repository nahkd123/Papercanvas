import { csson } from "../csson/CSSon.js";
import { PenColor } from "../draw/PenColor.js";
import { Eraser } from "../app/tools/Eraser.js";
import { SolidPen } from "../app/tools/SolidPen.js";
import { Tool } from "./Tool.js";
import { Pencil } from "../app/tools/Pencil.js";
import { Session } from "../app/Session.js";

export class ToolsManager {
    parent: HTMLDivElement;
    toolsContainer: HTMLDivElement;
    
    constructor(public session: Session) {
        this.parent = document.createElement("div");
        this.parent.className = "tools";
        document.body.appendChild(this.parent);

        this.toolsContainer = document.createElement("div");
        this.toolsContainer.className = "container";
        this.parent.appendChild(this.toolsContainer);

        this.addTool(new SolidPen());
        this.addTool(new Pencil());
        this.addTool(new Eraser());
    }

    tools: Tool[] = [];
    selectedTool: Tool = undefined; // undefined === cursor

    addTool(tool: Tool) {
        this.tools.push(tool);
        tool.toolButton = document.createElement("div");
        tool.toolButton.className = tool.id;
        csson(tool.toolButton, {
            display: "inline-block",
            width: 30, height: 50
        });
        this.toolsContainer.appendChild(tool.toolButton);

        tool.selectedColor = new PenColor();
        tool.backedColor = new PenColor().setFrom(tool.selectedColor);
        tool.renderButton(tool.toolButton);
        tool.onColorChange();

        tool.toolButton.addEventListener("click", event => {
            if (this.selectedTool !== tool) this.selectTool(tool);
            else this.unselectTool();
        });
    }

    unselectTool() {
        this.session.canvas.applySelection();
        if (this.selectedTool === undefined) return;
        this.selectedTool.toolButton.classList.remove("selected");
        this.selectedTool = undefined;

        this.session.toolSettings.colorPicker.saturationSlider.disabled = true;
        this.session.toolSettings.colorPicker.alphaSlider.disabled = true;
    }

    selectTool(tool: Tool) {
        if (this.selectedTool === tool) return;
        this.unselectTool();
        this.selectedTool = tool;
        tool.toolButton.classList.add("selected");
        
        this.session.toolSettings.colorPicker.saturationSlider.disabled = false;
        this.session.toolSettings.colorPicker.saturationSlider.value = tool.selectedColor.toHSLA()[1] + "";

        this.session.toolSettings.colorPicker.alphaSlider.disabled = false;
        this.session.toolSettings.colorPicker.alphaSlider.value = tool.selectedColor.a + "";
        this.session.toolSettings.colorPicker.renderStrip();
    }
}