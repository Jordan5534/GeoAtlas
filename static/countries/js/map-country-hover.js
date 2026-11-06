
export function initializeCountryHover(worldMap) {
    // Keep track of the original country and its enlarged clone.
    let hiddenCountryPath = null;
    let activeCountryClone = null;

    // Store countries that are currently playing their shrinking animation.
    // Key = original country, Value = shrinking clone.
    const shrinkingCountryClones = new Map();

    // Create an SVG group to hold the enlarged country clones.
    const hoverLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    hoverLayer.id = 'country-hover-layer';
    hoverLayer.style.pointerEvents = 'none';
    worldMap.appendChild(hoverLayer);

    function showCountryHover(countryPath) {
        // Start shrinking the previously hovered country, if one exists.
        clearCountryHover();

        // Check whether this country is already shrinking.
        // If it is, cancel its old shrinking animation.
        const previousShrinkingClone = shrinkingCountryClones.get(countryPath);
        if (previousShrinkingClone) {
            previousShrinkingClone.remove();
            countryPath.style.removeProperty('opacity');
            shrinkingCountryClones.delete(countryPath);
        }

        // Clone the original country so we can enlarge it separately.
        const clonedPath = countryPath.cloneNode(true);
        clonedPath.removeAttribute('id');
        clonedPath.classList.add('country-hover-clone');

        clonedPath.dataset.hoverCountry = countryPath.id;

        hoverLayer.appendChild(clonedPath);

        // Remember the enlarged clone so we can shrink it later.
        activeCountryClone = clonedPath;

        // Hide the original country to prevent overlapping shapes.
        hiddenCountryPath = countryPath;
        countryPath.style.opacity = 0;
    }

    function clearCountryHover() {
        if (activeCountryClone !== null) {
            // Save references to the original country and its clone.
            // These references remain valid even if another country is hovered.
            const originalCountryPath = hiddenCountryPath;
            const shrinkingClone = activeCountryClone;

            // Trigger the CSS shrinking animation.
            activeCountryClone.classList.add('shrinking');

            // Remember which original country belongs to this shrinking clone.
            shrinkingCountryClones.set(originalCountryPath, shrinkingClone);

            // Clear the active clone so another country can be enlarged.
            activeCountryClone = null;

            // Once the shrinking animation finishes, restore the original
            // country, remove its clone, and clean up the Map entry.
            shrinkingClone.addEventListener('animationend', () => {
                originalCountryPath.style.removeProperty('opacity');
                shrinkingClone.remove();
                shrinkingCountryClones.delete(originalCountryPath);
            });

            // Reset the active original-country reference.
            hiddenCountryPath = null;
        }
    }

    // Allow other modules to start and clear country hover effects.
    return {showCountryHover, clearCountryHover};
}
