/* =========================================================
   TRAVELAWAY FRONTEND
========================================================= */

const API_BASE = "/api/TravelAway";


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadPackages();

    loadCategories();

});


/* =========================================================
   LOAD ALL PACKAGES
========================================================= */

async function loadPackages() {

    const container =
        document.getElementById("packageContainer");

    container.innerHTML = `
        <div class="loading">
            Loading packages...
        </div>
    `;

    try {

        const response =
            await fetch(`${API_BASE}/GetPackages`);

        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }

        const packages =
            await response.json();

        displayPackages(packages);

    }
    catch (error) {

        console.error(
            "Error loading packages:",
            error
        );

        container.innerHTML = `
            <div class="error-message">
                Unable to load packages.
                <br>
                Please try again later.
            </div>
        `;

    }

}


/* =========================================================
   DISPLAY PACKAGES
========================================================= */

function displayPackages(packages) {

    const container =
        document.getElementById("packageContainer");

    if (!packages || packages.length === 0) {

        container.innerHTML = `
            <div class="loading">
                No packages found.
            </div>
        `;

        return;
    }


    container.innerHTML = "";


    packages.forEach(packageItem => {

        const packageCard =
            createPackageCard(packageItem);

        container.appendChild(packageCard);

    });

}


/* =========================================================
   CREATE PACKAGE CARD
========================================================= */

function createPackageCard(packageItem) {

    const card =
        document.createElement("div");

    card.className = "package-card";


    const packageName =
        packageItem.packageName ||
        "Travel Package";


    const packageId =
        packageItem.packageId;


    const packageType =
        packageItem.typeOfPackage ||
        "Travel";


    const image =
        getPackageImage(packageName);


    card.innerHTML = `

        <div class="package-image-container">

            <img
                src="${image}"
                alt="${escapeAttribute(packageName)}"
                class="package-image"
                loading="lazy"
                onerror="handleImageError(this)"
            >

        </div>


        <div class="package-content">

            <span class="package-type">
                ${escapeHtml(packageType)}
            </span>

            <h3>
                ${escapeHtml(packageName)}
            </h3>

            <p class="package-description">
                Explore ${escapeHtml(packageName)}
                and create unforgettable memories.
            </p>

            <button
                type="button"
                class="view-package-btn"
                onclick="loadPackageDetails(${packageId})"
            >
                View Package
            </button>

        </div>

    `;


    return card;

}


/* =========================================================
   LOAD CATEGORIES
========================================================= */

async function loadCategories() {

    const container =
        document.getElementById("categoryContainer");

    try {

        const response =
            await fetch(
                `${API_BASE}/GetPackageCategories`
            );


        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }


        const categories =
            await response.json();


        container.innerHTML = "";


        /* =================================================
           ALL BUTTON
        ================================================= */

        const allButton =
            document.createElement("button");

        allButton.type = "button";

        allButton.className =
            "category-btn active";

        allButton.dataset.categoryId =
            "all";

        allButton.textContent =
            "All";


        allButton.addEventListener(
            "click",
            function () {

                setActiveCategory("all");

                loadPackages();

            }
        );


        container.appendChild(allButton);


        /* =================================================
           CATEGORY BUTTONS
        ================================================= */

        if (
            categories &&
            categories.length > 0
        ) {

            categories.forEach(category => {

                const button =
                    document.createElement("button");


                button.type = "button";

                button.className =
                    "category-btn";


                const categoryId =
                    category.packageCategoryId;


                button.dataset.categoryId =
                    String(categoryId);


                button.textContent =
                    category.packageCategoryName ||
                    category.categoryName ||
                    "Category";


                button.addEventListener(
                    "click",
                    function () {

                        setActiveCategory(
                            categoryId
                        );


                        loadPackagesByCategory(
                            categoryId
                        );

                    }
                );


                container.appendChild(button);

            });

        }

    }
    catch (error) {

        console.error(
            "Error loading categories:",
            error
        );


        /* ---------------------------------------------
           Keep All button available
        --------------------------------------------- */

        container.innerHTML = "";


        const allButton =
            document.createElement("button");

        allButton.type = "button";

        allButton.className =
            "category-btn active";

        allButton.dataset.categoryId =
            "all";

        allButton.textContent =
            "All";


        allButton.addEventListener(
            "click",
            function () {

                setActiveCategory("all");

                loadPackages();

            }
        );


        container.appendChild(allButton);

    }

}


/* =========================================================
   SET ACTIVE CATEGORY
========================================================= */

function setActiveCategory(categoryId) {

    const buttons =
        document.querySelectorAll(
            ".category-btn"
        );


    /* ---------------------------------------------
       Remove active from every button
    --------------------------------------------- */

    buttons.forEach(button => {

        button.classList.remove("active");

    });


    /* ---------------------------------------------
       Convert ID to string because dataset values
       are always strings
    --------------------------------------------- */

    const selectedId =
        String(categoryId);


    /* ---------------------------------------------
       Find selected category
    --------------------------------------------- */

    const selectedButton =
        document.querySelector(
            `.category-btn[data-category-id="${CSS.escape(selectedId)}"]`
        );


    /* ---------------------------------------------
       Add active class
    --------------------------------------------- */

    if (selectedButton) {

        selectedButton.classList.add("active");

    }

}


