export function initializeMapTooltip(worldMap, geoguessrCountries) {
    const tooltip = document.getElementById('map-tooltip');
    worldMap.addEventListener('mouseover', (event) => {
        
        if (worldMap.dataset.view !== 'continent') {
            tooltip.style.display = 'none';
            return;
        }

        if (worldMap.dataset.animating === 'true') {
            tooltip.style.display = 'none';
            return;
        }

        if (!event.target.matches('path')) {
            tooltip.style.display = 'none';
            return;
        }

        if (event.target.dataset.interactive !== 'true') {
            tooltip.style.display = 'none';
            return;
        }

        const hoveredCountryID = event.target.id.toUpperCase();

        tooltip.textContent = geoguessrCountries[hoveredCountryID];
        tooltip.style.display = 'block';
    });

    worldMap.addEventListener('mousemove', (event) => {
        tooltip.style.left = `${event.clientX + 15}px`;
        tooltip.style.top = `${event.clientY + 15}px`;
    });

    worldMap.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });

    worldMap.addEventListener('click', () => {
        tooltip.style.display = 'none';
    });
}   