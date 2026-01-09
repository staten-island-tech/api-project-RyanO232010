import "./style.css";

let startingMeal = 10;
const meals = [];
const savedMeals = [];
let isLoading = false;

const container = document.getElementById("meal");
const rbtn = document.getElementById("loadMeal");
const bcontainer = document.getElementById("bcontainer")



function inject(meal) {
  let ingredientsHTML = "<ul>";

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      ingredientsHTML += `<li>${ingredient} – ${
        measure?.trim() || "to taste"
      }</li>`;
    }
  }

  ingredientsHTML += "</ul>";

  container.insertAdjacentHTML(
    "beforeend",
    `
    <div class="meal-card w-125 bg-white rounded-lg shadow p-4 space-x-10  "> 
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <p>Category: ${meal.strCategory}</p>
      <p>Area: ${meal.strArea}</p>
      <btn>Instructions</btn>
      <h3>Instructions</h3>
      <p>${meal.strInstructions}</p>
      <h3>Ingredients</h3>
      ${ingredientsHTML}
    </div>
    `
  );
}

const alp = "abcdefghijklmnopqrstuvwxyz".split("");

function injectButtons() {
  bcontainer.innerHTML = "";

  alp.forEach(letter => {
    bcontainer.insertAdjacentHTML(
      "beforeend",
      `<button class="letter-btn p-2 bg-red-600 m-1 px-3 py-1.5 rounded" data-letter="${letter}">
        ${letter.toUpperCase()}
      </button>`
    );
  });
}

function injectAll(mealsArray) {
  container.innerHTML = "";
  mealsArray.forEach((meal) => inject(meal));
}

async function fetchRandomMeal() {
  if (isLoading) return;
  isLoading = true;

  meals.length = 0;
  container.innerHTML = "<p>Loading...</p>";

  try {
    for (let i = 0; i < 3; i++) {
      const res = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
      );
      const data = await res.json();

      if (!data.meals || !data.meals.length) {
        container.innerHTML = "<p>No meal found.</p>";
        return;
      }

      meals.push(data.meals[0]);
      savedMeals.push(data.meals[0])
      console.log(data.meals[0]);
    }

    injectAll(meals);
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error fetching meal.</p>";
  } finally {
    isLoading = false;
  }
}

rbtn.addEventListener("click", fetchRandomMeal);

async function fetchMealsByLetter(letter) {
  if (isLoading) return;
  isLoading = true;

  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
    );
    const data = await res.json();

    if (!data.meals) {
      container.innerHTML = `<p>No meals starting with "${letter.toUpperCase()}"</p>`;
      return;
    }

    injectAll(data.meals);
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error fetching meals.</p>";
  } finally {
    isLoading = false;
  }
}


bcontainer.addEventListener("click", (event) => {
  if (!event.target.classList.contains("letter-btn")) return;

  const letter = event.target.dataset.letter;
  fetchMealsByLetter(letter);
});

export { inject };

console.log(savedMeals)
injectButtons();