
export function initializeCountryHover(worldMap) {
    let hiddenCountryPath = null;
    let activeCountryClone = null;

    const shrinkingCountryClones = new Map();

    const hoverLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    hoverLayer.id = 'country-hover-layer';
    hoverLayer.style.pointerEvents = 'none';
    worldMap.appendChild(hoverLayer);

    function showCountryHover(countryPath) {
        clearCountryHover();

        const previousShrinkingClone = shrinkingCountryClones.get(countryPath);
        if (previousShrinkingClone) {
            previousShrinkingClone.remove();
            countryPath.style.removeProperty('opacity');
            shrinkingCountryClones.delete(countryPath);
        }

        const clonedPath = countryPath.cloneNode(true);
        clonedPath.removeAttribute('id');
        clonedPath.classList.add('country-hover-clone');

        clonedPath.dataset.hoverCountry = countryPath.id;

        hoverLayer.appendChild(clonedPath);

        activeCountryClone = clonedPath;

        hiddenCountryPath = countryPath;
        countryPath.style.opacity = 0;
    }

    function clearCountryHover() {
        if (activeCountryClone !== null) {
            const originalCountryPath = hiddenCountryPath;
            const shrinkingClone = activeCountryClone;

            activeCountryClone.classList.add('shrinking');

            shrinkingCountryClones.set(originalCountryPath, shrinkingClone);

            activeCountryClone = null;

            shrinkingClone.addEventListener('animationend', () => {
                originalCountryPath.style.removeProperty('opacity');
                shrinkingClone.remove();
                shrinkingCountryClones.delete(originalCountryPath);
            });

            hiddenCountryPath = null;
        }
    }

    return {showCountryHover, clearCountryHover};
}
