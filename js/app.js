// Target DOMs
const divCategories = document.querySelector(".categories");
const divSelectedCategory = document.querySelector(".selected-category");
const divSelectedDifficulty = document.querySelector(".selected-difficulty");

const btnStart = document.querySelector(".btn-start");

const divTriviaContainer = document.querySelector(".trivia-container");

let APICategory;
let APIDifficulty;
let APICall;

start();

function loadTrivia() {
  constructAPICall(APICategory, APIDifficulty);
  fetchTrivia(APICall);
}

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

// Create category list and render in HTML
function createCategoryList(categoryList) {
  categoryList.forEach((category) => {
    // divCategories.innerHTML += `
    divCategories.innerHTML += `
      <div 
        class="category-item" 
        onClick="selectCategory('${category.id}', '${category.name}')"
      >
        ${category.name}
      </div>
    `;
  });
}

// Select category and render to html
function selectCategory(categoryID, categoryName) {
  divSelectedCategory.innerHTML = `SELECTED CATEGORY: ${categoryName.toUpperCase()}`;
  console.log(categoryID);

  // Save selected category to global var APICategory
  return (APICategory = categoryID);
}

// Select difficulty and render selected
function selectDifficulty(difficulty) {
  divSelectedDifficulty.innerHTML = `SELECTED DIFFICULTY: ${difficulty.toUpperCase()}`;
  console.log(difficulty);

  // Save selected difficulty to global var APIDifficulty
  return (APIDifficulty = difficulty);
}

// Construct API call and save API to global var APICall
function constructAPICall(selectedCategory, selectedDifficulty) {
  let category;
  let difficulty;

  if (selectedCategory === "0") {
    category = ``;
  } else {
    category = `&category=${selectedCategory}`;
  }

  if (selectedDifficulty === "any") {
    difficulty = ``;
  } else {
    difficulty = `&difficulty=${selectedDifficulty}`;
  }

  // `https://opentdb.com/api.php?amount=1&category=15&difficulty=easy&type=multiple`

  // Construct API and save it in global variable APICall
  return (APICall = `https://opentdb.com/api.php?amount=1${category}${difficulty}&type=multiple`);
}

// Fetch question via API
async function fetchTrivia(api) {
  try {
    const response = await fetch(api);
    const data = await response.json();
    renderTrivia(data.results);
  } catch (e) {
    console.log("There was a problem fetching trivia questions.");
    console.log(`Error: ${e}`);
  }
}

function renderTrivia(trivia) {
  // console.log(trivia);

  let {
    category,
    difficulty,
    question,
    incorrect_answers,
    correct_answer,
  } = trivia[0];

  console.log(`Category: ${category}`);
  console.log(`Difficulty: ${difficulty}`);
  console.log(`Question: ${question}`);
  console.log(
    `Incorrect Answers: ${incorrect_answers[0]}, ${incorrect_answers[1]}, ${incorrect_answers[2]}`
  );
  console.log(`Correct Answer: ${correct_answer}`);

  // Combine all answers to allAnswers array
  let allAnswers = incorrect_answers.concat(correct_answer);

  console.log(`Answers BEFORE shuffle: ${allAnswers}`);

  // Shuffle answers
  shuffle(allAnswers);

  console.log(`Answers AFTER shuffle: ${allAnswers}`);

  // Render to html
  divTriviaContainer.innerHTML = `
    <h4>${category.toUpperCase()} - ${difficulty.toUpperCase()}</h4>
    <br>
    <p class="question">${question}</p>
    <br>
    <ul class="answers">
      <li class="select-answer" data-answer="${allAnswers[0]}">${
    allAnswers[0]
  }</li>
      <li class="select-answer" data-answer="${allAnswers[1]}">${
    allAnswers[1]
  }</li>
      <li class="select-answer" data-answer="${allAnswers[2]}">${
    allAnswers[2]
  }</li>
      <li class="select-answer" data-answer="${allAnswers[3]}">${
    allAnswers[3]
  }</li>
    </ul>
  `;
}

// Load Questions once Start button is clicked
btnStart.addEventListener("click", loadTrivia);

// Utility functions

// Shuffle items in an array
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}
