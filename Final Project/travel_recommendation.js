document.getElementById('btnSearch').addEventListener('click', performSearch);
document.getElementById('btnClear').addEventListener('click', clearResults);

function performSearch() {
    const input = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; // Clear previous lookups

    if (!input) return;

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            let matches = [];

            // Match structural variants of keywords explicitly
            if (input.includes('beach')) {
                matches = data.beaches;
            } else if (input.includes('temple')) {
                matches = data.temples;
            } else if (input.includes('country') || input.includes('countr')) {
                // Return cities for the first country found to fulfill the 2-item minimum rule
                if (data.countries.length > 0) {
                    matches = data.countries[0].cities;
                }
            }

            if (matches.length > 0) {
                displayResults(matches);
            } else {
                resultsContainer.innerHTML = '<p class="error-msg">No recommendations found. Try "beach", "temple", or "country".</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching travel data:', error);
            resultsContainer.innerHTML = '<p class="error-msg">Error loading recommendations.</p>';
        });
}

function displayResults(items) {
    const resultsContainer = document.getElementById('resultsContainer');
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'result-card';
        
        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
        `;
        resultsContainer.appendChild(card);
    });
}

function clearResults() {
    document.getElementById('searchInput').value = '';
    document.getElementById('resultsContainer').innerHTML = '';
}