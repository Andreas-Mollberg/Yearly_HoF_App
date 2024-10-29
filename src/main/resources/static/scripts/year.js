const apiUrl = 'http://localhost:8080/api/';

const urlParams = new URLSearchParams(window.location.search);
const year = urlParams.get('year');
const type = urlParams.get('type');

const endpoint = type === 'games' ? 'games' : 'movies';

function formatReleaseDate(releaseDate) {
    const date = new Date(releaseDate);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

function formatDateForInput(releaseDate) {
    const date = new Date(releaseDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getTop10() {
    fetch(`${apiUrl}${endpoint}/filter?year=${year}&limit=10`)
        .then(response => response.json())
        .then(data => {
            console.log('Top 10 data:', data);
            const top10List = document.getElementById('top10List');
            top10List.innerHTML = '';

            if (data.length === 0) {
                top10List.innerHTML = '<p>No entries available for this year.</p>';
                return;
            }

            data.forEach((entry, index) => {
                const formattedDate = formatReleaseDate(entry.releaseDate);

                top10List.innerHTML += `
                    <div class="card">
                        <h3>${index + 1}. ${entry.title}</h3>
                        <p><strong>Developer/Director:</strong> ${type === 'games' ? entry.developer : entry.director}</p>
                        <p><strong>Release Date:</strong> ${formattedDate}</p>
                        <p><strong>Personal Score:</strong> ${entry.personalScore}</p>
                        <button onclick="deleteEntry(${entry.id})">Delete</button>
                        <button onclick="openEditForm(${entry.id})">Edit</button>
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error(`Error fetching top 10 ${type}:`, error);
        });
}

function loadExtendedList() {
    fetch(`${apiUrl}${endpoint}/filter?year=${year}`)
        .then(response => response.json())
        .then(data => {
            console.log('Extended list data:', data);
            const extendedList = document.getElementById('fullList');
            extendedList.innerHTML = '';

            if (data.length === 0) {
                extendedList.innerHTML = '<p>No entries available for this year.</p>';
                return;
            }

            data.forEach(entry => {
                const formattedDate = formatReleaseDate(entry.releaseDate);

                extendedList.innerHTML += `
                    <div class="card">
                        <h3>${entry.title}</h3>
                        <p><strong>Developer/Director:</strong> ${type === 'games' ? entry.developer : entry.director}</p>
                        <p><strong>Release Date:</strong> ${formattedDate}</p>
                        <p><strong>Personal Score:</strong> ${entry.personalScore}</p>
                        <p><strong>Personal Thoughts:</strong> ${entry.personalThoughts}</p>
                    </div>
                `;
            });
            document.getElementById('extendedList').style.display = 'block';
        })
        .catch(error => {
            console.error(`Error fetching extended list for ${type}:`, error);
        });
}

function openEditForm(id) {
    fetch(`${apiUrl}${endpoint}/${id}`)
        .then(response => response.json())
        .then(data => {

            document.getElementById('title').value = data.title || '';
            document.getElementById('director').value = data.director || '';
            document.getElementById('developer').value = data.developer || '';
            document.getElementById('publisher').value = data.publisher || '';
            document.getElementById('releaseYear').value = data.releaseYear || '';
            document.getElementById('releaseDate').value = formatDateForInput(data.releaseDate) || '';
            document.getElementById('personalScore').value = data.personalScore || '';
            document.getElementById('personalThoughts').value = data.personalThoughts || '';

            document.getElementById('editFormContainer').style.display = 'block';

            const updateButton = document.getElementById('updateButton');
            updateButton.onclick = function () {
                updateEntry(id);
            };
        })
        .catch(error => console.error(`Error fetching ${type} for editing:`, error));
}

function updateEntry(id) {
    const updatedEntry = {
        title: document.getElementById('title').value,
        director: document.getElementById('director').value || undefined,
        developer: document.getElementById('developer').value || undefined,
        publisher: document.getElementById('publisher').value || undefined,
        releaseYear: parseInt(document.getElementById('releaseYear').value),
        releaseDate: document.getElementById('releaseDate').value,
        personalScore: parseFloat(document.getElementById('personalScore').value),
        personalThoughts: document.getElementById('personalThoughts').value
    };

    fetch(`${apiUrl}${endpoint}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedEntry)
    })
        .then(response => {
            if (response.ok) {
                alert('Entry updated successfully');
                document.getElementById('updateButton').style.display = 'none';
                getTop10();
            } else {
                return response.json().then(errorData => {
                    throw new Error(`Update failed: ${errorData.message}`);
                });
            }
        })
        .catch(error => console.error(`Error updating ${type}:`, error));
}

function deleteEntry(id) {
    fetch(`${apiUrl}${endpoint}/${id}`, {
        method: 'DELETE'
    })
        .then(() => {
            alert('Entry deleted successfully');
            getTop10();
        })
        .catch(error => console.error(`Error deleting ${type}:`, error));
}

document.addEventListener('DOMContentLoaded', getTop10);
