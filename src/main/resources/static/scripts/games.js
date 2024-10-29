const apiUrl = 'http://localhost:8080/api/games';

function addGame() {
    let releaseDate = document.getElementById('releaseDate').value;

    if (!isValidDate(releaseDate)) {
        alert('Invalid date format. Please use dd/mm/yyyy');
        return;
    }

    releaseDate = formatInputDateToApiFormat(releaseDate);

    const game = {
        title: document.getElementById('title').value,
        developer: document.getElementById('developer').value,
        publisher: document.getElementById('publisher').value,
        releaseYear: document.getElementById('releaseYear').value,
        releaseDate: releaseDate,
        personalScore: document.getElementById('personalScore').value,
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
        .then(() => {
            alert('Game added successfully');
        })
        .catch(error => console.error('Error adding game:', error));
}

function isValidDate(dateString) {
    // Regex for dd/mm/yyyy format
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return regex.test(dateString);
}

function formatInputDateToApiFormat(dateString) {
    const parts = dateString.split('/');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
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
