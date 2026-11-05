import { initializeCountryHover } from "./map-country-hover.js";
import { initializeContinentHover } from "./map-continent-hover.js";

// Hover Logic
export function initializeMapHover(worldMap, countryData, geoguessrCountries) {
    // Get functions from country hover and continent hover
    const {showCountryHover, clearCountryHover} = initializeCountryHover(worldMap);
    const {showContinentHover, clearContinentHover} = initializeContinentHover(worldMap);

    // Track which country and continent are currently highlighted
    let activeCountry = null;
    let activeContinent = null;

    // Store the timeout used to delay removing hover highlights
    let resetTimeout = null;

    // Select all country paths in the SVG map
    const countryPaths = worldMap.querySelectorAll('path');

    // Assign continent and GeoGuessr support data to each country
    countryPaths.forEach((path) => {
        // Manually assign Somaliland to Africa
        if (path.id === '_somaliland') {
            path.dataset.continent = 'AF';
        }

        // Check whether the country is supported by GeoGuessr
        const currentID = path.id.toUpperCase();
        const isSupported = Object.hasOwn(geoguessrCountries, currentID);
        path.dataset.supported = isSupported;

        // Look up the country's continent
        const country = countryData[currentID];

        if (country) {
            const currentContinent = country.continent;
            path.dataset.continent = currentContinent;
        }
    });

    // Schedule removal of the current hover highlight after a short delay
    function scheduleHighlightReset() {
        const currentView = worldMap.dataset.view;

        // World view: remove the active continent outline
        if (currentView === 'world') {
            if (activeContinent && resetTimeout === null) {
                resetTimeout = setTimeout(() => {
                    clearContinentHover();
                    // Find all cloned continent outline paths
                    const outlinePaths = worldMap.querySelectorAll('#continent-outline-layer .continent-outline');

                    // Hide the outlines by removing their active class
                    outlinePaths.forEach((path) => {
                        path.classList.remove('active');
                    });

                    // Reset the timeout and active continent
                    resetTimeout = null;
                    activeContinent = null;
                }, 95);
            }
        } else {
            // Continent view: remove the highlighted country's stroke
            if (activeCountry !== null && resetTimeout === null) {
                resetTimeout = setTimeout(() => {
                    activeCountry.style.removeProperty('stroke');
                    clearCountryHover();

                    // Reset the active country and timeout
                    activeCountry = null;
                    resetTimeout = null;
                }, 95);
            }
        }
    }

    // Immediately clear all highlights and cancel any pending reset
    function clearHighlights() {
        // Cancel a scheduled reset if one exists
        if (resetTimeout != null) {
            clearTimeout(resetTimeout);
            resetTimeout = null;
        }

        // Remove the highlighted country's stroke
        if (activeCountry != null) {
            activeCountry.style.removeProperty('stroke');
            clearCountryHover();
            activeCountry = null;
        }

        // Remove the active continent's outline
        if (activeContinent != null) {
            clearContinentHover();
            const outlinePaths = worldMap.querySelectorAll('#continent-outline-layer .continent-outline');

            outlinePaths.forEach((path) => {
                path.classList.remove('active');
            });

            activeContinent = null;
        }
    }

    // Handle hovering over countries and continents
    worldMap.addEventListener('mouseover', (event) => {
        // Ignore hover events while the map is animating
        if (worldMap.dataset.animating === 'true') {
            return;
        }

        // Only process hover events targeting SVG paths
        if (event.target.matches('path')) {
            const currentView = worldMap.dataset.view;
            const clickedCountryID = event.target.id.toUpperCase();

            // In continent view, ignore countries unsupported by GeoGuessr
            if (!Object.hasOwn(geoguessrCountries, clickedCountryID) && currentView === 'continent') {
                scheduleHighlightReset();
                return;
            }

            // Identify the hovered country's continent
            const hoveredContinent = event.target.dataset.continent;
            const selectedContinent = worldMap.dataset.selectedContinent;

            // In continent view, ignore countries outside the selected continent
            if (hoveredContinent !== selectedContinent && currentView === 'continent') {
                scheduleHighlightReset();
                return;
            }

            // Cancel a pending reset when hovering over a valid path
            if (resetTimeout) {
                clearTimeout(resetTimeout);
                resetTimeout = null;
            }

            // WORLD VIEW: highlight continent outlines
            if (currentView === 'world') {
                const continent = hoveredContinent;

                // Only continue if the hovered path belongs to a continent
                if (continent) {

                    // Update the outline only when entering a different continent
                    if (continent !== activeContinent) {
                        const outlinePaths = worldMap.querySelectorAll('#continent-outline-layer .continent-outline');

                        // Remove the previous continent's outline
                        if (activeContinent != null) {
                            outlinePaths.forEach((path) => {
                                path.classList.remove('active');
                            });
                        }

                        // Activate the hovered continent's outline
                        showContinentHover(continent);

                        // Remember which continent is currently hovered
                        activeContinent = continent;
                    }
                }
            } else if (currentView === 'continent') {
                // CONTINENT VIEW: highlight individual supported countries

                // Remove the previous country's highlight if hovering a new one
                if (activeCountry !== null && activeCountry !== event.target) {
                    activeCountry.style.removeProperty('stroke');
                }

                // Highlight the currently hovered country with a green stroke
                activeCountry = event.target;
                event.target.style.stroke = '#C8E6A1';
                showCountryHover(event.target);
            }

        } else {
            // Schedule a reset when hovering over something other than a path
            scheduleHighlightReset();
        }
    });

    // Schedule highlight removal when the mouse leaves the entire SVG
    worldMap.addEventListener('mouseleave', () => {
        scheduleHighlightReset();
    });

    // Allow other modules, such as map navigation, to clear highlights
    return clearHighlights;
}
