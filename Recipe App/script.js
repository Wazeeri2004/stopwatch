const SEARCH_API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const RANDOM_API_URL = "https://www.themealdb.com/api/json/v1/1/random.php";
const LOOKUP_API_URL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultGrid = document.getElementById("results-grid");
const messageArea = document.getElementById("message-area");
const randomButton = document.getElementById("random-button");
const modal = document.getElementById("recipe-modal");
const modalContent = document.getElementById("recipe-details-content");
const modalCloseBtn = document.getElementById("modal-close-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const searchButton = document.getElementById("search-button");

let allRecipes = [];
let currentPage = 1;
const recipesPerPage = 8;

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();

    if (searchTerm) {
        searchRecipes(searchTerm);
    } else {
        showMessage("please enter a search term", true);
    }
})

async function searchRecipes(query) {
    searchButton.disabled = true;
    showMessage(`Searching for "${query}"...`, false, true);
    resultGrid.innerHTML = "";
    searchInput.disabled = true;
    searchButton.disabled = true;
    randomButton.disabled = true;
    try {
        const response = await fetch(`${SEARCH_API_URL}${query}`);
        if (!response.ok) throw new Error("Network error");

        const data = await response.json();
        clearMessage();
        console.log("data: ", data);
        if (data.meals) {
            allRecipes = data.meals;
            currentPage = 1;
            displayCurrentPage();
        } else {
            showMessage(`No Recipes found for "${query}",`);
        }
    } catch (error) {
        console.error(error);
        showMessage("Something went wrong, Pls try again.", true);
    } finally{
        searchInput.disabled = false;
        searchButton.disabled = false;
        randomButton.disabled = false;
    }
}

function showMessage(message, isError = false, isLoading = false) {
    messageArea.textContent = message;
    if (isError) messageArea.classList.add("error");
    if (isLoading) messageArea.classList.add("Loading");

}

function clearMessage() {
    messageArea.textContent = "";
    messageArea.className = "message";
}

function displayRecipes(recipes) {
    if (!recipes || recipes.length === 0) {
        showMessage("No recipes to display");
        return;
    }
    recipes.forEach(recipe => {
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe-item");
        recipeDiv.dataset.id = recipe.idMeal;

        recipeDiv.innerHTML = `
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" loading="lazy">
        <h3>${recipe.strMeal}</h3>
        `;
        resultGrid.appendChild(recipeDiv);
    });
}
function displayCurrentPage() {
    resultGrid.innerHTML = "";

    const start = (currentPage - 1) *
        recipesPerPage;
    const end = start + recipesPerPage;

    const recipesToShow =
        allRecipes.slice(start, end);

    displayRecipes(recipesToShow);

    updatePaginationButtons();
}


function updatePaginationButtons() {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage * recipesPerPage >= allRecipes.length;
}

randomButton.addEventListener("click", getRandomRecipe);
prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        displayCurrentPage();
    }
});
nextBtn.addEventListener("click", () => {
    if (currentPage * recipesPerPage < allRecipes.length) {
        currentPage++;
        displayCurrentPage();
    }
});

async function getRandomRecipe() {
    showMessage("Fetching a random recipe...", false, true)
    resultGrid.innerHTML = "";
    randomButton.disabled = true;

    try {
        const response = await fetch(RANDOM_API_URL);
        if (!response.ok) throw new Error("Something went wrong.");
        const data = await response.json();

        console.log("data:", data);

        clearMessage();

        if (data.meals && data.meals.length > 0) {
            displayRecipes(data.meals);
        } else {
            showMessage("Could not fetch a random recipe, Please try again.", true);
        }

    } catch (error) {
        showMessage(
            "Failed to fetch a random recipe. Please check your connection and try again.",
            true
        );
    } finally {
        randomButton.disabled = false;
    }
}

function showModal() {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
}

resultGrid.addEventListener("click", e => {
    const card = e.target.closest(".recipe-item");

    if (card) {
        const recipeId = card.dataset.id;
        getRecipeDetails(recipeId);
    }
})

async function getRecipeDetails(id) {
    modalContent.innerHTML = '<p class="message loading">Loading details...</p>';
    showModal();

    try {
        const response = await fetch(`${LOOKUP_API_URL}${id}`);
        if (!response.ok) throw new Error("Failed to fetch recipe details.");
        const data = await response.json();

        console.log("details: ", data);
        if (data.meals && data.meals.length > 0) {
            displayRecipeDetails(data.meals[0]);
        } else {
            modalContent.innerHTML = `<p class="message error">Could not load recipe details.</p>`;
        }
    } catch (error) {
        modalContent.innerHTML = '<p class="message error">Failed to check recipe details. Check your connection or try again.</p>'
    }
}

modalCloseBtn.addEventListener("click", closeModal);

modal.addEventListener("click", e => {
    if (e.target === modal) {
        closeModal();
    }
})

function displayRecipeDetails(recipe) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`]?.trim();
        const measure = recipe[`strMeasure${i}`]?.trim();

        if (ingredient) {
            ingredients.push(`<li>${measure ? `${measure} ` : ""}${ingredient}</li>`);
        } else {
            break;
        }
    }
    const categoryHTML = recipe.strCategory ? `<h3>Category: ${recipe.strCategory}</h3>` : "";
    const areaHTML = recipe.strArea ? `<h3>Area:${recipe.strArea}</h3>` : "";
    const ingredientsHTML = ingredients.length ? `<h3>Ingredients</h3><ul>${ingredients.join("")}</ul>` : "";
    const instructionsHTML = `<h3>Instructions</h3><p>${recipe.strInstructions ?
        recipe.strInstructions.replace(/\r?\n/g, "<br>") : "Instructions not available."}</p>`

    modalContent.innerHTML = `
    <h2>${recipe.strMeal}</h2>
    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
    ${categoryHTML}
    ${areaHTML}
    ${ingredientsHTML}
    ${instructionsHTML}
    `;
}


