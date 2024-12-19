document.addEventListener("DOMContentLoaded", function() {
   
    document.querySelector('.loader').style.display = 'none';
  });

const homeButton = document.getElementById("home");

  
  if (homeButton) {
    
    homeButton.addEventListener("click", function() {
      
        window.location.replace("home.html");
    });
  } else {
    console.error("Button with ID 'home' not found!");
  }

  const input = document.getElementById('input');
  const searchIcon = document.querySelector('.labelforsearch');
  const micButton = document.querySelector('.micButton');
  
  
  
  
  searchIcon.addEventListener('click', () => { 

      

      searchMovie()
      document.querySelector('.loader').style.display = 'block';
      
     
  });
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    // Create a new speech recognition instance
    const recognition = new SpeechRecognition();

    // Set some properties
    recognition.lang = 'en-US';  // Language for recognition (e.g., US English)
    recognition.interimResults = false;  // Only return final results
    recognition.maxAlternatives = 1;  // Limit to one result

    // Event handler for microphone button click
    micButton.addEventListener('click', () => {
        console.log('Microphone button clicked.');

        // Start speech recognition
        recognition.start();
        console.log('Speech recognition started');
    });

    // When speech is recognized, show it in the output span
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        // Display the recognized text
        console.log(`Recognized: ${transcript}`);
        searchMovie(transcript);
    };

    // Error handler for speech recognition
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };

} else {
    // If the browser doesn't support SpeechRecognition
    alert("Sorry, your browser doesn't support the Web Speech API.");
}
 
 

async function searchMovie(voice) {
    const searchTerm = document.getElementById('search-movie').value||voice;
    document.getElementById('search-movie').value = voice;
    console.log(searchTerm);
    
    // Send search term to backend
    const response = await fetch('https://movieb-tmxl.onrender.com/search-movie', {  // Updated URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieName: searchTerm }),
    });

    // Check for a successful response
    if (!response.ok) {
        document.querySelector('.loader').style.display = 'none';
        const errorText = await response.text();  // Get the response text in case of an error
        console.error(`Error: ${response.status} - ${errorText}`);
        return;  // Exit the function if the response was not OK
    }

    const movieDataArray = await response.json();
    
    // Clear previous search results
    document.getElementById('search-results').innerHTML = '';

    // Display multiple movie cards
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
        <button onclick="showRatingCard('${movie.id}', '${movie.title}', '${movie.poster}', '${movie.releaseYear}', '${movie.actors.join(', ')}')">Rate</button>
        <button onclick="showWatchList('${movie.id}', '${movie.title}', '${movie.poster}', '${movie.releaseYear}')">Add To WatchList</button>
    `;
    document.getElementById('search-results').appendChild(result);
}



function showRatingCard(movieid, title, poster, releaseyear, actors) {
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

    // Initially hide the Save button
    const saveButton = result.querySelector("#saveBtn");
    saveButton.style.display = "none";

    // Add event listeners to monitor the review and rating inputs
    const reviewInput = result.querySelector("#review");
    const ratingInputs = result.querySelectorAll('input[name="rating"]');

    // Function to check if both review and rating are filled
    function checkInputs() {
        const review = reviewInput.value.trim();
        const rating = Array.from(ratingInputs).some(radio => radio.checked);
        if (review && rating) {
            saveButton.style.display = "inline-block"; // Show Save button
        } else {
            saveButton.style.display = "none"; // Hide Save button
        }
    }

    // Event listeners for review input and rating selection
    reviewInput.addEventListener("input", checkInputs);
    ratingInputs.forEach(input => {
        input.addEventListener("change", checkInputs);
    });

    // Append the result to the body
    document.body.appendChild(result);
    console.log("this is userid:",)
}




function cancelPopup() {
    const popup = document.querySelector('.popup');
    if (popup) {
        popup.remove();
    }
}


async function pushData(movieid, title, poster, releaseyear, actors) {
    const review = document.getElementById('review').value.trim(); // Get review from textarea
    const rating = document.querySelector('input[name="rating"]:checked')?.value; // Get rating from checked radio
    console.log(review,rating);
    const userid = localStorage.getItem('userid');
    console.log(userid);
    if (!review || !rating) {
        alert("Please provide both a review and rating!");
        return;
    }

    // Prepare the data to be sent to the backend
    const movieData = {
        movieid: movieid,
        title: title,
        poster: poster,
        releaseyear: releaseyear,
        actors: actors,
        review: review,
        rating: rating,
        userid: userid
    };

    try {
        // Make the POST request to the backend using await
        const response = await fetch('https://movieb-tmxl.onrender.com/rate-movie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movieData) // Send the movie data as a JSON string
        });

        const data = await response.json(); // Wait for the response and parse it as JSON

        if (response.ok) {
            console.log("Movie data saved:", data);
           
            cancelPopup(); // Close the popup after saving
        } else {
            throw new Error(data.message || "Failed to save the review.");
        }
    } catch (error) {
        console.error("Error saving movie data:", error);
        alert("Failed to save the review.");
         
    }
}

async function showWatchList(movieid,title,poster, releaseYear)
{

     const userid = localStorage.getItem('userid');
      const watchData = {
        movieid: movieid,
        title:title,
        poster:poster,
        releaseYear:releaseYear,
        userid:userid

      };


    try {
        // Make the POST request to the backend using await
        const response = await fetch('https://movieb-tmxl.onrender.com/watchlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(watchData) // Send the movie data as a JSON string
        });

        const data = await response.json(); // Wait for the response and parse it as JSON

        if (response.ok) {
            console.log("watchlist data saved:", data);
           
            cancelPopup(); // Close the popup after saving
        } else {
            throw new Error(data.message || "Failed adding to watchlist");
        }
    } catch (error) {
        console.error("Error adding to watchlist", error);
        alert("Failed adding to watchlist");
         
    }


}