
export function initializeContinentHover(worldMap) {
    // Track the original country paths that are hidden during hover.
    let hiddenContinentPaths = [];

    // Store the currently enlarged continent group.
    let activeContinentGroup = null;

    // Track continents that are currently shrinking.
    // Key = continent code ("AF"), Value = shrinking SVG group.
    const shrinkingContinentGroups = new Map();

    // Create a separate SVG layer for the enlarged continent groups.
    // Disable pointer events so clones don't interfere with mouse hovering.
    const hoverLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    hoverLayer.id = 'continent-hover-layer';
    hoverLayer.style.pointerEvents = 'none';
    worldMap.appendChild(hoverLayer); 

    function showContinentHover(continentCode) {
        // Start shrinking the previously hovered continent, if one exists.
        clearContinentHover();

        // Create a new SVG group for the continent's enlarged copies.
        // Store its continent code so we can identify it later.
        const continentGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        continentGroup.dataset.hoverContinent = continentCode;

        // Find the original country paths belonging to this continent.
        // Exclude paths inside the hover layer to avoid cloning copies.
        const continentPaths = Array.from(worldMap.querySelectorAll(`path[data-continent='${continentCode}'`)).filter((path) => {
            if (!path.closest('#continent-hover-layer')) {
                return true;
            }
        });

        // Check whether this continent is already shrinking.
        // If so, cancel its old shrinking animation before enlarging it again.
        const previousShrinkingGroup = shrinkingContinentGroups.get(continentCode);
        if (previousShrinkingGroup) {
            previousShrinkingGroup.remove();

            // Restore the original countries before cloning them again.
            continentPaths.forEach((path) => {
                path.style.removeProperty('opacity');
            });

            // Remove the canceled animation from the Map.
            shrinkingContinentGroups.delete(continentCode);
        }

        // Find the outline paths belonging to the selected continent.
        const outlinePaths = document.querySelectorAll(`#continent-outline-layer .continent-outline[data-outline-continent='${continentCode}'`);

        // Clone the green outlines and add them to the continent group.
        outlinePaths.forEach((outline) => {
            const clonedOutline = outline.cloneNode(true);
            clonedOutline.classList.add('active');
            continentGroup.appendChild(clonedOutline);
        });

        // Apply the CSS enlargement animation to the entire group.
        continentGroup.classList.add('continent-hover-group');

        // Clone each country and place it above the green outlines.
        continentPaths.forEach(continent => {
            const clonedPath = continent.cloneNode(true);
            clonedPath.removeAttribute('id');
            continentGroup.appendChild(clonedPath);
        });

        // Add the completed continent group to the hover layer.
        // Remember it so we can shrink it when hovering ends.
        hoverLayer.appendChild(continentGroup);
        activeContinentGroup = continentGroup;

        // Hide the original countries to prevent overlapping shapes.
        hiddenContinentPaths = continentPaths;
        continentPaths.forEach((path) => {
            path.style.opacity = 0;
        });
    }

    function clearContinentHover() {
        // Only start shrinking if a continent is currently enlarged.
        if (activeContinentGroup !== null) {
            // Save references so this animation can finish independently,
            // even if the user starts hovering another continent.
            const shrinkingGroup = activeContinentGroup;
            const originalContinentPaths = hiddenContinentPaths;

            // Trigger the CSS shrinking animation.
            // The green outlines also fade away during this animation.
            activeContinentGroup.classList.add('shrinking');

            // Remember which continent is shrinking so we can cancel
            // the animation if the user hovers it again too quickly.
            shrinkingContinentGroups.set(shrinkingGroup.dataset.hoverContinent, shrinkingGroup);

            // Clear the active group so another continent can be enlarged.
            activeContinentGroup = null;

            // When shrinking finishes, restore the original countries,
            // remove the cloned group, and clean up the Map entry.
            shrinkingGroup.addEventListener('animationend', () => {
                originalContinentPaths.forEach((path) => {
                    path.style.removeProperty('opacity');
                });

                shrinkingGroup.remove();
                shrinkingContinentGroups.delete(shrinkingGroup.dataset.hoverContinent);
            });
        }

        // Reset the active original-country references.
        // The animation listener retains its own saved references.
        hiddenContinentPaths = [];
    }

    // Allow the map-hover module to start and clear continent hover effects.
    return {showContinentHover, clearContinentHover};
}
