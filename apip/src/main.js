async function printRandomMeal() {
  try {
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const data = await response.json();

    if (!data.meals || data.meals.length === 0) {
      console.log("No meal data found.");
      return;
    }

    const meal = data.meals[0];
    console.log(meal)

    console.log("🍽️ Random Meal");
    console.log("-------------");
    console.log("Name:", meal.strMeal);
    console.log("Category:", meal.strCategory);
    console.log("Area:", meal.strArea);
    console.log("Instructions:", meal.strInstructions);
    console.log("Image:", meal.strMealThumb);
    console.log("Recipe ID:", meal.idMeal);


    console.log("\nIngredients:");
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        console.log(` - ${ingredient} (${measure.trim()})`);
      }
    }
  } catch (err) {
    console.error("Error fetching meal:", err);
  }
}

function inject(meal) {
  container.insertAdjacentHTML(
    "beforeend",
    `<div class="card"><h1 class="title">Name:${meal.strMeal}</h1></div>`
  );
}


printRandomMeal();
inject(meal);