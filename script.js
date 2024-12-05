const apiKeyUrl = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys';
const bodiesUrl = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies';

let apiKey = '';

async function fetchApiKey() {
    try {
        const response = await fetch(apiKeyUrl, { method: 'POST' });
        const data = await response.json();
        apiKey = data.key;
        fetchBodies();
    } catch (error) {
        console.error('no API key:', error);
    }
}

async function fetchBodies() {
    try {
        const response = await fetch(bodiesUrl, {
            method: 'GET',
            headers: { 'x-zocom': apiKey }
        });
        const data = await response.json();
        displayPlanets(data.bodies);
    } catch (error) {
        console.error('no planet data can be find:', error);
    }
}

function displayPlanets(bodies) {
    const container = document.getElementById('solar-system-container');

    bodies.forEach(body => {
        if (body.type === 'planet' || body.type === 'star') {
            const planetDiv = document.createElement('div');
            planetDiv.classList.add('planet', body.name.toLowerCase());
            planetDiv.dataset.id = body.id;

            planetDiv.addEventListener('click', () => showPlanetInfo(body));
            container.appendChild(planetDiv);
        }
    });
}

function showPlanetInfo(body) {
    const planetInfo = document.getElementById('planet-info-container');
    const planetHighlight = planetInfo.querySelector('.planet-visual-highlight');

    const planetColors = {
        solen: '#FFD029',
        merkurius: '#888888',
        venus: '#E7CDCD',
        jorden: '#428ED4',
        mars: '#EF5F5F',
        jupiter: '#E29468',
        saturnus: '#C7AA72',
        uranus: '#C9D4F1',
        neptunus: '#7A91A7',
    };

    planetInfo.className = `planet-info ${body.name.toLowerCase()}`;
    planetHighlight.style.backgroundColor = planetColors[body.name.toLowerCase()] || '#ffffff';

    document.getElementById('planet-title').textContent = body.name.toUpperCase();
    document.getElementById('planet-subtitle').textContent = body.latinName;
    document.getElementById('planet-description').textContent = body.desc;
    document.getElementById('planet-circumference-info').textContent = `${body.circumference} km`;
    document.getElementById('planet-temp-day-info').textContent = `${body.temp.day}°C`;
    document.getElementById('planet-temp-night-info').textContent = `${body.temp.night}°C`;
    document.getElementById('planet-distance-info').textContent = `${body.distance}`;
    document.getElementById('planet-rotation-info').textContent = `${body.rotation} dygn`;
    document.getElementById('planet-orbit-info').textContent = body.orbitalPeriod; 
    document.getElementById('planet-moons-info').textContent = body.moons.length > 0 ? body.moons.join(', ') : 'Inga';

    planetInfo.classList.remove('hidden');
}

function hidePlanetInfo() {
    const planetInfo = document.getElementById('planet-info-container');
    planetInfo.classList.add('hidden');
}

document.getElementById('close-planet-info').addEventListener('click', hidePlanetInfo);
fetchApiKey();