import { Session } from "../app/Session";
import { PenDriver } from "./PenDriver";

export class PenDriversManager {
    drivers: PenDriver[] = [];

    constructor(public session: Session) {}

    loadDriver(driver: PenDriver) {
        let success = driver.onDriverLoad(this.session);
        if (success) this.drivers.push(driver);
        else console.error("[drivers] Unable to load pen driver: " + driver.name + " by " + driver.manufacturer);
    }
}