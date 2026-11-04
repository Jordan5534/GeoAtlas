import { animateToViewBox } from "./map-animate.js";

export function zoomToCountry(worldMap, countryPath) {
    console.log(countryPath.id)
    const countryBox = countryPath.getBBox();
    console.log(countryBox);

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

    console.log(centerX);
    console.log(centerY);
    console.log(mapAspectRatio);
    console.log(countryAspectRatio);
    console.log(targetViewBox);

    animateToViewBox(worldMap, targetViewBox);
}