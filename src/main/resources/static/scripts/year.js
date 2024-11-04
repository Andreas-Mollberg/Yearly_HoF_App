const apiUrl = 'http://localhost:8080/api/';

const urlParams = new URLSearchParams(window.location.search);
const year = urlParams.get('year');
const type = urlParams.get('type');

const endpoint = type === 'games' ? 'games' : 'movies';

document.getElementById('yearTitle').textContent = year;

function getTop10() {
    fetch(`${apiUrl}${endpoint}/filter?year=${year}&limit=10`)
        .then(response => response.json())
        .then(data => {
            const topListContainer = document.getElementById('topListContainer');
            topListContainer.innerHTML = '';

            if (data.length === 0) {
                topListContainer.innerHTML = '<p>No entries available for this year.</p>';
                return;
            }

            let tableHtml = `
                <table class="top-list-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Title</th>
                            <th>Score</th>
                            <th>${type === 'games' ? 'Developer' : 'Director'}</th>
                            <th>Release Year</th>
                            <th>Details</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            data.sort((a, b) => b.personalScore - a.personalScore).forEach((entry, index) => {
                tableHtml += `
                    <tr data-id="${entry.id}">
                        <td class="entry-td rank" data-label="Rank">${index + 1}</td>
                        <td class="entry-td title" data-label="Title">${entry.title}</td>
                        <td class="entry-td score" data-label="Score">${entry.personalScore}</td>
                        <td class="entry-td developer-director" data-label="${type === 'games' ? 'Developer' : 'Director'}">${type === 'games' ? entry.developer : entry.director}</td>
                        <td class="entry-td release-year" data-label="Release Year">${entry.releaseYear}</td>
                        <td class="entry-td details" data-label="Details"><span class="toggle-details" onclick="toggleDetails(${index})">View Details</span></td>
                        <td class="entry-td actions" data-label="Actions">
                            <button class="edit-btn">Edit</button>
                            <button class="delete-btn">Delete</button>
                        </td>
                    </tr>
                    <tr id="details-${index}" class="entry-details">
                        <td colspan="7">
                            <strong>Personal Thoughts:</strong> ${entry.personalThoughts}
                        </td>
                    </tr>
                `;
            });

            tableHtml += '</tbody></table>';
            topListContainer.innerHTML = tableHtml;
        })
        .catch(error => {
            console.error(`Error fetching top 10 ${type}:`, error);
        });
}

function toggleDetails(index) {
    const detailsRow = document.getElementById(`details-${index}`);
    if (detailsRow.style.display === 'none' || detailsRow.style.display === '') {
        detailsRow.style.display = 'table-row';
    } else {
        detailsRow.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    getTop10();

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('edit-btn')) {
            const row = event.target.closest('tr');
            const id = row.dataset.id;
            const title = row.querySelector('.title').innerText;
            const year = row.querySelector('.release-year').innerText;
            const score = row.querySelector('.score').innerText;
            const details = row.nextElementSibling.querySelector('td').innerText.split(': ')[1];
            const developer = row.querySelector('.developer-director').innerText;
            const publisher = row.querySelector('.publisher') ? row.querySelector('.publisher').innerText : '';
            const releaseDate = row.querySelector('.release-date') ? row.querySelector('.release-date').innerText : '';
            openEditForm(id, title, year, score, details, developer, publisher, releaseDate);
        }

        if (event.target.classList.contains('delete-btn')) {
            const row = event.target.closest('tr');
            const id = row.dataset.id;
            const title = row.querySelector('.title').innerText;
            if (confirm(`Are you sure you want to delete ${title}?`)) {
                deleteEntry(id);
            }
        }
    });
});

function openEditForm(id, title, year, score, details, developer, publisher, releaseDate) {
    // Convert releaseDate to dd/mm/yyyy format for display
    let displayReleaseDate;
    if (isNaN(Date.parse(releaseDate))) {
        displayReleaseDate = '';
    } else {
        const date = new Date(releaseDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        displayReleaseDate = `${day}/${month}/${year}`;
    }

    const editFormHtml = `
        <form id="editForm">
            <label for="editTitle">Title:</label>
            <input type="text" id="editTitle" value="${title}" required>
            <label for="editYear">Release Year:</label>
            <input type="number" id="editYear" value="${year}" required>
            <label for="editScore">Score:</label>
            <input type="number" step="0.1" id="editScore" value="${score}" required>
            <label for="editDetails">Details:</label>
            <textarea id="editDetails" required>${details}</textarea>
            <label for="editDeveloper">Developer:</label>
            <input type="text" id="editDeveloper" value="${developer}" required>
            <label for="editPublisher">Publisher:</label>
            <input type="text" id="editPublisher" value="${publisher}" required>
            <label for="editReleaseDate">Release Date:</label>
            <input type="text" id="editReleaseDate" value="${displayReleaseDate}" required>
            <button type="submit">Save</button>
            <button type="button" onclick="closeEditForm()">Cancel</button>
        </form>
    `;
    const editFormContainer = document.createElement('div');
    editFormContainer.id = 'editFormContainer';
    editFormContainer.innerHTML = editFormHtml;
    document.body.appendChild(editFormContainer);

    document.getElementById('editForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const updatedTitle = document.getElementById('editTitle').value;
        const updatedYear = document.getElementById('editYear').value;
        const updatedScore = document.getElementById('editScore').value;
        const updatedDetails = document.getElementById('editDetails').value;
        const updatedDeveloper = document.getElementById('editDeveloper').value;
        const updatedPublisher = document.getElementById('editPublisher').value;
        const updatedReleaseDate = document.getElementById('editReleaseDate').value;

        // Convert updatedReleaseDate to yyyy-MM-dd format before sending the request
        const [day, month, year] = updatedReleaseDate.split('/');
        const formattedReleaseDate = `${year}-${month}-${day}`;

        updateEntry(id, updatedTitle, updatedYear, updatedScore, updatedDetails, updatedDeveloper, updatedPublisher, formattedReleaseDate);
    });
}

function closeEditForm() {
    const editFormContainer = document.getElementById('editFormContainer');
    if (editFormContainer) {
        document.body.removeChild(editFormContainer);
    }
}

function updateEntry(id, title, year, score, details, developer, publisher, releaseDate) {
    const updatedEntry = {
        title: title,
        releaseYear: year,
        personalScore: score,
        personalThoughts: details,
        developer: developer,
        publisher: publisher,
        releaseDate: releaseDate
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
                location.reload();
            } else {
                alert('Failed to update entry');
            }
        });
}

function deleteEntry(id) {
    fetch(`${apiUrl}${endpoint}/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                location.reload();
            } else {
                alert('Failed to delete entry');
            }
        });
}

