const addTestCaseButton = document.getElementById("addTestCase");
const testCasesContainer = document.getElementById("testCases");

let testCases = JSON.parse(localStorage.getItem("testCases")) || [];

let nextTestCaseNumber =
  Number(localStorage.getItem("nextTestCaseNumber")) || 1;

// Make sure the counter is higher than any existing test case ID
testCases.forEach((testCase) => {
  const match = testCase.id.match(/TC-(\d+)/);

  if (match) {
    const number = Number(match[1]);

    if (number >= nextTestCaseNumber) {
      nextTestCaseNumber = number + 1;
    }
  }
});

localStorage.setItem("nextTestCaseNumber", nextTestCaseNumber);

// Generate a unique test case ID
function generateTestCaseId() {
  const id = `TC-${String(nextTestCaseNumber).padStart(3, "0")}`;

  nextTestCaseNumber++;

  localStorage.setItem("nextTestCaseNumber", nextTestCaseNumber);

  return id;
}

// Display all test cases
function displayTestCases() {
  testCasesContainer.innerHTML = "";

  testCases.forEach((testCase) => {
    const testCaseElement = document.createElement("div");

    testCaseElement.classList.add("test-case");

    testCaseElement.innerHTML = `
            <strong>${testCase.id}</strong>

            <h3>${testCase.title}</h3>

            <strong>Steps:</strong>
            <p>${testCase.steps}</p>

            <strong>Expected Result:</strong>
            <p>${testCase.expectedResult || "Not provided"}</p>

            <button onclick="deleteTestCase('${testCase.id}')">
                Delete
            </button>
        `;

    testCasesContainer.appendChild(testCaseElement);
  });
}

// Add a new test case
addTestCaseButton.addEventListener("click", function () {
  const title = document.getElementById("title").value.trim();
  const steps = document.getElementById("steps").value.trim();
  const expectedResult = document.getElementById("expectedResult").value.trim();

  if (!title || !steps || !expectedResult) {
    alert("Please enter title, steps and expected result.");
    return;
  }

  const testCase = {
    id: generateTestCaseId(),
    title: title,
    steps: steps,
    expectedResult: expectedResult,
  };

  testCases.push(testCase);

  localStorage.setItem("testCases", JSON.stringify(testCases));

  displayTestCases();

  document.getElementById("title").value = "";
  document.getElementById("steps").value = "";
  document.getElementById("expectedResult").value = "";
});

// Delete a test case
function deleteTestCase(id) {
  testCases = testCases.filter((testCase) => testCase.id !== id);

  localStorage.setItem("testCases", JSON.stringify(testCases));

  displayTestCases();
}

// Display existing test cases when page loads
displayTestCases();
