const apiUrl = 'http://localhost:8080/api/movies';

function formatInputDateToApiFormat(dateString) {
    const parts = dateString.split('/');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function addMovie() {
    let releaseDate = document.getElementById('releaseDate').value;

    if (releaseDate.includes('/')) {
        releaseDate = formatInputDateToApiFormat(releaseDate);
    }

    const movie = {
        title: document.getElementById('title').value,
        director: document.getElementById('director').value,
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
        body: JSON.stringify(movie)
    })
        .then(response => response.json())
        .then(data => {
            alert('Movie added successfully');
            window.location.href = '/movies';
        })
        .catch(error => console.error('Error:', error));
}

function getYears() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const yearSet = new Set();
            data.forEach(movie => {
                yearSet.add(movie.releaseYear);
            });

            const yearList = document.getElementById('yearList');
            yearList.innerHTML = '';
            yearSet.forEach(year => {
                yearList.innerHTML += `
                <a href="/year?type=movies&year=${year}" class="year-link">Top Movies of ${year}</a><br>
            `;
            });
        })
        .catch(error => console.error('Error fetching movie years:', error));
}

document.addEventListener('DOMContentLoaded', getYears);
