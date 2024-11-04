const apiUrl = 'http://localhost:8080/api/games';

function formatInputDateToApiFormat(dateString) {
    const parts = dateString.split('/');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function addGame() {
    let releaseDate = document.getElementById('releaseDate').value;

    if (releaseDate.includes('/')) {
        releaseDate = formatInputDateToApiFormat(releaseDate);
    }

    const game = {
        title: document.getElementById('title').value,
        developer: document.getElementById('developer').value,
        publisher: document.getElementById('publisher').value,
        releaseYear: parseInt(document.getElementById('releaseYear').value),
        releaseDate: releaseDate,
        personalScore: parseFloat(document.getElementById('personalScore').value),
        personalThoughts: document.getElementById('personalThoughts').value
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(game)
    })
        .then(response => response.json())
        .then(data => {
            alert('Game added successfully');
            window.location.href = '/games';
        })
        .catch(error => console.error('Error:', error));
}

function getYears() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const yearSet = new Set();
            data.forEach(game => {
                yearSet.add(game.releaseYear);
            });

            const yearList = document.getElementById('yearList');
            yearList.innerHTML = '';
            yearSet.forEach(year => {
                yearList.innerHTML += `
                <a href="/year?type=games&year=${year}" class="year-link">Top Games of ${year}</a><br>
            `;
            });
        })
        .catch(error => console.error('Error fetching game years:', error));
}

document.addEventListener('DOMContentLoaded', getYears);
