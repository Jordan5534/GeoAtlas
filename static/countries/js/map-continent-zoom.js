import { animateToViewBox } from "./map-animate.js";

export function zoomToContinent(worldMap, coords) {
    const continentCoords = coords.split(' ').map(Number);

    const centerX = continentCoords[0] + (continentCoords[2] / 2);
    const centerY = continentCoords[1] + (continentCoords[3] / 2);

    const mapRect = worldMap.getBoundingClientRect();
    const mapAspectRatio = mapRect.width / mapRect.height;
    
    let zoomWidth = continentCoords[2];
    let zoomHeight = continentCoords[3];
    const continentAspectRatio = zoomWidth / zoomHeight;

    if (continentAspectRatio > mapAspectRatio) {
        zoomHeight = zoomWidth / mapAspectRatio;
    } 
    else if (continentAspectRatio < mapAspectRatio) {
        zoomWidth = zoomHeight * mapAspectRatio;
    }

    const viewX = centerX - (zoomWidth / 2);
    const viewY = centerY - (zoomHeight / 2);

    const targetViewBox = `${viewX} ${viewY} ${zoomWidth} ${zoomHeight}`;

    animateToViewBox(worldMap, targetViewBox)
}