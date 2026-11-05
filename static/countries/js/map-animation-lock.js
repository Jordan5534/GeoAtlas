export function lockMapInteractions(worldMap) {
    worldMap.dataset.animating = true;
}

export function unlockMapInteractions(worldMap) {
    worldMap.dataset.animating = false;
}