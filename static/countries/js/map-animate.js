import { lockMapInteractions, unlockMapInteractions } from "./map-animation-lock.js";

export function animateToViewBox(worldMap, targetViewBox) {
    lockMapInteractions(worldMap);

    const startCoords = worldMap.getAttribute('viewBox').split(' ').map(Number);
    const targetCoords = targetViewBox.split(' ').map(Number);

    const animationDuration = 600;
    let startTime = null;
    function animate(timestamp) {
        if (startTime === null) {
            startTime = timestamp;
        }
        
        const elapsed = timestamp - startTime;
        const progress = Math.min(1, elapsed / animationDuration);
        
        const currentX = startCoords[0] + (targetCoords[0] - startCoords[0]) * progress;
        const currentY = startCoords[1] + (targetCoords[1] - startCoords[1]) * progress;
        const currentWidth = startCoords[2] + (targetCoords[2] - startCoords[2]) * progress;
        const currentHeight = startCoords[3] + (targetCoords[3] - startCoords[3]) * progress;

        worldMap.setAttribute('viewBox', `${currentX} ${currentY} ${currentWidth} ${currentHeight}`);

        if (elapsed < animationDuration) {
            requestAnimationFrame(animate);
        }
        else { 
            unlockMapInteractions(worldMap);
        }
    }
    requestAnimationFrame(animate);
}