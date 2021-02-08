// Target DOMs
const divCategories = document.querySelector(".categories");

// MODERN WAY OF PROMISES
async function start() {
  try {
    // await keyword will prevent the code to run until fetch - promise is completed
    const response = await fetch("https://opentdb.com/api_category.php");
    const data = await response.json();
    createCategoryList(data.trivia_categories);
  } catch (e) {
    console.log("There was a problem fetching the category list.");
  }
}

start();

let APICategory;
let APIDifficulty;
let APICall;

// Create category list
function createCategoryList(categoryList) {
  categoryList.forEach((category) => {
    divCategories.innerHTML += `
      <div 
        class="category-item" 
        onClick="selectCategory('${category.id}')"
      >
        ${category.name}
      </div>
    `;
  });
}

function selectCategory(categoryID) {
  console.log(categoryID);
  return (APICategory = categoryID);
}

function selectDifficulty(difficulty) {
  console.log(difficulty);
  return (APIDifficulty = difficulty);
}

function constructAPICall(APICategory, APIDifficulty) {
  let category;
  let difficulty;

  if (APICategory === "0") {
    category = ``;
  } else {
    category = `&category=${APICategory}`;
  }

  if (APIDifficulty === "random") {
    difficulty = ``;
  } else {
    difficulty = `&difficulty=${APIDifficulty}`;
  }

  // `https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple`

  APICall = `https://opentdb.com/api.php?amount=10${category}${difficulty}&type=multiple`;

  console.log(APICall);
}
