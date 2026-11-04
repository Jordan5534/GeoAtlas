import { animateToViewBox } from "./map-animate.js";

export function zoomToCountry(worldMap, countryPath) {
    const countryID = countryPath.id;
    const countryZoomOverrides = {
        'fr': {x: 974, y: 294, width: 79, height: 55},
        'ru': {x: 1290, y: 155, width: 560, height: 180}};
        
    const countryBox = countryZoomOverrides[countryID] ?? countryPath.getBBox();

    const centerX = countryBox.x + (countryBox.width / 2);
    const centerY = countryBox.y + (countryBox.height / 2);

    const padding = 1.5;
    let zoomWidth = countryBox.width * padding;
    let zoomHeight = countryBox.height * padding;

    const mapRect = worldMap.getBoundingClientRect();
    const mapAspectRatio = mapRect.width / mapRect.height;
    const countryAspectRatio = zoomWidth / zoomHeight;

    if (countryAspectRatio > mapAspectRatio) {
        zoomHeight = zoomWidth / mapAspectRatio;
    } else if (countryAspectRatio < mapAspectRatio) {
        zoomWidth = zoomHeight * mapAspectRatio;
    }

    const viewX = centerX - (zoomWidth / 2);
    const viewY = centerY - (zoomHeight / 2);

    const targetViewBox = `${viewX} ${viewY} ${zoomWidth} ${zoomHeight}`;

    animateToViewBox(worldMap, targetViewBox);
}