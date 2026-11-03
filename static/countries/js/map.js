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
                    console.log(countryData)
                    console.log(countryData['fr'.toUpperCase()].continent)
                })
        })
})