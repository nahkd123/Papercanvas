export function isInsideBox(boxX = 0, boxY = 0, boxW = 0, boxH = 0, inX = 0, inY = 0) {
    return (
        (inX >= boxX && inX <= boxX + boxW) &&
        (inY >= boxY && inY <= boxY + boxH)
    );
}