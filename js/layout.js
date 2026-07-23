async function loadComponent(id, file) {

    const response = await fetch(file);

    const html = await response.text();

    document.getElementById(id).innerHTML = html;

}

window.addEventListener("DOMContentLoaded", async () => {

    await loadComponent("sidebar", "components/sidebar.html");

    await loadComponent("navbar", "components/navbar.html");

    initializeLayout();

});

function initializeLayout() {

    const sidebar = document.querySelector("#sidebar");

    const menuBtn = document.querySelector("#menuBtn");

    if (menuBtn) {

        menuBtn.addEventListener("click", () => {

            sidebar.classList.toggle("-translate-x-full");

        });

    }

    document.addEventListener("click", (e) => {

        if (
            window.innerWidth < 1024 &&
            !sidebar.contains(e.target) &&
            !menuBtn?.contains(e.target)
        ) {
            sidebar.classList.add("-translate-x-full");
        }

    });

}