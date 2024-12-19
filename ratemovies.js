document.addEventListener("DOMContentLoaded", function () {
    const loader = document.querySelector('.loader');
    if (loader) loader.style.display = 'none';
});

const homeButton = document.getElementById("home");
if (homeButton) {
    homeButton.addEventListener("click", function () {
        window.location.replace("home.html");
    });
} else {
    console.error("Button with ID 'home' not found!");
}

const input = document.getElementById('input');
const searchIcon = document.querySelector('.labelforsearch');
const micButton = document.querySelector('.micButton');

if (searchIcon) {
    searchIcon.addEventListener('click', () => {
        searchMovie();
        const loader = document.querySelector('.loader');
        if (loader) loader.style.display = 'block';
    });
} else {
    console.error("Element with class 'labelforsearch' not found!");
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition && micButton) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    micButton.addEventListener('click', () => {
        console.log('Microphone button clicked.');
        recognition.start();
        console.log('Speech recognition started');
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log(`Recognized: ${transcript}`);
        searchMovie(transcript);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };
} else if (!SpeechRecognition) {
    alert("Sorry, your browser doesn't support the Web Speech API.");
}

async function searchMovie(voice) {
    const inputElement = document.getElementById('search-movie');
    const searchTerm = inputElement?.value || voice;

    if (!searchTerm) {
        alert("Please enter a search term.");
        return;
    }

    if (voice) inputElement.value = voice; // Update input field with voice input

    try {
        const response = await fetch('https://movieb-tmxl.onrender.com/search-movie', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ movieName: searchTerm }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Error: ${response.status}`);
        }

        const movieDataArray = await response.json();
        const searchResults = document.getElementById('search-results');
        if (searchResults) searchResults.innerHTML = ''; // Clear previous results

        movieDataArray.forEach(movie => displayMovieCard(movie));
    } catch (error) {
        console.error("Error fetching movies:", error);
        alert("Failed to fetch movies. Please try again.");
    } finally {
        const loader = document.querySelector('.loader');
        if (loader) loader.style.display = 'none';
    }
}

function displayMovieCard(movie) {
    const result = document.createElement('div');
    result.classList.add('movie-card');
    result.innerHTML = `
        <img src="${movie.poster}" alt="Movie Poster">
        <h3>${movie.title}</h3>
        <p>Release Year: ${movie.releaseYear}</p>
        <p>Actors: ${movie.actors ? movie.actors.join(', ') : 'No cast information available'}</p>
        <button onclick="showRatingCard('${movie.id}', '${movie.title}', '${movie.poster}', '${movie.releaseYear}', '${movie.actors ? movie.actors.join(', ') : ''}')">Rate</button>
        <button onclick="showWatchList('${movie.id}', '${movie.title}', '${movie.poster}', '${movie.releaseYear}')">Add To WatchList</button>
    `;
    document.getElementById('search-results').appendChild(result);
}

function showRatingCard(movieid, title, poster, releaseyear, actors) {
    if (document.querySelector('.popup')) {
        document.querySelector('.popup').remove();
    }

    const result = document.createElement('div');
    result.classList.add('popup');
    result.innerHTML = `
        <img src="${poster}" alt="Movie Poster">
        <h7>${title}</h7>
        <p>Release Year: ${releaseyear}</p>
        <p>Actors: ${actors}</p>
        <textarea id="review" placeholder="Write your review here"></textarea> 
        <div class="rating">
             <input type="radio" id="star5" name="rating" value="5" />
             <label for="star5"></label>
             <input type="radio" id="star4" name="rating" value="4" />
             <label for="star4"></label>
             <input type="radio" id="star3" name="rating" value="3" />
             <label for="star3"></label>
             <input type="radio" id="star2" name="rating" value="2" />
             <label for="star2"></label>
             <input type="radio" id="star1" name="rating" value="1" />
             <label for="star1"></label>
        </div>
        <div class="btn">
            <button onclick="cancelPopup()">Cancel</button>
            <button id="saveBtn" onclick="pushData('${movieid}', '${title}', '${poster}', '${releaseyear}', '${actors}')">Save</button>
        </div>
    `;

    const saveButton = result.querySelector("#saveBtn");
    saveButton.style.display = "none";

    const reviewInput = result.querySelector("#review");
    const ratingInputs = result.querySelectorAll('input[name="rating"]');

    function checkInputs() {
        const review = reviewInput.value.trim();
        const rating = Array.from(ratingInputs).some(radio => radio.checked);
        if (review && rating) {
            saveButton.style.display = "inline-block";
        } else {
            saveButton.style.display = "none";
        }
    }

    reviewInput.addEventListener("input", checkInputs);
    ratingInputs.forEach(input => input.addEventListener("change", checkInputs));

    document.body.appendChild(result);
}

function cancelPopup() {
    const popup = document.querySelector('.popup');
    if (popup) popup.remove();
}

async function pushData(movieid, title, poster, releaseyear, actors) {
    const review = document.getElementById('review').value.trim();
    const rating = document.querySelector('input[name="rating"]:checked')?.value;
    const userid = localStorage.getItem('userid');

    if (!userid) {
        alert("User is not logged in. Please log in to continue.");
        return;
    }

    if (!review || !rating) {
        alert("Please provide both a review and rating!");
        return;
    }

    const movieData = { movieid, title, poster, releaseyear, actors, review, rating, userid };

    try {
        const response = await fetch('https://movieb-tmxl.onrender.com/rate-movie', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(movieData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const data = await response.json();
        console.log("Movie data saved:", data);
        cancelPopup();
    } catch (error) {
        console.error("Error saving movie data:", error);
        alert("Failed to save the review.");
    }
}

async function showWatchList(movieid, title, poster, releaseYear) {
    const userid = localStorage.getItem('userid');

    if (!userid) {
        alert("User is not logged in. Please log in to continue.");
        return;
    }

    const watchData = { movieid, title, poster, releaseYear, userid };

    try {
        const response = await fetch('https://movieb-tmxl.onrender.com/watchlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(watchData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const data = await response.json();
        console.log("Watchlist data saved:", data);
    } catch (error) {
        console.error("Error adding to watchlist", error);
        alert("Failed to add to watchlist.");
    }
}
