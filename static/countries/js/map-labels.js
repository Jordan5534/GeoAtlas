export function initializeMapLabels(worldMap) {
    const continents = [{
        name: 'AFRICA', x: 1090, y: 490, code: 'AF'},
        {name: 'NORTH AMERICA', x: 450, y: 335, code: 'NA'},
        {name: 'ASIA', x: 1500, y: 335, code: 'AS'},
        {name: 'SOUTH AMERICA', x: 685, y: 635, code: 'SA'},
        {name: 'OCEANIA', x: 1740, y: 725, code: 'OC'},
        {name: 'EUROPE', x: 1075, y: 315, code: 'EU'}
    ];

    continents.forEach(continent => {
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");

        label.dataset.continent = continent.code;

        label.classList.add('continent-labels');
        if (continent.name.includes(' ')) {
            const words = continent.name.split(' ');
            const firstLine = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            firstLine.textContent = words[0];
            label.appendChild(firstLine);

            const secondLine = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            secondLine.textContent = words[1];
            label.appendChild(secondLine);
            secondLine.setAttribute('x', continent.x);
            secondLine.setAttribute('dy', 24);
        } else {
            label.textContent = continent.name;
        }
        label.setAttribute('x', continent.x);
        label.setAttribute('y', continent.y);
        worldMap.appendChild(label);
    });
}