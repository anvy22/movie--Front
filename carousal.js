let currentIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;
const container = document.querySelector('.carousel-container');
let autoPlay;  // Declare autoplay globally for toggling

// Clone the first slide and append it to the end of the container
const firstSlideClone = slides[0].cloneNode(true);
container.appendChild(firstSlideClone);

// Function to show the next slide (move to the right)
function showNextSlide() {
    currentIndex++;
    const offset = -currentIndex * 100;
    container.style.transform = `translateX(${offset}%)`;

    // If we're on the last real slide, after the animation, reset to the first slide without animation
    if (currentIndex === totalSlides) {
        setTimeout(() => {
            container.style.transition = 'none'; // Disable transition temporarily
            currentIndex = 0; // Reset to the original first slide
            container.style.transform = `translateX(0)`;
            setTimeout(() => {
                container.style.transition = 'transform 0.5s ease-in-out'; // Re-enable transition
            }, 50); // Small delay to avoid glitching
        }, 500); // Wait for the slide transition to complete
    }
}

// Function to start autoplay
function startAutoplay() {
    autoPlay = setInterval(showNextSlide, 3000); // Autoplay every 3 seconds
}

// Start autoplay initially
startAutoplay();

// Toggle autoplay on click
let isPlaying = true;
document.querySelector('.carousel').addEventListener('click', () => {
    if (isPlaying) {
        clearInterval(autoPlay); // Stop autoplay
    } else {
        startAutoplay(); // Resume autoplay
    }
    isPlaying = !isPlaying; // Toggle the state
});
    