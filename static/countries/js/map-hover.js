// Hover Logic
export function initializeMapHover(worldMap, countryData) {
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
    }

    worldMap.addEventListener('mouseover', (event) => {
        if (event.target.matches('path')) {
            if (resetTimeout) {
                clearTimeout(resetTimeout);
                resetTimeout = null;
            }
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
                        path.style.fill = "#FFD166";
                    });
                }
            } 
        } else {
            scheduleHighlightReset();
        }
    });

    worldMap.addEventListener('mouseleave', () => {
        scheduleHighlightReset();
    });
}