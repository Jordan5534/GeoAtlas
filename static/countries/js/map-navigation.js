import { animateToViewBox } from "./map-animate.js";
import { zoomToCountry } from "./map-country-zoom.js";
import { zoomToContinent } from "./map-continent-zoom.js";

export function initializeNav(worldMap) {
    const continentViews = {
        'EU': '750 150 600 300', 
        'AS': '1100 220 840 500', 
        'SA': '300 515 750 500',
        'AF': '675 365 825 500',
        'OC': '1600 590 500 500',
        'NA': '50 150 800 500'
    };
    const mapContainer = document.getElementById('world-map-container');

    const originalViewBox = worldMap.getAttribute('viewBox');

    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', () => {
        const currentView = worldMap.dataset.view;

        if (currentView === 'country') {
            worldMap.dataset.view = 'continent';
            backButton.textContent = '↩ Back to World';
            const selectedContinent = worldMap.dataset.selectedContinent; 
            const coords = continentViews[selectedContinent];
            zoomToContinent(worldMap, coords);

        } else if (currentView === 'continent') {
            worldMap.dataset.view = 'world';
            delete worldMap.dataset.selectedContinent;
            animateToViewBox(worldMap, originalViewBox);
            backButton.style.display = 'none';
        }
    });

    worldMap.addEventListener('click', (event) => {
        if (event.target.matches('path')) {
            const currentView = worldMap.dataset.view;
            const clickedContinent = event.target.dataset.continent;
            const coords = continentViews[clickedContinent];
            if (currentView === 'world'){
                if (coords) {
                    worldMap.dataset.view = 'continent';
                    worldMap.dataset.selectedContinent = clickedContinent;
                    zoomToContinent(worldMap, coords);
                    if (window.innerWidth <= 600) {
                        mapContainer.scrollLeft = (mapContainer.scrollWidth - mapContainer.clientWidth) / 2;
                    }
                    backButton.style.display = 'block';
                }
            } else if (currentView === 'continent') {
                if (clickedContinent === worldMap.dataset.selectedContinent) {
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