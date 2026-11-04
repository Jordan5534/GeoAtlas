// Hover Logic
export function initializeMapHover(worldMap, countryData, geoguessrCountries) {
    let activeCountry = null;
    let activeContinent = null;
    let resetTimeout = null;
    const countryPaths = worldMap.querySelectorAll('path');
    countryPaths.forEach((path) => {
        const currentID = path.id.toUpperCase();
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
                    const continentPaths = worldMap.querySelectorAll(`path[data-continent='${activeContinent}'`);
                    continentPaths.forEach((target) => {
                        target.style.removeProperty('fill');
                    });
                    resetTimeout = null;
                    activeContinent = null;
                }, 200);
            }   
        } else {
            if (activeCountry !== null && resetTimeout === null) {
                resetTimeout = setTimeout(() => {
                    activeCountry.style.removeProperty('fill');   
                    activeCountry = null;
                    resetTimeout = null;
                }, 200);
            }
        }
    }

    function clearHighlights() {
        if (resetTimeout != null) {
            clearTimeout(resetTimeout);
            resetTimeout = null;
        }
        if (activeCountry != null) {
            activeCountry.style.removeProperty('fill');
            activeCountry = null;
        }
        if (activeContinent != null) {
            worldMap.querySelectorAll(`path[data-continent='${activeContinent}'`).forEach((target) => {
                target.style.removeProperty('fill');
            });
            activeContinent = null;
        }
    }

    worldMap.addEventListener('mouseover', (event) => {
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
                const countryID = event.target.id.toUpperCase();
                const country = countryData[countryID];
                if (country) {
                    const continent = country.continent;
                    if (continent !== activeContinent) {
                        const continentPaths = worldMap.querySelectorAll(`path[data-continent='${continent}'`);
                        if (activeContinent != null) {
                            const previousPaths = worldMap.querySelectorAll(`path[data-continent='${activeContinent}'`);
                            previousPaths.forEach((target) => {
                                target.style.removeProperty('fill');
                            });
                        }
                        activeContinent = continent;
                        continentPaths.forEach((path) => {
                            path.style.fill = "#D6F05C";
                        });
                    }
                } 
            } else if (currentView === 'continent') {
                if (activeContinent !== null) {
                    const continentPaths = worldMap.querySelectorAll(`path[data-continent='${activeContinent}'`);
                    continentPaths.forEach((path) => {
                        path.style.removeProperty('fill');
                    });
                    activeContinent = null;     
                }
                if (activeCountry !== null && activeCountry !== event.target) {
                    activeCountry.style.removeProperty('fill');
                }
                activeCountry = event.target;
                event.target.style.fill = '#D6F05C';
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