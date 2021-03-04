import { Session } from "../app/Session.js";

/**
 * Pen driver. TODO: Add pen mapping to some tools
 */
export interface PenDriver {
    name: string;
    manufacturer: string;

    onDriverLoad(session: Session): boolean;
}