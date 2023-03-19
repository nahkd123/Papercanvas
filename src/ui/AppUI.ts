import { Canvas } from "../engine/canvas/Canvas";
import { Bezier } from "../engine/math/Bezier";
import { Lagrange } from "../engine/math/Lagrange";

export function* AppUI() {
    yield new Canvas();
}