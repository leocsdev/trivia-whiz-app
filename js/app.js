// Target DOMs
const divCategories = document.querySelector(".categories");
const divDifficultyOptions = document.querySelector(".section-difficulty");
const divSelectedCategory = document.querySelector(".selected-category");
const divSelectedDifficulty = document.querySelector(".selected-difficulty");

const divTrivia = document.querySelector(".section-trivia");

const btnStart = document.querySelector(".btn-start");

const divTriviaContainer = document.querySelector(".trivia-container");

// initialize state of the game
let state = {
  score: 0,
  wrongAnswers: 0,
};

let APICategory = "";
let APIDifficulty = "";
let APICall = "";

// Start Game
document.addEventListener("DOMContentLoaded", startGame);

// Load Questions once Start button is clicked
btnStart.addEventListener("click", () => {
  loadTrivia();
  divTrivia.style.display = "block";
});

function startGame() {
  getCategories();
  divDifficultyOptions.style.display = "none";
  divTrivia.style.display = "none";
  btnStart.style.display = "none";
}

function loadTrivia() {
  constructAPICall(APICategory, APIDifficulty);
  fetchTrivia(APICall);
}

// MODERN WAY OF PROMISES
async function getCategories() {
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

  // Save selected category to global var APICategory and show difficulty options
  if (categoryID) {
    divDifficultyOptions.style.display = "block";
    return (APICategory = categoryID);
  }
}

// Select difficulty and render selected
function selectDifficulty(difficulty) {
  divSelectedDifficulty.innerHTML = `SELECTED DIFFICULTY: ${difficulty.toUpperCase()}`;
  console.log(difficulty);

  // Save selected difficulty to global var APIDifficulty and show start button
  if (difficulty) {
    btnStart.style.display = "block";
    return (APIDifficulty = difficulty);
  }
}

// Construct API call and save API to global var APICall
function constructAPICall(selectedCategory, selectedDifficulty) {
  let category;
  let difficulty;

  if (selectedCategory === "0") {
    category = "";
  } else {
    category = `&category=${selectedCategory}`;
  }

  if (selectedDifficulty === "any") {
    difficulty = "";
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
    <h4>${category} (${difficulty.toUpperCase()})</h4>
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

  // Add event listeners to all answers in html and get the value
  const listAnswers = document.querySelectorAll(".select-answer");

  // Check user answer
  listAnswers.forEach((answer) => {
    answer.addEventListener("click", function () {
      let userAnswer = answer.attributes["data-answer"].value;
      console.log(`Selected answer by user: ${userAnswer}`);

      let correctAnswer = decodeHtml(correct_answer);

      // Compare user answer to correct answer
      if (userAnswer === correctAnswer) {
        // add 1 to score if user answer is correct
        state.score++;
        console.log(`Score: ${state.score}`);

        alert("You are correct!");

        // get another trivia
        loadTrivia();

        // Check if user won or lost
        checkLogic();
      } else {
        // Add 1 to wrong answer if user answer is wrong
        state.wrongAnswers++;
        console.log(`Wrong answer: ${state.wrongAnswers}`);

        alert("Incorrect answer, try again.");

        // get another trivia
        loadTrivia();

        // Check if user won or lost
        checkLogic();
      }
    });
  });
}

function checkLogic() {
  // Check if user won
  if (state.score === 10) {
    // Send message if won
    console.log("Congrats, you won!");

    // Reset game
    resetGame();
  }

  // Check if user won
  if (state.wrongAnswers === 3) {
    // Send message if lost
    console.log("Sorry, you lost.");

    // Reset game
    resetGame();
  }
}

// Reset game
function resetGame() {
  // reset state values
  state.score = 0;
  state.wrongAnswers = 0;

  APICategory = "";
  APIDifficulty = "";
  APICall = "";

  divCategories.innerHTML = `
    <div class="category-item" onClick="selectCategory('0', 'any')">
      ANY
    </div>
  `;

  divSelectedCategory.innerHTML = "";
  divSelectedDifficulty.innerHTML = "";
  divTrivia.style.display = "none";

  startGame();
}

// Utility functions
// Shuffle items in an array
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

// Convert html entities from api to plain html
function decodeHtml(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
