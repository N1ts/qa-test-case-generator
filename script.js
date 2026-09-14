const addTestCaseButton = document.getElementById("addTestCase");
const cancelEditButton = document.getElementById("cancelEdit");
const testCasesContainer = document.getElementById("testCases");

let testCases = JSON.parse(localStorage.getItem("testCases")) || [];

let nextTestCaseNumber =
  Number(localStorage.getItem("nextTestCaseNumber")) || 1;

let editingTestCaseId = null;

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

            <button onclick="editTestCase('${testCase.id}')">
                Edit
            </button>

            <button onclick="deleteTestCase('${testCase.id}')">
                Delete
            </button>
        `;

    testCasesContainer.appendChild(testCaseElement);
  });
}

// Add or update a test case
addTestCaseButton.addEventListener("click", function () {
  const title = document.getElementById("title").value.trim();
  const steps = document.getElementById("steps").value.trim();
  const expectedResult = document.getElementById("expectedResult").value.trim();

  if (!title || !steps || !expectedResult) {
    alert("Please enter title, steps and expected result.");
    return;
  }

  // Update existing test case
  if (editingTestCaseId) {
    const testCase = testCases.find(
      (testCase) => testCase.id === editingTestCaseId,
    );

    if (testCase) {
      testCase.title = title;
      testCase.steps = steps;
      testCase.expectedResult = expectedResult;
    }

    localStorage.setItem("testCases", JSON.stringify(testCases));

    resetForm();
    displayTestCases();

    return;
  }

  // Create new test case
  const testCase = {
    id: generateTestCaseId(),
    title: title,
    steps: steps,
    expectedResult: expectedResult,
  };

  testCases.push(testCase);

  localStorage.setItem("testCases", JSON.stringify(testCases));

  displayTestCases();

  resetForm();
});

// Edit a test case
function editTestCase(id) {
  const testCase = testCases.find((testCase) => testCase.id === id);

  if (!testCase) {
    return;
  }

  document.getElementById("title").value = testCase.title;
  document.getElementById("steps").value = testCase.steps;
  document.getElementById("expectedResult").value =
    testCase.expectedResult || "";

  editingTestCaseId = id;

  addTestCaseButton.textContent = "Update Test Case";
  cancelEditButton.style.display = "inline-block";
}

// Cancel editing
cancelEditButton.addEventListener("click", function () {
  resetForm();
});

// Delete a test case
function deleteTestCase(id) {
  testCases = testCases.filter((testCase) => testCase.id !== id);

  localStorage.setItem("testCases", JSON.stringify(testCases));

  displayTestCases();

  if (editingTestCaseId === id) {
    resetForm();
  }
}

// Reset the form
function resetForm() {
  document.getElementById("title").value = "";
  document.getElementById("steps").value = "";
  document.getElementById("expectedResult").value = "";

  editingTestCaseId = null;

  addTestCaseButton.textContent = "Add Test Case";
  cancelEditButton.style.display = "none";
}

// Display existing test cases when page loads
displayTestCases();
