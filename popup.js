async function searchMovie() {
    const searchTerm = document.getElementById('search-movie').value;
    
    const response = await fetch('https://movieb-tmxl.onrender.com/search-movie', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieName: searchTerm }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error: ${response.status} - ${errorText}`);
        return;
    }

    const movieDataArray = await response.json();
    document.getElementById('search-results').innerHTML = '';
    movieDataArray.forEach(movie => displayMovieCard(movie));
}

function displayMovieCard(movie) {
    const result = document.createElement('div');
    result.classList.add('movie-card');
    result.innerHTML = `
        <img src="${movie.poster}" alt="Movie Poster">
        <h3>${movie.title}</h3>
        <p>Release Year: ${movie.releaseYear}</p>
        <p>Actors: ${movie.actors.join(', ')}</p>
        <button onclick="showRatingCard('${movie.id}', '${movie.title}', '${movie.poster}', '${movie.releaseYear}', ${JSON.stringify(movie.actors)})">Rate</button>
    `;
    document.getElementById('search-results').appendChild(result);
}

function showRatingCard(movieId, title, poster, releaseYear, actors) {
    const modal = document.getElementById('rating-modal');
    const modalTitle = document.getElementById('modal-movie-title');
    const modalPoster = document.getElementById('modal-movie-poster');
    
    modalTitle.textContent = title;
    modalPoster.src = poster;

    // Reset rating stars and review
    const ratingStars = document.getElementById('rating-stars');
    ratingStars.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.innerHTML = '★';
        star.dataset.value = i;
        star.addEventListener('click', function() {
            setRating(i);
        });
        ratingStars.appendChild(star);
    }

    // Show the modal
    modal.style.display = "block";
}

function setRating(rating) {
    const stars = document.querySelectorAll('#rating-stars span');
    stars.forEach(star => {
        if (parseInt(star.dataset.value) <= rating) {
            star.style.color = "gold";
        } else {
            star.style.color = "gray";
        }
    });

    // Enable the save button if there's a rating and review
    checkSaveButton();
}

function enhanceReview() {
    const reviewText = document.getElementById('review-text').value;
    const rating = document.querySelector('#rating-stars span[style="color: gold"]');

    if (!reviewText || !rating) {
        alert("Please provide both a review and a rating before saving.");
        return;
    }

    // Enable the save button
    document.getElementById('save-button').style.display = "block";
}

function saveReview() {
    const reviewText = document.getElementById('review-text').value;
    const rating = document.querySelector('#rating-stars span[style="color: gold"]');

    if (!reviewText || !rating) {
        alert("Please provide both a review and a rating before saving.");
        return;
    }

    const ratingValue = rating.dataset.value;
    console.log(`Review: ${reviewText}, Rating: ${ratingValue}`);

    // You can then save the review and rating to the backend here
    // For now, just close the modal
    closeRatingModal();
}

function closeRatingModal() {
    const modal = document.getElementById('rating-modal');
    modal.style.display = "none";
}

function checkSaveButton() {
    const reviewText = document.getElementById('review-text').value;
    const rating = document.querySelector('#rating-stars span[style="color: gold"]');
    const saveButton = document.getElementById('save-button');
    
    if (reviewText && rating) {
        saveButton.style.display = "block";
    } else {
        saveButton.style.display = "none";
    }
}
