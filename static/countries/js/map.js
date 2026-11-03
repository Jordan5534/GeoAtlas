document.addEventListener('DOMContentLoaded', () => {
    const map_container = document.getElementById('world-map-container');
    fetch('/static/countries/world.svg')
        .then(response => {
            return response.text();
        })
        .then(svgText => {
            map_container.innerHTML = svgText;
            fetch('/static/countries/data/countries.min.json')
                .then(response => {
                    return response.json()
                })
                .then(countryData => {
                    let activeContinent = null;
                    let resetTimeout = null;
                    const countryPaths = document.getElementById('world-map').querySelectorAll('path');
                    countryPaths.forEach((path) => {
                            const currentID = path.id.toUpperCase();
                            const country = countryData[currentID];
                            if (country) {
                                const currentContinent = country.continent;
                                path.dataset.continent = currentContinent
                            }
                        })
                        function scheduleHighlightReset() {
                            if (activeContinent && resetTimeout === null) {
                                resetTimeout = setTimeout(() => {
                                    const continentPaths = document.querySelectorAll(`path[data-continent='${activeContinent}'`);
                                    continentPaths.forEach((target) => {
                                    target.style.removeProperty('fill')
                                    })
                                    resetTimeout = null
                                    activeContinent = null
                                }, 200)
                            }
                        }
                    document.getElementById('world-map').addEventListener('mouseover', (event) => {
                        if (event.target.matches('path')) {
                            if (resetTimeout) {
                                clearTimeout(resetTimeout)
                                resetTimeout = null
                            }
                            const countryID = event.target.id.toUpperCase();
                            const country = countryData[countryID];
                            if (country) {
                                const continent = country.continent;
                                if (continent !== activeContinent) {
                                    const continentPaths = document.querySelectorAll(`path[data-continent='${continent}'`);
                                    if (activeContinent != null) {
                                        const previousPaths = document.querySelectorAll(`path[data-continent='${activeContinent}'`);
                                        previousPaths.forEach((target) => {
                                            target.style.removeProperty('fill')
                                        })
                                    }
                                    activeContinent = continent;
                                    continentPaths.forEach((path) => {
                                        path.style.fill = "#FFD166"
                                    })
                                }
                            }
                        } else {
                            scheduleHighlightReset()
                        }
                    })
                    document.getElementById('world-map').addEventListener('mouseleave', () => {
                        scheduleHighlightReset()
                    })
                })
        })
})