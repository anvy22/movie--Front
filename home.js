document.addEventListener("DOMContentLoaded", function() {
  // Call your API here
  fetchData();
});


const button = document.querySelector('.Btn');

button.addEventListener('click', () => {
    console.log('Button clicked!');
    window.location.replace("index.html");

});


async function fetchData() {
  try {
      const response = await fetch('https://movieb-tmxl.onrender.com/home');

      if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error: ${response.status} - ${errorText}`);
          return;
      }

      const data = await response.json();
      const movieList = document.getElementById('movie-list');

      if (movieList) {
          movieList.innerHTML = '';

          data.forEach(element => {
              display(element);
          });
      } else {
          console.error('Element with ID "movie-list" not found.');
      }

  } catch (error) {
      console.error('Failed to fetch data:', error);
  }
}

function display(movie) {
  
  const result = document.createElement('div');
  result.classList.add('movie-card');
  result.innerHTML = `
      <img src="${movie.poster}" alt="Movie Poster">
      <h3>${movie.title}</h3>
      <p>Release Year: ${movie.release_date}</p>
      <p>Actors: ${movie.actors.join(', ')}</p>
      <p>Rating: ${movie.average_rating}★</p>
  `;

  // Create the button programmatically
  const viewReviewButton = document.createElement('button');
  viewReviewButton.textContent = 'View Review';
  viewReviewButton.addEventListener('click', () => ViewReview(movie));  // Add event listener with the actual movie object

  result.appendChild(viewReviewButton);
  document.getElementById('movie-list').appendChild(result);
}

async function ViewReview(movie) {
  console.log(movie);
  let movieid = movie.movie_id;
  console.log(movieid);
    // Assuming movie object contains movie_id
  const response = await fetch('https://movieb-tmxl.onrender.com/showReview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ movieid: movieid }),  // Pass the movie title or ID
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Error: ${response.status} - ${errorText}`);
    return;
  }

  const reviewdata = await response.json();
  const commentsContainer = document.getElementById('comments-container');
  const reviewPopup = document.getElementById('review-popup');

  // Clear any existing reviews before injecting new ones
  commentsContainer.innerHTML = '';

  // Display each review dynamically
  reviewdata.forEach(review => displayReview(review, commentsContainer));

  // Show the popup by toggling the 'hidden' and 'active' classes
  reviewPopup.style.display = 'block';
}

function displayReview(review, container) {
  const reviewElement = document.createElement('div');
  reviewElement.classList.add('comment-container');

  reviewElement.innerHTML = `
    <div class="user">
      <div class="user-pic">
        <svg fill="none" viewBox="0 0 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linejoin="round" fill="#707277" stroke-linecap="round" stroke-width="2" stroke="#707277" d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z"></path>
          <path stroke-width="2" fill="#707277" stroke="#707277" d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z"></path>
        </svg>
      </div>
      <div class="user-info">
        <span>${review.username}</span>
        <p>${new Date(review.timestamp).toLocaleString()}</p>
      </div>
    </div>
    <p class="comment-content">
      ${review.comment}
    </p>
  `;

  container.appendChild(reviewElement);
}

// Function to close the popup
document.getElementById('close-popup').addEventListener('click', () => {
  const reviewPopup = document.getElementById('review-popup');
  reviewPopup.style.display = 'none';

});
