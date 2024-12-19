document.addEventListener("DOMContentLoaded", function() {
    // Call your API here
    fetchData();
});

async function fetchData() {

    const userid = localStorage.getItem('userid');

    try {
        const response = await fetch('https://movieb-tmxl.onrender.com/watchlistShow',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userid })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error: ${response.status} - ${errorText}`);
            return;
        }

        const data = await response.json();
        console.log("this id  gotten data",data);
        const movieList = document.getElementById('movie-list');

        if (movieList) {
            movieList.innerHTML = '';

            data.forEach(element => {
                display(element, movieList);
            });
        } else {
            console.error('Element with ID "watch-list" not found.');
        }

    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}

function display(movie, movieList) {
    
    console.log("this id  gotten data",movie);
    const result = document.createElement('div');
    result.classList.add('movie-card');
    result.innerHTML = `
        <img src="${movie.poster}" alt="Movie Poster">
        <h3>${movie.title}</h3>
        <p>Release Year: ${movie.releaseYear}</p>
        <button onclick="removeWatchList('${movie.id}')">Remove</button>
    `;

    movieList.appendChild(result); // Append the created movie card to the list
}

async function removeWatchList(movieid) {
    try {
        const response = await fetch('https://movieb-tmxl.onrender.com/deleteWatchList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ movieid })
        });

        const data = await response.json();
        console.log("this is data:", data);

        if (response.ok) {
           
            location.reload();  // Reload the page after successful deletion
        } else {
            alert(data.message || 'Removing failed');
        }
    } catch (error) {
        console.error('Error during removing:', error);
        alert('Something went wrong! Please try again.');
    }
}
