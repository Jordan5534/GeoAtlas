export function initializeContinentHover(worldMap) {
    let hiddenContinentPaths = [];

    const hoverLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    hoverLayer.id = 'continent-hover-layer';
    hoverLayer.style.pointerEvents = 'none';
    worldMap.appendChild(hoverLayer); 

    function showContinentHover(continentCode) {
        clearContinentHover();
        const continentGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        continentGroup.dataset.hoverContinent = continentCode;

        const continentPaths = worldMap.querySelectorAll(`path[data-continent='${continentCode}'`);

        const outlinePaths = document.querySelectorAll(`#continent-outline-layer .continent-outline[data-outline-continent='${continentCode}'`);

        outlinePaths.forEach((outline) => {
            const clonedOutline = outline.cloneNode(true);
            clonedOutline.classList.add('active');
            continentGroup.appendChild(clonedOutline);
        });

        continentGroup.classList.add('continent-hover-group');
        continentPaths.forEach(continent => {
            const clonedPath = continent.cloneNode(true);
            clonedPath.removeAttribute('id');
            continentGroup.appendChild(clonedPath);
        });
        hoverLayer.appendChild(continentGroup);

        hiddenContinentPaths = continentPaths;
        continentPaths.forEach((path) => {
            path.style.opacity = 0;
        });
    }

    function clearContinentHover() {
        hoverLayer.replaceChildren();
        hiddenContinentPaths.forEach((path) => {
            path.style.removeProperty('opacity');
        });
        hiddenContinentPaths = [];
    }
    return {showContinentHover, clearContinentHover};
}