/* =========================================================
   LOAD PACKAGES BY CATEGORY
========================================================= */

async function loadPackagesByCategory(categoryId) {

    const container =
        document.getElementById("packageContainer");


    container.innerHTML = `
        <div class="loading">
            Loading packages...
        </div>
    `;


    try {

        const response =
            await fetch(
                `${API_BASE}/GetPackagesByCategoryId?categoryId=${encodeURIComponent(categoryId)}`
            );


        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }


        const packages =
            await response.json();


        displayPackages(packages);

    }
    catch (error) {

        console.error(
            "Error loading category packages:",
            error
        );


        container.innerHTML = `
            <div class="error-message">
                Unable to load packages for this category.
            </div>
        `;

    }

}


/* =========================================================
   LOAD PACKAGE DETAILS
========================================================= */

async function loadPackageDetails(packageId) {

    const modal =
        document.getElementById("packageModal");


    const detailsContainer =
        document.getElementById("packageDetails");


    modal.classList.add("show");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    detailsContainer.innerHTML = `
        <div class="loading">
            Loading package details...
        </div>
    `;


    try {

        const response =
            await fetch(
                `${API_BASE}/GetPackageDetailsByPackageId?packageId=${encodeURIComponent(packageId)}`
            );


        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }


        const details =
            await response.json();


        displayPackageDetails(details);

    }
    catch (error) {

        console.error(
            "Error loading package details:",
            error
        );


        detailsContainer.innerHTML = `
            <div class="error-message">
                Unable to load package details.
            </div>
        `;

    }

}


/* =========================================================
   DISPLAY PACKAGE DETAILS
========================================================= */

function displayPackageDetails(details) {

    const container =
        document.getElementById("packageDetails");


    if (!details) {

        container.innerHTML = `
            <div class="error-message">
                Package details not found.
            </div>
        `;

        return;
    }


    /* ---------------------------------------------
       API may return an array
    --------------------------------------------- */

    if (Array.isArray(details)) {

        if (details.length === 0) {

            container.innerHTML = `
                <div class="error-message">
                    Package details not found.
                </div>
            `;

            return;
        }


        details = details[0];

    }


    const packageName =
        details.packageName ||
        "Package";


    const description =
        details.description ||
        details.packageDescription ||
        "Explore this amazing destination.";


    const city =
        details.cityName ||
        details.city ||
        "Not available";


    const duration =
        details.duration ||
        details.numberOfDays ||
        "Not available";


    const cost =
        details.cost ||
        details.packageCost ||
        details.price ||
        "Not available";


    container.innerHTML = `

        <h2 class="details-title">
            ${escapeHtml(packageName)}
        </h2>


        <div class="details-item">

            <span class="details-label">
                Description
            </span>

            <div class="details-value">
                ${escapeHtml(description)}
            </div>

        </div>


        <div class="details-item">

            <span class="details-label">
                City
            </span>

            <div class="details-value">
                ${escapeHtml(city)}
            </div>

        </div>


        <div class="details-item">

            <span class="details-label">
                Duration
            </span>

            <div class="details-value">
                ${escapeHtml(duration)}
            </div>

        </div>


        <div class="details-item">

            <span class="details-label">
                Cost
            </span>

            <div class="details-value">
                ${escapeHtml(cost)}
            </div>

        </div>

    `;

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal() {

    const modal =
        document.getElementById("packageModal");


    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================================= */

window.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById("packageModal");


        if (event.target === modal) {

            closeModal();

        }

    }
);


/* =========================================================
   CLOSE MODAL WITH ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeModal();

        }

    }
);


/* =========================================================
   PACKAGE IMAGES
========================================================= */

function getPackageImage(packageName) {

    const images = {

        "North India":
            "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=85",

        "Malibu Islands":
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85",

        "America":
            "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1000&q=85",

        "Australia":
            "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1000&q=85",

        "Maldives":
            "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1000&q=85",

        "Kasol-Manali":
            "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1000&q=85",

        "Beauty of South":
            "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1000&q=85",

        "Himachal":
            "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=85",

        "Heart of India":
            "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1000&q=85"

    };


    return images[packageName] ||
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=85";

}


/* =========================================================
   IMAGE ERROR HANDLER
========================================================= */

function handleImageError(image) {

    image.onerror = null;

    image.src =
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=85";

}


/* =========================================================
   HTML ESCAPING
========================================================= */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================================
   ATTRIBUTE ESCAPING
========================================================= */

function escapeAttribute(value) {

    return escapeHtml(value);

}