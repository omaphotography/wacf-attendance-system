const drawer = document.getElementById("memberDrawer");

const closeDrawer = document.getElementById("closeDrawer");

function openDrawer() {

    drawer.classList.remove("translate-x-full");

}

function closeMemberDrawer() {

    drawer.classList.add("translate-x-full");

}

closeDrawer.addEventListener("click", closeMemberDrawer);

// Populate day dropdown
const daySelect = document.getElementById("birth_day");

for (let i = 1; i <= 31; i++) {

    daySelect.innerHTML += `<option value="${i}">${i}</option>`;

}