function loadExtendedList() {
    const extendedList = document.getElementById('extendedList');
    const button = document.querySelector('.button');

    if (extendedList.style.display === 'none' || extendedList.style.display === '') {
        fetch(`${apiUrl}${endpoint}/filter?year=${year}`)
            .then(response => response.json())
            .then(data => {
                const fullList = document.getElementById('fullList');
                fullList.innerHTML = '';

                if (data.length === 0) {
                    fullList.innerHTML = '<p>No entries available for this year.</p>';
                    return;
                }

                data.sort((a, b) => b.personalScore - a.personalScore).forEach(entry => {
                    fullList.innerHTML += `
                        <div class="card" data-id="${entry.id}">
                            <h3>${entry.title}</h3>
                            <p><strong>${type === 'games' ? 'Developer' : 'Director'}:</strong> ${type === 'games' ? entry.developer : entry.director}</p>
                            <p><strong>Release Year:</strong> ${entry.releaseYear}</p>
                            <p><strong>Personal Score:</strong> ${entry.personalScore}</p>
                            <p><strong>Personal Thoughts:</strong> ${entry.personalThoughts}</p>
                            <button class="edit-btn">Edit</button>
                            <button class="delete-btn">Delete</button>
                        </div>
                    `;
                });
                extendedList.style.display = 'block';
                button.textContent = 'Hide Full List';
            })
            .catch(error => {
                console.error(`Error fetching extended list for ${type}:`, error);
            });
    } else {
        extendedList.style.display = 'none';
        button.textContent = 'View Full List';
    }
}