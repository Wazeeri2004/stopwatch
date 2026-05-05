function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function registerUser(e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;

    let users = getUsers();

    users.push({ id: Date.now(), name, email, password, role });

    saveUsers(users);

    alert("Registered successfully!");
    window.location.href = "login.html";
}

function loginUser(e) {
    e.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let users = getUsers();

    let user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid login!");
    }
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

function displayTutors() {
    let users = getUsers();
    let tutors = users.filter(u => u.role === "tutor");

    let container = document.getElementById("tutors");
    container.innerHTML = "";

    tutors.forEach(t => {
        container.innerHTML += `
            <div class="card m-2 p-3">
                <h5>${t.name}</h5>
                <button class="btn btn-primary" onclick="bookTutor(${t.id})">
                    Book Session
                </button>
            </div>
        `;
    });
}

function bookTutor(id) {
    localStorage.setItem("selectedTutor", id);
    window.location.href = "book.html";
}

function showBookings() {
    let user = getCurrentUser();
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    let container = document.getElementById("bookings");
    container.innerHTML = "";

    bookings
        .filter(b => b.tutorId == user.id)
        .forEach(b => {
            container.innerHTML += `
                <p>Date: ${b.date} | Time: ${b.time}</p>
            `;
        });
}

function saveBooking(e) {
    e.preventDefault();

    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    let user = getCurrentUser();
    let tutorId = localStorage.getItem("selectedTutor");

    // 🚫 Check if slot already taken
    let exists = bookings.find(b => 
        b.tutorId == tutorId && b.date == date && b.time == time
    );

    if (exists) {
        alert("This time slot is already booked!");
        return;
    }

    bookings.push({
        studentId: user.id,
        tutorId: tutorId,
        date,
        time
    });

    localStorage.setItem("bookings", JSON.stringify(bookings));

    alert("Booking successful!");
    window.location.href = "dashboard.html";
}
function setAvailability() {
    let date = document.getElementById("availDate").value;
    let time = document.getElementById("availTime").value;

    let user = getCurrentUser();

    let availability = JSON.parse(localStorage.getItem("availability")) || [];

    availability.push({
        tutorId: user.id,
        date,
        time
    });

    localStorage.setItem("availability", JSON.stringify(availability));

    alert("Availability saved!");
}
function showAvailableSlots() {
    let tutorId = localStorage.getItem("selectedTutor");

    let availability = JSON.parse(localStorage.getItem("availability")) || [];
    let container = document.getElementById("slots");

    container.innerHTML = "";

    availability
        .filter(a => a.tutorId == tutorId)
        .forEach(a => {
            container.innerHTML += `
                <p>${a.date} - ${a.time}</p>
            `;
        });
}