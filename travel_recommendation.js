// Global variable to store travel data
let travelData = [];

// Fetch data from JSON file
function fetchTravelData() {
    fetch('travel_recommendation.JSON')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            travelData = data;
            console.log('Travel Data Fetched Successfully:', travelData);
            console.log('Countries:', travelData.countries);
            
            // Display all available countries and cities on page load
            displayAllRecommendations();
        })
        .catch(error => {
            console.error('Error fetching travel data:', error);
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '<p style="color: red; text-align: center;">Error loading travel data. Please refresh the page.</p>';
        });
}

// Display all recommendations
function displayAllRecommendations() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    
    let html = '<div class="recommendations-container">';
    
    travelData.countries.forEach(country => {
        console.log(`Country: ${country.name}`);
        html += `<h3 class="country-title">${country.name}</h3>`;
        html += '<div class="cities-grid">';
        
        country.cities.forEach(city => {
            console.log(`  City: ${city.name}, Image: ${city.imageUrl}, Description: ${city.description}`);
            
            html += `
                <div class="city-card">
                    <img src="img/${city.imageUrl}" alt="${city.name}" class="city-image" onerror="this.src='img/homepage_background.jpg'">
                    <div class="city-info">
                        <h4 class="city-name">${city.name}</h4>
                        <p class="city-description">${city.description}</p>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    });
    
    html += '</div>';
    resultsDiv.innerHTML = html;
}

// Search functionality
function searchRecommendations() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (searchInput === '') {
        console.log('Search term is empty');
        alert('Please enter a search term');
        return;
    }
    
    console.log(`Searching for: ${searchInput}`);
    
    let results = [];
    
    // Search in temples
    if (searchInput.includes('temple')) {
        console.log('Searching in temples category');
        if (travelData.temples) {
            travelData.temples.forEach(temple => {
                results.push({
                    name: temple.name,
                    imageUrl: temple.imageUrl,
                    description: temple.description,
                    category: 'Temple'
                });
            });
        }
    }
    
    // Search in beaches
    if (searchInput.includes('beach')) {
        console.log('Searching in beaches category');
        if (travelData.beaches) {
            travelData.beaches.forEach(beach => {
                results.push({
                    name: beach.name,
                    imageUrl: beach.imageUrl,
                    description: beach.description,
                    category: 'Beach'
                });
            });
        }
    }
    
    // Search in countries/cities
    if (!searchInput.includes('temple') && !searchInput.includes('beach')) {
        console.log('Searching in countries/cities category');
        travelData.countries.forEach(country => {
            country.cities.forEach(city => {
                if (
                    city.name.toLowerCase().includes(searchInput) ||
                    country.name.toLowerCase().includes(searchInput) ||
                    city.description.toLowerCase().includes(searchInput)
                ) {
                    results.push({
                        name: city.name,
                        imageUrl: city.imageUrl,
                        description: city.description,
                        category: 'City',
                        country: country.name
                    });
                }
            });
        });
    }
    
    console.log('Search Results:', results);
    displaySearchResults(results, searchInput);
}

// Display search results in overlay
function displaySearchResults(results, searchTerm) {
    if (results.length === 0) {
        alert(`No results found for "${searchTerm}". Try searching for different keywords.`);
        console.log('No matching results found');
        return;
    }
    
    console.log('Displaying search results in overlay');
    
    let html = `
        <div class="overlay-header">
            <h2>Search Results for "${searchTerm}"</h2>
            <p className="result-count">Found ${results.length} destination(s)</p>
            <button class="close-overlay-btn">&times;</button>
        </div>
        <div class="overlay-content">
            <div class="cities-grid">
    `;
    
    results.forEach(result => {
        let displayName = result.name || result.city;
        let categoryTag = result.category ? `<p class="result-category">${result.category}</p>` : '';
        let countryInfo = result.country ? `<p class="city-country">${result.country}</p>` : '';
        
        html += `
            <div class="city-card">
                <img src="img/${result.imageUrl}" alt="${displayName}" class="city-image" onerror="this.src='img/homepage_background.jpg'">
                <div class="city-info">
                    <h4 class="city-name">${displayName}</h4>
                    ${categoryTag}
                    ${countryInfo}
                    <p class="city-description">${result.description}</p>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    const overlay = document.getElementById('searchOverlay');
    overlay.innerHTML = html;
    overlay.style.display = 'flex';
    
    // Add close button event listener
    const closeBtn = overlay.querySelector('.close-overlay-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSearchOverlay);
    }
    
    // Close overlay when clicking outside the content
    overlay.addEventListener('click', function(event) {
        if (event.target === overlay) {
            closeSearchOverlay();
        }
    });
    
    // Close overlay with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeSearchOverlay();
        }
    });
}

// Close search overlay
function closeSearchOverlay() {
    const overlay = document.getElementById('searchOverlay');
    overlay.style.display = 'none';
    overlay.innerHTML = '';
}

// Reset search
function resetSearch() {
    console.log('Resetting search');
    document.getElementById('searchInput').value = '';
    closeSearchOverlay();
    displayAllRecommendations();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, fetching travel data...');
    
    // Fetch travel data on page load
    fetchTravelData();
    
    // Search button event listener
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchRecommendations);
    }
    
    // Reset button event listener
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetSearch);
    }
    
    // Allow Enter key to search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                searchRecommendations();
            }
        });
    }
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMessage').value;
            
            console.log('Contact Form Submitted:', { name, email, message });
            
            const formResponse = document.getElementById('formResponse');
            formResponse.innerHTML = `
                <div style="background-color: #d4edda; color: #155724; padding: 1rem; border-radius: 5px; border: 1px solid #c3e6cb;">
                    <strong>Thank you, ${name}!</strong><br>
                    Your message has been received. We'll get back to you at ${email} soon!
                </div>
            `;
            
            // Reset form
            contactForm.reset();
            
            // Clear message after 5 seconds
            setTimeout(() => {
                formResponse.innerHTML = '';
            }, 5000);
        });
    }
});
