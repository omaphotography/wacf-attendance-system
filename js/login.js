// ==========================================
// WACF LOGIN.JS
// ==========================================

const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");

// ==========================================
// Already Logged In?
// ==========================================

(async () => {

    const {
        data: { session }
    } = await window.supabaseClient.auth.getSession();

    if (session) {

        window.location.replace("dashboard.html");

    }

})();

// ==========================================
// Login
// ==========================================

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    if (!email || !password) {

        alert("Please enter your email and password.");

        return;

    }

    loginBtn.disabled = true;

    loginBtn.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        Signing In...
    `;

    const { data, error } = await window.supabaseClient.auth.signInWithPassword({

        email,
        password

    });

    if (error) {

        loginBtn.disabled = false;

        loginBtn.innerHTML = `
            <i class="fas fa-right-to-bracket"></i>
            Login
        `;

        if (
            error.message.toLowerCase().includes("invalid") ||
            error.message.toLowerCase().includes("credentials")
        ) {

            alert("Invalid email or password.");

        } else {

            alert(error.message);

        }

        return;

    }

    console.log("Logged in:", data);

    window.location.replace("dashboard.html");

});