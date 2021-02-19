// Target DOMs
const divCategories = document.querySelector(".categories");
const divDifficultyOptions = document.querySelector(".section-difficulty");
const difficultyItems = document.querySelectorAll(".difficulty-item");
const divSelectedCategory = document.querySelector(".selected-category");
const divSelectedDifficulty = document.querySelector(".selected-difficulty");
const divSelection = document.querySelector(".selection");
const divTrivia = document.querySelector(".section-trivia");
const btnStart = document.querySelector(".btn-start");
const divTriviaContainer = document.querySelector(".trivia-container");
const progressBar = document.querySelector(".game-progress-inner");
const pointsNeeded = document.querySelector(".points-needed");
const mistakesAllowed = document.querySelector(".mistakes-allowed");
const endMessage = document.querySelector(".end-message");
const resetButton = document.querySelector(".reset-button");

// AUDIO
const btnAudio = document.querySelector("#btnAudio");
const icon = document.querySelector("#iconAudio");
const audio = document.querySelector("audio");

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

// Audio button
btnAudio.addEventListener("click", () => {
  if (audio.paused) {
    audio.volume = 0.3;
    audio.play();
    icon.classList.remove("fa-volume-up");
    icon.classList.add("fa-volume-off");
  } else {
    audio.pause();
    icon.classList.remove("fa-volume-off");
    icon.classList.add("fa-volume-up");
  }
  btnAudio.classList.add("fade");
});

// Load Questions once Start button is clicked
btnStart.addEventListener("click", () => {
  playClickSound();

  loadTrivia();

  // Show trivia section
  divTrivia.style.display = "block";

  // Hide selection section
  divSelection.classList.add("hide");
});

function startGame() {
  divDifficultyOptions.style.display = "none";
  divTrivia.style.display = "none";
  btnStart.style.display = "none";

  getCategories();
}

function loadTrivia() {
  constructAPICall(APICategory, APIDifficulty);
  fetchTrivia(APICall);
}

// MODERN WAY OF PROMISES
async function getCategories() {
  try {
    // divCategories.innerHTML = `<img src="./images/loading.gif" alt="Loading questions...">`;
    divCategories.innerHTML = `
    <img class="mt-5" src="./images/loading.gif" alt="Loading Category List..." style="width: 50px">
    `;
    // await keyword will prevent the code to run until fetch - promise is completed
    const response = await fetch("https://opentdb.com/api_category.php");
    const data = await response.json();
    createCategoryList(data.trivia_categories);
  } catch (e) {
    console.log("There was a problem fetching the category list.");
    console.log(e);
  }
}

// Create category list and render in HTML
function createCategoryList(categoryList) {
  // categoryList.forEach((category) => {
  //   divCategories.innerHTML += `
  //     <div
  //       class="category-item animate__animated animate__bounceIn"
  //       onClick="selectCategory('${category.id}', '${category.name}')"
  //     >
  //       ${category.name}
  //     </div>
  //   `;
  // });

  categoryList.forEach((category, i) => {
    divCategories.innerHTML = `
      <div
        class="category-item text-center animate__animated animate__bounceInDown"
        onClick="selectCategory('0', 'any')"
      >
        ANY
      </div>`;
    document
      .querySelector(".category-item")
      .addEventListener("mouseenter", playTinkSound);
    document
      .querySelector(".category-item")
      .addEventListener("click", playClickSound);
    // Add delay to each div before rendering
    setTimeout(() => {
      const div = document.createElement("div");
      // div.className = "category-item animate__animated animate__bounceIn";
      div.className =
        "category-item text-center animate__animated animate__bounceInDown";
      div.setAttribute(
        "onClick",
        `selectCategory('${category.id}', '${category.name}')`
      );
      div.appendChild(document.createTextNode(category.name));
      divCategories.appendChild(div);
      div.addEventListener("mouseenter", playTinkSound);
      div.addEventListener("click", playClickSound);
    }, i * 100);
  });
}

// function handleClickOnCategoryItem() {
//   const categoryItems = document.querySelectorAll(".category-item");

//   categoryItems.forEach((item) => {
//     item.addEventListener("click", () => {
//       console.log(`${item.textContent} is clicked`);
//       item.classList.add("selected");
//     });
//   });
// }

// Select category and render to html
function selectCategory(categoryID, categoryName) {
  divSelectedCategory.innerHTML = `
    <p class="my-0 py-0 animate__animated animate__bounceIn">
      <strong>Category - ${categoryName.toUpperCase()}</strong>
    </p>
  `;

  console.log(categoryID);

  // Save selected category to global var APICategory and show difficulty options
  if (categoryID) {
    divDifficultyOptions.style.display = "block";
    return (APICategory = categoryID);
  }
}

