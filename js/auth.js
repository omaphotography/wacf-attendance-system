// ==========================================
// WACF AUTH.JS
// Authentication Guard
// ==========================================

(async function () {

    // Wait until Supabase is available
    if (!window.supabaseClient) {

        console.error("Supabase client not found.");

        return;

    }

    const {
        data: { session },
        error
    } = await window.supabaseClient.auth.getSession();

    if (error) {

        console.error(error);

        return;

    }

    const currentPage = window.location.pathname.split("/").pop();

    // Public pages (no login required)
    const publicPages = [
        "index.html",
        ""
    ];

    // ----------------------------------
    // User NOT Logged In
    // ----------------------------------

    if (!session && !publicPages.includes(currentPage)) {

        window.location.replace("index.html");

        return;

    }

    // ----------------------------------
    // User already Logged In
    // ----------------------------------

    if (session && publicPages.includes(currentPage)) {

        window.location.replace("dashboard.html");

        return;

    }

    // ----------------------------------
    // Listen for Auth Changes
    // ----------------------------------

    window.supabaseClient.auth.onAuthStateChange((event, session) => {

        if (!session) {

            window.location.replace("index.html");

        }

    });

    // ----------------------------------
    // Logout Button
    // ----------------------------------

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", async (e) => {

            e.preventDefault();

            logoutBtn.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                Logging out...
            `;

            logoutBtn.style.pointerEvents = "none";

            await window.supabaseClient.auth.signOut();

            window.location.replace("index.html");

        });

    }

})();