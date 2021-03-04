import { DrawableCanvas } from "../canvas/DrawableCanvas.js";
import { BasicPenDriver } from "../driver/BasicPenDriver.js";
import { PenDriversManager } from "../driver/PenDriversManager.js";
import { PanesManager } from "../panes/PanesManager.js";
import { Project } from "../project/Project.js";
import { ToolsManager } from "../tools/ToolsManager.js";
import { LayersMenu } from "./menus/LayersMenu.js";
import { ToolSettings } from "./menus/ToolSettings.js";

export class Session {
    project: Project;

    canvas: DrawableCanvas;
    panes: PanesManager;
    tools: ToolsManager;
    drivers: PenDriversManager;

    toolSettings: ToolSettings;
    layersMenu: LayersMenu;

    constructor() {
        this.project = new Project();

        this.canvas = new DrawableCanvas(this);
        this.panes = new PanesManager();
        this.tools = new ToolsManager(this);
        this.drivers = new PenDriversManager(this);

        this.toolSettings = new ToolSettings(this);
        this.layersMenu = new LayersMenu(this);

        this.drivers.loadDriver(new BasicPenDriver());
    }
}