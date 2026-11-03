export function initializeNav(worldMap) {
    const continentViews = {
        'EU': '850, 200, 375, 500', 
        'AS': '1100, 220, 840, 500', 
        'SA': '300, 515, 750, 500',
        'AF': '675, 365, 825, 500',
        'OC': '1600, 590, 500, 500',
        'NA': '50, 150, 800, 500'
    };

    const viewBox = worldMap.getAttribute('viewBox');
    worldMap.addEventListener('click', (event) => {
        if (event.target.matches('path')) {
            const clickedContinent = event.target.dataset.continent;
            const coords = continentViews[clickedContinent];
            if (coords) {
                worldMap.setAttribute('viewBox', coords);
            }
        }
    });
}