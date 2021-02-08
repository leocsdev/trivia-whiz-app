// Target DOMs
const divCategories = document.querySelector(".categories");

const divSelectedCategory = document.querySelector(".selected-category");
const divSelectedDifficulty = document.querySelector(".selected-difficulty");

const btnStart = document.querySelector(".btn-start");

const divTriviaContainer = document.querySelector(".trivia-container");

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

// Create category list and render in HTML
function createCategoryList(categoryList) {
  categoryList.forEach((category) => {
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

// Select category and render selected
function selectCategory(categoryID, categoryName) {
  divSelectedCategory.innerHTML = `SELECTED CATEGORY: ${categoryName.toUpperCase()}`;

  console.log(categoryID);

  return (APICategory = categoryID);
}

// Select difficulty and render selected
function selectDifficulty(difficulty) {
  divSelectedDifficulty.innerHTML = `SELECTED DIFFICULTY: ${difficulty.toUpperCase()}`;
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

  if (APIDifficulty === "any") {
    difficulty = ``;
  } else {
    difficulty = `&difficulty=${APIDifficulty}`;
  }

  // `https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple`

  return (APICall = `https://opentdb.com/api.php?amount=10${category}${difficulty}&type=multiple`);
}

// Fetch Questions
async function fetchTrivias(api) {
  try {
    const response = await fetch(api);
    const data = await response.json();
    renderTrivias(data.results);
  } catch (e) {
    console.log("There was a problem fetching trivia questions.");
  }
}

function renderTrivias(trivias) {
  // console.log(trivias);

  trivias.forEach((trivia) => {
    // trivia.category
    // trivia.correct_answer
    // trivia.difficulty
    // trivia.incorrect_answers
    // trivia.question
    // trivia.type
    // console.log(`Question: ${trivia.question}`);
    // const allAnswers = [trivia.incorrect_answers, trivia.correct_answer];

    // combine all answers
    const allAnswers = trivia.incorrect_answers.concat(trivia.correct_answer);

    // shuffle all answers
    shuffle(allAnswers);

    console.log(`${trivia.correct_answer}`);

    divTriviaContainer.innerHTML += `
      <div class="question">${trivia.question}</div>
      <br>
      <ul>
        <li>${allAnswers[0]}</li>
        <li>${allAnswers[1]}</li>
        <li>${allAnswers[2]}</li>
        <li>${allAnswers[3]}</li>
        <!-- <li><strong>Answer: ${trivia.correct_answer}</strong></li> -->
      </ul>
      
      <br>
    `;
  });
}

function loadTrivias() {
  constructAPICall(APICategory, APIDifficulty);
  fetchTrivias(APICall);
}

// Load Questions once Start button is clicked
btnStart.addEventListener("click", loadTrivias);

// Utility functions

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}
