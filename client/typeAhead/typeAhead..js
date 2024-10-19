let suggestionsElement = document.getElementById('suggestions');
let searchInputElement = document.getElementById('search-input');
let query = '';
let page = 0;
const limit = 10;
let isFetching = false;
let allLoaded = false;

let largeDataset = [];

// Fetch the JSON data
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    largeDataset = data;
    console.log('Dataset loaded:', largeDataset.length);
  })
  .catch(error => console.error('Error loading JSON:', error));

// Function to simulate fetching suggestions from a backend or database
function fetchSuggestions(query, page, limit) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const filtered = largeDataset
  .filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
  .map(item =>item.name);
  console.log(filtered);
  

            const startIndex = page * limit;
            const endIndex = startIndex + limit;
            const paginated = filtered.slice(startIndex, endIndex);
            resolve(paginated);
        }, 500);
    });
}

// Function to render suggestions in the DOM
function renderSuggestions(suggestions) {
    if (suggestions.length < limit) {
        allLoaded = true;
    }
    suggestions.forEach(suggestion => {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'suggestion';
        suggestionDiv.textContent = suggestion;
        suggestionsElement.appendChild(suggestionDiv);
    });
}

// Function to handle user input (debounced)
function onSearchInput(event) {
    const newQuery = event.target.value.trim();

    if (newQuery !== query) {
        query = newQuery;
        page = 0;
        allLoaded = false;
        suggestionsElement.innerHTML = ''; // Clear previous suggestions
        fetchNewSuggestions();
    }
}

// Fetch new suggestions based on the search query and current page
function fetchNewSuggestions() {
    if (query && !isFetching && !allLoaded) {
        isFetching = true;
        fetchSuggestions(query, page, limit).then(suggestions => {
            renderSuggestions(suggestions);
            isFetching = false;
        });
    }
}

function onScroll(event) {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 5 && !isFetching && !allLoaded) {
        page++;
        fetchNewSuggestions();
    }
}

// Attach event listeners
searchInputElement.addEventListener('input', debounce(onSearchInput, 3000));
suggestionsElement.addEventListener('scroll', onScroll);

// Debounce function to limit how often we call the API when typing
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}