// Select difficulty and render selected
function selectDifficulty(difficulty) {
  // <span class="animate__animated animate__bounceIn">
  divSelectedDifficulty.innerHTML = `
    <p class="my-0 py-0 animate__animated animate__bounceIn">
      <strong>Difficulty - ${difficulty.toUpperCase()}</strong>
    </p>
  `;
  console.log(difficulty);

  // Save selected difficulty to global var APIDifficulty and show start button
  if (difficulty) {
    btnStart.style.display = "block";
    return (APIDifficulty = difficulty);
  }
}

difficultyItems.forEach((item) => {
  item.addEventListener("click", playClickSound);
  item.addEventListener("mouseenter", playTinkSound);
});

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
    divTriviaContainer.innerHTML = `<img src="./images/loading.gif" alt="Loading questions..." style="width: 50px">`;
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
    <h5 class="text-center">${category} (${difficulty.toUpperCase()})</h5>
    
    <p class="question text-center py-4 my-0">${question}</p>
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
    answer.addEventListener("click", () => {
      let userAnswer = answer.attributes["data-answer"].value;
      console.log(`Selected answer by user: ${userAnswer}`);

      let correctAnswer = decodeHtml(correct_answer);

      // Compare user answer to correct answer
      if (userAnswer === correctAnswer) {
        // add 1 to score if user answer is correct
        state.score++;
        console.log(`Score: ${state.score}`);

        // alert("You are correct!");
        confirmAnswer("correct");

        // Update points needed to win in html
        pointsNeeded.textContent = 10 - state.score;

        // Animate progress bar
        renderProgressBar();

        // get another trivia
        // loadTrivia();
        setTimeout(loadTrivia, 2000);
      } else {
        // Add 1 to wrong answer if user answer is wrong
        state.wrongAnswers++;
        console.log(`Wrong answer: ${state.wrongAnswers}`);

        // alert("Incorrect answer, try again.");
        confirmAnswer("incorrect");

        // Update allowed mistakes in html
        mistakesAllowed.textContent = 2 - state.wrongAnswers;

        // get another trivia
        // loadTrivia();
        setTimeout(loadTrivia, 2000);
      }

      // Check if user won or lost
      checkLogic();
    });

    answer.addEventListener("click", playClickSound);
    answer.addEventListener("mouseenter", playTinkSound);
  });
}

function confirmAnswer(answerStatus) {
  if (answerStatus === "correct" && state.score <= 9) {
    divTriviaContainer.innerHTML = `
      <p class="display-4 text-center text-success animate__animated animate__bounceIn">
        <strong>YOU ARE CORRECT!<strong>
      </p>
    `;
  }

  if (answerStatus === "incorrect" && state.wrongAnswers <= 2) {
    divTriviaContainer.innerHTML = `
      <p class="display-4 text-center text-danger animate__animated animate__bounceIn">
        <strong>INCORRECT ANSWER!</strong>
      </p>
    `;
  }
}

function checkLogic() {
  // Check if user won
  if (state.score === 10) {
    // Send message if won
    console.log("Congrats, you won!");

    // Send message if won
    endMessage.style.color = `green`;
    endMessage.textContent = `Congrats! You won.`;

    // Show overlay
    divTrivia.classList.add("overlay-is-open");

    // Wait for overlay to come out and set focus on reset button
    setTimeout(() => {
      resetButton.focus();
    }, 331);

    // // Reset game
    // resetGame();
  }

  // Check if user won
  if (state.wrongAnswers === 3) {
    // Send message if lost
    console.log("Sorry, you lost.");

    // Send message if lost
    endMessage.style.color = `red`;
    endMessage.textContent = `Sorry. You lost.`;

    // Show overlay
    divTrivia.classList.add("overlay-is-open");

    // Wait for overlay to come out and set focus on reset button
    setTimeout(() => {
      resetButton.focus();
    }, 331);

    // // Reset game
    // resetGame();
  }
}

resetButton.addEventListener("click", resetGame);

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

  // reset html values
  pointsNeeded.textContent = 10;
  mistakesAllowed.textContent = 2;

  divSelection.classList.remove("hide");

  // remove overlay
  divTrivia.classList.remove("overlay-is-open");

  renderProgressBar();

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

// Progress bar
function renderProgressBar() {
  progressBar.style.transform = `scaleX(${state.score / 10})`;
}

function playTinkSound() {
  const audio = document.querySelector("#audioTink");
  // always play from the start to avoid delays
  audio.currentTime = 0;
  audio.play();
  audio.volume = 0.3;
}

function playClickSound() {
  const audio = document.querySelector("#audioClick");
  // always play from the start to avoid delays
  audio.currentTime = 0;
  audio.play();
  audio.volume = 0.3;
}
