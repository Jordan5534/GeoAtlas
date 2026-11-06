import { initializeCountryHover } from "./map-country-hover.js";
import { initializeContinentHover } from "./map-continent-hover.js";

// Hover Logic
export function initializeMapHover(worldMap, countryData, geoguessrCountries) {
    const {showCountryHover, clearCountryHover} = initializeCountryHover(worldMap);
    const {showContinentHover, clearContinentHover} = initializeContinentHover(worldMap);

    let activeCountry = null;
    let activeContinent = null;

    let resetTimeout = null;

    const countryPaths = worldMap.querySelectorAll('path');

    countryPaths.forEach((path) => {
        if (path.id === '_somaliland') {
            path.dataset.continent = 'AF';
        }

        const currentID = path.id.toUpperCase();
        const isSupported = Object.hasOwn(geoguessrCountries, currentID);
        path.dataset.supported = isSupported;

        const country = countryData[currentID];

        if (country) {
            const currentContinent = country.continent;
            path.dataset.continent = currentContinent;
        }
    });

    function scheduleHighlightReset() {
        const currentView = worldMap.dataset.view;

        if (currentView === 'world') {
            if (activeContinent && resetTimeout === null) {
                resetTimeout = setTimeout(() => {
                    clearContinentHover();
                    const outlinePaths = worldMap.querySelectorAll('#continent-outline-layer .continent-outline');

                    outlinePaths.forEach((path) => {
                        path.classList.remove('active');
                    });
                    resetTimeout = null;
                    activeContinent = null;
                }, 95);
            }
        } else {
            if (activeCountry !== null && resetTimeout === null) {
                resetTimeout = setTimeout(() => {
                    activeCountry.style.removeProperty('stroke');
                    clearCountryHover();

                    activeCountry = null;
                    resetTimeout = null;
                }, 95);
            }
        }
    }

    function clearHighlights() {
        if (resetTimeout != null) {
            clearTimeout(resetTimeout);
            resetTimeout = null;
        }

        if (activeCountry != null) {
            activeCountry.style.removeProperty('stroke');
            clearCountryHover();
            activeCountry = null;
        }

        if (activeContinent != null) {
            clearContinentHover();
            const outlinePaths = worldMap.querySelectorAll('#continent-outline-layer .continent-outline');

            outlinePaths.forEach((path) => {
                path.classList.remove('active');
            });

            activeContinent = null;
        }
    }

    worldMap.addEventListener('mouseover', (event) => {
        if (worldMap.dataset.animating === 'true') {
            return;
        }

        if (event.target.matches('path')) {
            const currentView = worldMap.dataset.view;
            const clickedCountryID = event.target.id.toUpperCase();

            if (!Object.hasOwn(geoguessrCountries, clickedCountryID) && currentView === 'continent') {
                scheduleHighlightReset();
                return;
            }

            const hoveredContinent = event.target.dataset.continent;
            const selectedContinent = worldMap.dataset.selectedContinent;

            if (hoveredContinent !== selectedContinent && currentView === 'continent') {
                scheduleHighlightReset();
                return;
            }

            if (resetTimeout) {
                clearTimeout(resetTimeout);
                resetTimeout = null;
            }

            if (currentView === 'world') {
                const continent = hoveredContinent;

                if (continent) {

                    if (continent !== activeContinent) {
                        const outlinePaths = worldMap.querySelectorAll('#continent-outline-layer .continent-outline');

                        if (activeContinent != null) {
                            outlinePaths.forEach((path) => {
                                path.classList.remove('active');
                            });
                        }

                        showContinentHover(continent);

                        activeContinent = continent;
                    }
                }
            } else if (currentView === 'continent') {

                if (activeCountry !== null && activeCountry !== event.target) {
                    activeCountry.style.removeProperty('stroke');
                }

                activeCountry = event.target;
                event.target.style.stroke = '#FFFFFF';
                showCountryHover(event.target);
            }

        } else {
            scheduleHighlightReset();
        }
    });

    worldMap.addEventListener('mouseleave', () => {
        scheduleHighlightReset();
    });

    return clearHighlights;
}
