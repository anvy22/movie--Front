document.addEventListener('DOMContentLoaded', () => {
    // Email and password constraints
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;  // Regex to ensure email ends with @gmail.com
    const passwordPattern = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;  // At least 8 characters with one special character

    // Signup form submission handler
    document.querySelector('.sign-up-container form').addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Get values from form inputs
        const name = document.querySelector('input[name="name"]').value;
        const email = document.querySelector('input[name="email"]').value;
        const password = document.querySelector('input[name="password"]').value;

        // Validate email and password
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email that ends with @gmail.com.");
            return;
        }
        if (!passwordPattern.test(password)) {
            alert("Password must be at least 8 characters long and contain at least one special character.");
            return;
        }

        console.log("Name:", name);
        console.log("Email:", email);
        console.log("Password:", password);

        // Send POST request to the backend
        try {
            const response = await fetch('https://movieb-tmxl.onrender.com/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();
            console.log("this is data:", data);
            if (response.ok) {
                const userid = data.userid.id;  // Save the userId from the response
                localStorage.setItem('userid', userid);
                // Optionally, redirect to the login page
                window.location.replace("home.html");
            } else {
                alert(data.message || 'Signup failed');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('Something went wrong! Please try again.');
        }
    });

    // Login form submission handler
    document.querySelector('.sign-in-container form').addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Get values from form inputs
        const email = document.querySelector('input[name="email1"]').value;
        const password = document.querySelector('input[name="password1"]').value;

        // Validate email and password
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email that ends with @gmail.com.");
            return;
        }
        if (!passwordPattern.test(password)) {
            alert("Password must be at least 8 characters long and contain at least one special character.");
            return;
        }

        console.log(email, password);

        // Send POST request to the backend
        try {
            const response = await fetch('https://movieb-tmxl.onrender.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log("this is data:", data);
            if (response.ok) {
                console.log("Login successful!", data.userId);
                localStorage.setItem('userid', data.userId);  // Store userId in localStorage
                window.location.replace("home.html");
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Something went wrong! Please try again.');
        }
    });
});
