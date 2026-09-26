const API = "/api/TravelAway";

document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    loadPackages();
});

async function apiGet(action, params = {}) {
    const url = new URL(`${API}/${action}`, window.location.origin);
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

async function loadPackages() {
    const container = document.getElementById("packageContainer");
    container.innerHTML = `<div class="loading">Loading packages...</div>`;
    try {
        displayPackages(await apiGet("GetPackages"));
    } catch (e) {
        console.error(e);
        container.innerHTML = `<div class="error-message">Unable to load packages.</div>`;
    }
}

async function loadCategories() {
    const container = document.getElementById("categoryContainer");
    try {
        const categories = await apiGet("GetPackageCategories");
        container.innerHTML = "";
        addCategoryButton(container, "all", "All", true);
        (categories || []).forEach(c => {
            const id = c.packageCategoryId ?? c.PackageCategoryId;
            const name = c.packageCategoryName ?? c.PackageCategoryName;
            addCategoryButton(container, id, name, false);
        });
    } catch (e) {
        console.error(e);
        container.innerHTML = "";
        addCategoryButton(container, "all", "All", true);
    }
}

function addCategoryButton(container, id, name, active) {
    const button = document.createElement("button");
    button.className = `category-btn${active ? " active" : ""}`;
    button.textContent = name;
    button.dataset.categoryId = id;
    button.addEventListener("click", async () => {
        document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
        button.classList.add("active");
        if (id === "all") await loadPackages();
        else {
            const container = document.getElementById("packageContainer");
            container.innerHTML = `<div class="loading">Loading packages...</div>`;
            try { displayPackages(await apiGet("GetPackagesByCategoryId", { categoryId: id })); }
            catch (e) { container.innerHTML = `<div class="error-message">Unable to load packages.</div>`; }
        }
    });
    container.appendChild(button);
}

function displayPackages(packages) {
    const container = document.getElementById("packageContainer");
    if (!packages?.length) {
        container.innerHTML = `<div class="empty-state">No packages found.</div>`;
        return;
    }
    container.innerHTML = packages.map(p => {
        const id = p.packageId ?? p.PackageId;
        const name = p.packageName ?? p.PackageName ?? "Travel Package";
        const type = p.typeOfPackage ?? p.TypeOfPackage ?? "Travel";
        return `
        <article class="package-card">
            <div class="package-image-container">
                <img class="package-image" src="${getImage(name)}" alt="${escapeHtml(name)}" onerror="this.src='https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80'">
            </div>
            <div class="package-content">
                <span class="package-type">${escapeHtml(type)}</span>
                <h3>${escapeHtml(name)}</h3>
                <p class="package-description">Explore ${escapeHtml(name)} and create unforgettable memories.</p>
                <div class="quick-links">
                    <button class="btn btn-outline" onclick="showPackageDetails(${id})">View Details</button>
                    <a class="btn btn-primary" href="booking.html?packageId=${encodeURIComponent(id)}">Book</a>
                </div>
            </div>
        </article>`;
    }).join("");
}

async function showPackageDetails(packageId) {
    const modal = document.getElementById("packageModal");
    const details = document.getElementById("packageDetails");
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    details.innerHTML = `<div class="loading">Loading details...</div>`;
    try {
        const result = await apiGet("GetPackageDetailsByPackageId", { packageId });
        const d = Array.isArray(result) ? result[0] : result;
        if (!d) throw new Error("No details");
        const name = d.packageName ?? d.PackageName ?? "Package";
        const places = d.placesToVisit ?? d.PlacesToVisit ?? "Not available";
        const description = d.description ?? d.Description ?? "Not available";
        const days = d.noOfDays ?? d.NoOfDays;
        const nights = d.noOfNights ?? d.NoOfNights;
        const accommodation = d.accomodation ?? d.Accomodation ?? "Not available";
        const price = d.pricePerAdult ?? d.PricePerAdult;
        details.innerHTML = `
            <h2 class="details-title">${escapeHtml(name)}</h2>
            <div class="details-item"><span class="details-label">Places to Visit</span><div class="details-value">${escapeHtml(places)}</div></div>
            <div class="details-item"><span class="details-label">Description</span><div class="details-value">${escapeHtml(description)}</div></div>
            <div class="details-item"><span class="details-label">Duration</span><div class="details-value">${days ?? "N/A"} Days / ${nights ?? "N/A"} Nights</div></div>
            <div class="details-item"><span class="details-label">Accommodation</span><div class="details-value">${escapeHtml(accommodation)}</div></div>
            <div class="details-item"><span class="details-label">Price Per Adult</span><div class="details-value price-value">${price == null ? "N/A" : "₹" + Number(price).toLocaleString("en-IN")}</div></div>
            <div class="quick-links"><a class="btn btn-primary" href="booking.html?packageId=${encodeURIComponent(packageId)}">Book this package</a></div>`;
    } catch (e) {
        console.error(e);
        details.innerHTML = `<div class="error-message">Unable to load package details.</div>`;
    }
}

document.getElementById("modalClose")?.addEventListener("click", closeModal);
document.getElementById("packageModal")?.addEventListener("click", e => {
    if (e.target.id === "packageModal") closeModal();
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
function closeModal() {
    const modal = document.getElementById("packageModal");
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
}
function getImage(name) {
    const map = {
        "North India":"https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80",
        "Malibu Islands":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "America":"https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1000&q=80",
        "Australia":"https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1000&q=80",
        "Maldives":"https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1000&q=80",
        "Kasol-Manali":"https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1000&q=80",
        "Beauty of South":"https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1000&q=80",
        "Himachal":"https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80",
        "Heart of India":"https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1000&q=80"
    };
    return map[name] || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80";
}
function escapeHtml(v) {
    return String(v ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}