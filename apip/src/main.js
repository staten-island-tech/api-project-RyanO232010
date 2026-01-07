import "./style.css";

let startingMeal = 10;
const meals = [];
let isLoading = false;

const container = document.getElementById("meal");
const button = document.getElementById("loadMeal");

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
    <div class="meal-card w-125 bg-white rounded-lg shadow p-1 justify-around"> 
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
    for (let i = 0; i < startingMeal; i++) {
      const res = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
      );
      const data = await res.json();

      if (!data.meals || !data.meals.length) {
        container.innerHTML = "<p>No meal found.</p>";
        return;
      }

      meals.push(data.meals[0]);
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

button.addEventListener("click", fetchRandomMeal);

container.addEventListener("click", (event) => {
  if (!event.target.classList.contains("add-to-cart")) return;

  const card = event.target.closest(".meal-card");
  const mealId = card.dataset.id;

  const meal = meals.find((m) => m.idMeal === mealId);
  if (!meal) return;

  cart.push({
    id: meal.idMeal,
    name: meal.strMeal,
    instructions: meal.strInstructions,
  });

  console.log("Cart:", cart);
});

export { inject };
