
export function initializeContinentHover(worldMap) {
    let hiddenContinentPaths = [];

    let activeContinentGroup = null;

    const shrinkingContinentGroups = new Map();

    const hoverLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    hoverLayer.id = 'continent-hover-layer';
    hoverLayer.style.pointerEvents = 'none';
    worldMap.appendChild(hoverLayer); 

    function showContinentHover(continentCode) {
        clearContinentHover();

        const continentGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        continentGroup.dataset.hoverContinent = continentCode;

        const continentPaths = Array.from(worldMap.querySelectorAll(`path[data-continent='${continentCode}'`)).filter((path) => {
            if (!path.closest('#continent-hover-layer')) {
                return true;
            }
        });

        const previousShrinkingGroup = shrinkingContinentGroups.get(continentCode);
        if (previousShrinkingGroup) {
            previousShrinkingGroup.remove();

            continentPaths.forEach((path) => {
                path.style.removeProperty('opacity');
            });

            shrinkingContinentGroups.delete(continentCode);
        }

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
        activeContinentGroup = continentGroup;

        hiddenContinentPaths = continentPaths;
        continentPaths.forEach((path) => {
            path.style.opacity = 0;
        });
    }

    function clearContinentHover() {
        if (activeContinentGroup !== null) {
            const shrinkingGroup = activeContinentGroup;
            const originalContinentPaths = hiddenContinentPaths;

            activeContinentGroup.classList.add('shrinking');

            shrinkingContinentGroups.set(shrinkingGroup.dataset.hoverContinent, shrinkingGroup);

            activeContinentGroup = null;

            shrinkingGroup.addEventListener('animationend', () => {
                originalContinentPaths.forEach((path) => {
                    path.style.removeProperty('opacity');
                });

                shrinkingGroup.remove();
                shrinkingContinentGroups.delete(shrinkingGroup.dataset.hoverContinent);
            });
        }

        hiddenContinentPaths = [];
    }
    return {showContinentHover, clearContinentHover};
}
