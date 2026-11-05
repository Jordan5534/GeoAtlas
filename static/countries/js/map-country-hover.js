export function initializeCountryHover(worldMap) {
    const hoverLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    hoverLayer.id = 'country-hover-layer';
    hoverLayer.style.pointerEvents = 'none';
    worldMap.appendChild(hoverLayer);

    function showCountryHover(countryPath) {
        hoverLayer.replaceChildren();

        const clonedPath = countryPath.cloneNode(true);
        clonedPath.removeAttribute('id');
        clonedPath.classList.add('country-hover-clone');
        hoverLayer.appendChild(clonedPath);
    }

    function clearCountryHover() {
        hoverLayer.replaceChildren();
    }
    return {showCountryHover, clearCountryHover};
}