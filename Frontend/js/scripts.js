const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".nav-link");

function showPage(id) {
    pages.forEach(page => page.style.display = "none");
    document.getElementById(id).style.display = "flex";
}

navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        showPage(link.dataset.target);
    });
});

// Show dashboard by default
showPage("dashboard");