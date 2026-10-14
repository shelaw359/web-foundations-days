"use strict";

// Select HTML elements
const loadButton = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const statusText = document.querySelector("#status");
const usersList = document.querySelector("#users-list");

// API address
const API_URL = "https://jsonplaceholder.typicode.com/users";

// Store the users fetched from the API
let users = [];

// Display users on the page
function renderUsers(list) {
    usersList.textContent = "";

    if (users.length === 0) {
        statusText.textContent = "Click Load Users to fetch users.";
        return;
    }

    if (list.length === 0) {
        statusText.textContent = "No users match your filter.";
        return;
    }

    list.forEach(function (user) {
        const item = document.createElement("li");

        const name = document.createElement("h2");
        name.textContent = user.name;

        const email = document.createElement("p");
        email.textContent = `Email: ${user.email}`;

        const city = document.createElement("p");
        city.textContent = `City: ${user.address.city}`;

        const company = document.createElement("p");
        company.textContent = `Company: ${user.company.name}`;

        item.append(name, email, city, company);
        usersList.appendChild(item);
    });

    statusText.textContent = `Showing ${list.length} user(s).`;
}

// Fetch users from the API
async function loadUsers() {
    statusText.textContent = "Loading users...";
    loadButton.disabled = true;
    usersList.textContent = "";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                `Request failed with status ${response.status}`
            );
        }

        users = await response.json();

        const searchTerm = filterInput.value.trim().toLowerCase();

        const filteredUsers = users.filter(function (user) {
            return (
                user.name.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm)
            );
        });

        renderUsers(filteredUsers);
    } catch (error) {
        statusText.textContent =
            "Could not load users. Please try again.";

        console.error("Error loading users:", error);
    } finally {
        loadButton.disabled = false;
    }
}

// Load users when the button is clicked
loadButton.addEventListener("click", loadUsers);

// Filter users by name or email as the user types
filterInput.addEventListener("input", function () {
    const searchTerm = filterInput.value.trim().toLowerCase();

    const filteredUsers = users.filter(function (user) {
        return (
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
    });

    renderUsers(filteredUsers);
});
