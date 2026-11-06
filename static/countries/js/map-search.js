export function initializeSearch(worldMap, countryData, geoguessrCountries, openCountry) {
    const searchInput = document.getElementById('country-search');
    const searchResults = document.getElementById('search-results');

    searchInput.addEventListener('input', () => {
        const searchQuery = searchInput.value.trim().toLowerCase();
        searchResults.replaceChildren();
        if (searchQuery === '') {
            return;
        }
        const matches = Object.entries(countryData).filter(([code, country]) => {
            return country.name.toLowerCase().includes(searchQuery) && Object.hasOwn(geoguessrCountries, code);
        });
        matches.forEach(([code, country]) => {
            const resultButton  = document.createElement('button');

            resultButton.type = 'button';
            resultButton.textContent = country.name;
            resultButton.classList.add('search-result');
            searchResults.appendChild(resultButton);

            resultButton.addEventListener('click', () => {
                const countryPath = worldMap.querySelector(`#${code.toLowerCase()}`);
                if (countryPath !== null) {
                    searchInput.value = '';
                    searchResults.replaceChildren();
                    openCountry(countryPath);
                } 
                else {
                    console.warn(`No SVG path found for ${country.name}`);
                }
            });
        });
    });
}