import { animateToViewBox } from "./map-animate.js";
import { zoomToCountry } from "./map-country-zoom.js";
import { zoomToContinent } from "./map-continent-zoom.js";

export function initializeNav(worldMap, geoguessrCountries, clearHighlights) {
    const continentViews = {
        'EU': '785 130 530 330', 
        'AS': '1120 220 800 450', 
        'SA': '320 470 650 440',
        'AF': '690 335 780 460',
        'OC': '1450 540 640 360',
        'NA': '0 105 900 510'
    };
    const mapContainer = document.getElementById('world-map-container');

    const originalViewBox = worldMap.getAttribute('viewBox');

    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', () => {
        const currentView = worldMap.dataset.view;

        if (currentView === 'country') {
            clearHighlights();
            worldMap.dataset.view = 'continent';
            backButton.textContent = '↩ Back to World';
            const selectedContinent = worldMap.dataset.selectedContinent; 
            const coords = continentViews[selectedContinent];
            zoomToContinent(worldMap, coords);

        } else if (currentView === 'continent') {
            clearHighlights();
            worldMap.dataset.view = 'world';
            delete worldMap.dataset.selectedContinent;
            animateToViewBox(worldMap, originalViewBox);
            backButton.style.display = 'none';
        }
    });

    worldMap.addEventListener('click', (event) => {
        if (event.target.matches('path')) {
            const clickedCountryID = event.target.id.toUpperCase();

            const currentView = worldMap.dataset.view;
            const clickedContinent = event.target.dataset.continent;
            const coords = continentViews[clickedContinent];
            if (currentView === 'world'){
                if (coords) {
                    clearHighlights();
                    worldMap.dataset.view = 'continent';
                    worldMap.dataset.selectedContinent = clickedContinent;
                    zoomToContinent(worldMap, coords);
                    if (window.innerWidth <= 600) {
                        mapContainer.scrollLeft = (mapContainer.scrollWidth - mapContainer.clientWidth) / 2;
                    }
                    backButton.style.display = 'block';
                }
            } else if (currentView === 'continent') {
                if (!Object.hasOwn(geoguessrCountries, clickedCountryID)) {
                    return;
                }
                if (clickedContinent === worldMap.dataset.selectedContinent) {
                    clearHighlights();
                    worldMap.dataset.view = 'country';
                    const clickedCountry = event.target;
                    clickedCountry.style.removeProperty('fill');

                    backButton.textContent = '↩ Back to Continent';
                    zoomToCountry(worldMap, event.target);
                }
            }
        }
    });
}