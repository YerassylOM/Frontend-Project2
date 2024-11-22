const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const mealDetailsContent = document.querySelector('.meal-details-content');
const apiKey = '408ced395efe484eb190bd26fd554cc5';

searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () =>{
    recipeCloseBtn.parentElement.classList.remove('showRecipe')
})

function getMealList() {
    const searchInputTxt = document.getElementById('search-input').value.trim();
    if (!searchInputTxt) {
        alert("Please enter an ingredient to search.");
        return;
    }

    fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${searchInputTxt}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`An error occurred: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            let html = "";
            if (data.results && data.results.length > 0) {
                data.results.forEach(meal => {
                    html += `
                        <div class="meal-item" data-id="${meal.id}">
                            <div class="meal-img">
                                <img src="${meal.image}" alt="food">
                            </div>
                            <div class="meal-name">
                                <h3>${meal.title}</h3>
                                <a href="#" class="recipe-btn">Get Recipe</a>
                            </div>
                        </div>   
                    `;
                });
            } else {
                html = "<p>No meals found. Try a different ingredient!</p>";
            }
            mealList.innerHTML = html;
        })
        .catch(error => {
            console.error("Error fetching meal data:", error);
            mealList.innerHTML = "<p>Something went wrong. Please try again later.</p>";
        });
}

function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        const mealItem = e.target.parentElement.parentElement;
        const mealId = mealItem.dataset.id;

        fetch(`https://api.spoonacular.com/recipes/${mealId}/information?apiKey=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched Recipe Data:", data);
                mealRecipeModel(data);
            })
            .catch(error => {
                console.error("Error fetching recipe details:", error);
                mealDetailsContent.innerHTML = "<p>Unable to load recipe details. Please try again later.</p>";
            });
    }
}

function mealRecipeModel(meal) {
    if (!meal || !meal.title) {
        console.error("Invalid meal data:", meal);
        mealDetailsContent.innerHTML = "<p>Recipe details could not be loaded.</p>";
        return;
    }

    const html = `
        <h2 class="recipe-title">${meal.title}</h2>
        <p class="recipe-category">Ready in ${meal.readyInMinutes || "N/A"} minutes</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.instructions || "No instructions available."}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.image}" alt="${meal.title}">
        </div>
        <div class="recipe-link">
            <a href="${meal.sourceUrl}" target="_blank">View Full Recipe</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}
