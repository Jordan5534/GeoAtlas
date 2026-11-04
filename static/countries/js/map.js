// Init map
import { initializeMapHover } from "./map-hover.js";
import { initializeNav } from "./map-navigation.js";

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
                    return response.json();
                })
                .then(countryData => {
                    fetch('/static/countries/data/geoguessr-countries.json')
                        .then(response => {
                            return response.json();
                        })
                        .then(geoguessrCountries => {
                            const worldMap = document.getElementById('world-map');
                            worldMap.dataset.view = 'world';
                            const clearHighlights = initializeMapHover(worldMap, countryData, geoguessrCountries);
                            initializeNav(worldMap, geoguessrCountries, clearHighlights);
                        });
                });
        });
});