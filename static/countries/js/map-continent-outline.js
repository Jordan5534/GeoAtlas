export function initializeContinentOutlines(worldMap) {
    const outlineLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    outlineLayer.id = 'continent-outline-layer';
    outlineLayer.style.pointerEvents = 'none';
    worldMap.insertBefore(outlineLayer, worldMap.firstChild);

    const continentPaths = worldMap.querySelectorAll('path[data-continent]');
    continentPaths.forEach(path => {
        const clonedPath = path.cloneNode(true);

        clonedPath.removeAttribute('id');
        clonedPath.removeAttribute('data-continent');
        clonedPath.dataset.outlineContinent = path.dataset.continent;

        clonedPath.classList.add('continent-outline');
        outlineLayer.appendChild(clonedPath);
    });
}