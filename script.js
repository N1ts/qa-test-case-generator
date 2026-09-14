const addTestCaseButton = document.getElementById("addTestCase");
const cancelEditButton = document.getElementById("cancelEdit");

const testCasesContainer = document.getElementById("testCases");

const searchInput = document.getElementById("searchInput");

const typeFilter = document.getElementById("typeFilter");
const priorityFilter = document.getElementById("priorityFilter");
const statusFilter = document.getElementById("statusFilter");

const clearFiltersButton = document.getElementById("clearFilters");

const resultsInfo = document.getElementById("resultsInfo");

// --------------------------------------------------
// Data
// --------------------------------------------------

let testCases = JSON.parse(localStorage.getItem("testCases")) || [];

let nextTestCaseNumber =
  Number(localStorage.getItem("nextTestCaseNumber")) || 1;

let editingTestCaseId = null;

// --------------------------------------------------
// Existing ID protection
// --------------------------------------------------

testCases.forEach((testCase) => {
  if (!testCase.id) {
    return;
  }

  const match = testCase.id.match(/TC-(\d+)/);

  if (match) {
    const number = Number(match[1]);

    if (number >= nextTestCaseNumber) {
      nextTestCaseNumber = number + 1;
    }
  }
});

localStorage.setItem("nextTestCaseNumber", nextTestCaseNumber);

// --------------------------------------------------
// Generate Test Case ID
// --------------------------------------------------

function generateTestCaseId() {
  const id = `TC-${String(nextTestCaseNumber).padStart(3, "0")}`;

  nextTestCaseNumber++;

  localStorage.setItem("nextTestCaseNumber", nextTestCaseNumber);

  return id;
}

// --------------------------------------------------
// Escape HTML
// --------------------------------------------------

function escapeHTML(value) {
  if (!value) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// --------------------------------------------------
// Get form values
// --------------------------------------------------

function getFormValues() {
  const title = document.getElementById("title").value.trim();

  const type = document.getElementById("type").value;

  const priority = document.getElementById("priority").value;

  const status = document.getElementById("status").value;

  const tags = document
    .getElementById("tags")
    .value.split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "");

  const steps = document.getElementById("steps").value.trim();

  const expectedResult = document.getElementById("expectedResult").value.trim();

  return {
    title,
    type,
    priority,
    status,
    tags,
    steps,
    expectedResult,
  };
}

// --------------------------------------------------
// Add / Update Test Case
// --------------------------------------------------

addTestCaseButton.addEventListener("click", function () {
  const data = getFormValues();

  // Validation

  if (!data.title || !data.steps || !data.expectedResult) {
    alert("Please enter title, steps and expected result.");

    return;
  }

  // --------------------------------------------------
  // Update existing test case
  // --------------------------------------------------

  if (editingTestCaseId) {
    const testCase = testCases.find(
      (testCase) => testCase.id === editingTestCaseId,
    );

    if (testCase) {
      testCase.title = data.title;
      testCase.type = data.type;
      testCase.priority = data.priority;
      testCase.status = data.status;
      testCase.tags = data.tags;
      testCase.steps = data.steps;
      testCase.expectedResult = data.expectedResult;
    }

    saveTestCases();

    resetForm();

    displayTestCases();

    return;
  }

  // --------------------------------------------------
  // Create new test case
  // --------------------------------------------------

  const testCase = {
    id: generateTestCaseId(),

    title: data.title,

    type: data.type,

    priority: data.priority,

    status: data.status,

    tags: data.tags,

    steps: data.steps,

    expectedResult: data.expectedResult,
  };

  testCases.push(testCase);

  saveTestCases();

  resetForm();

  displayTestCases();
});

// --------------------------------------------------
// Edit Test Case
// --------------------------------------------------

function editTestCase(id) {
  const testCase = testCases.find((testCase) => testCase.id === id);

  if (!testCase) {
    return;
  }

  document.getElementById("title").value = testCase.title || "";

  document.getElementById("type").value = testCase.type || "Functional";

  document.getElementById("priority").value = testCase.priority || "Medium";

  document.getElementById("status").value = testCase.status || "Ready";

  document.getElementById("tags").value = Array.isArray(testCase.tags)
    ? testCase.tags.join(", ")
    : "";

  document.getElementById("steps").value = testCase.steps || "";

  document.getElementById("expectedResult").value =
    testCase.expectedResult || "";

  editingTestCaseId = id;

  addTestCaseButton.textContent = "Update Test Case";

  cancelEditButton.style.display = "inline-block";

  document.getElementById("formHeading").textContent = `Edit ${id}`;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// --------------------------------------------------
// Cancel Edit
// --------------------------------------------------

cancelEditButton.addEventListener("click", function () {
  resetForm();
});

// --------------------------------------------------
// Delete Test Case
// --------------------------------------------------

function deleteTestCase(id) {
  const confirmed = confirm(`Are you sure you want to delete ${id}?`);

  if (!confirmed) {
    return;
  }

  testCases = testCases.filter((testCase) => testCase.id !== id);

  saveTestCases();

  if (editingTestCaseId === id) {
    resetForm();
  }

  displayTestCases();
}

// --------------------------------------------------
// Reset Form
// --------------------------------------------------

function resetForm() {
  document.getElementById("title").value = "";

  document.getElementById("type").value = "Functional";

  document.getElementById("priority").value = "Medium";

  document.getElementById("status").value = "Ready";

  document.getElementById("tags").value = "";

  document.getElementById("steps").value = "";

  document.getElementById("expectedResult").value = "";

  editingTestCaseId = null;

  addTestCaseButton.textContent = "Add Test Case";

  cancelEditButton.style.display = "none";

  document.getElementById("formHeading").textContent = "Create Test Case";
}

// --------------------------------------------------
// Save Data
// --------------------------------------------------

function saveTestCases() {
  localStorage.setItem("testCases", JSON.stringify(testCases));
}

// --------------------------------------------------
// Filtering
// --------------------------------------------------

function getFilteredTestCases() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const selectedType = typeFilter.value;

  const selectedPriority = priorityFilter.value;

  const selectedStatus = statusFilter.value;

  return testCases.filter((testCase) => {
    const title = testCase.title || "";

    const id = testCase.id || "";

    const tags = Array.isArray(testCase.tags) ? testCase.tags.join(" ") : "";

    const matchesSearch =
      !searchTerm ||
      id.toLowerCase().includes(searchTerm) ||
      title.toLowerCase().includes(searchTerm) ||
      tags.toLowerCase().includes(searchTerm);

    const matchesType =
      selectedType === "All" ||
      (testCase.type || "Functional") === selectedType;

    const matchesPriority =
      selectedPriority === "All" ||
      (testCase.priority || "Medium") === selectedPriority;

    const matchesStatus =
      selectedStatus === "All" ||
      (testCase.status || "Ready") === selectedStatus;

    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  });
}

// --------------------------------------------------
// Display Test Cases
// --------------------------------------------------

function displayTestCases() {
  testCasesContainer.innerHTML = "";

  const filteredTestCases = getFilteredTestCases();

  resultsInfo.textContent = `Showing ${filteredTestCases.length} of ${testCases.length} test case(s)`;

  if (filteredTestCases.length === 0) {
    testCasesContainer.innerHTML = `
            <div class="empty-state">

                <strong>No test cases found</strong>

                ${
                  testCases.length === 0
                    ? "Create your first test case above."
                    : "Try changing your search or filters."
                }

            </div>
        `;

    updateStatistics();

    return;
  }

  filteredTestCases.forEach((testCase) => {
    const type = testCase.type || "Functional";

    const priority = testCase.priority || "Medium";

    const status = testCase.status || "Ready";

    const tags = Array.isArray(testCase.tags) ? testCase.tags : [];

    const testCaseElement = document.createElement("div");

    testCaseElement.classList.add("test-case");

    const safeId = escapeHTML(testCase.id);

    const safeTitle = escapeHTML(testCase.title);

    const safeSteps = escapeHTML(testCase.steps);

    const safeExpectedResult = escapeHTML(
      testCase.expectedResult || "Not provided",
    );

    const tagHTML =
      tags.length > 0
        ? `
                    <div class="tags">

                        ${tags
                          .map(
                            (tag) => `
                            <span class="tag">
                                ${escapeHTML(tag)}
                            </span>
                        `,
                          )
                          .join("")}

                    </div>
                `
        : "";

    testCaseElement.innerHTML = `

            <div class="test-case-header">

                <div>

                    <div class="test-case-id">
                        ${safeId}
                    </div>

                    <h3>
                        ${safeTitle}
                    </h3>

                </div>


                <div class="badges">

                    <span class="badge type-badge">
                        ${escapeHTML(type)}
                    </span>

                    <span class="badge priority-${priority.toLowerCase()}">
                        ${escapeHTML(priority)}
                    </span>

                    <span class="badge status-${status.toLowerCase()}">
                        ${escapeHTML(status)}
                    </span>

                </div>

            </div>


            <div class="test-case-content">

                <div class="content-label">
                    Test Steps
                </div>

                <p>
                    ${safeSteps}
                </p>


                <div class="content-label">
                    Expected Result
                </div>

                <p>
                    ${safeExpectedResult}
                </p>


                ${
                  tags.length > 0
                    ? `
                            <div class="content-label">
                                Tags
                            </div>

                            ${tagHTML}
                        `
                    : ""
                }

            </div>


            <div class="test-case-actions">

                <button
                    class="secondary-button"
                    onclick="editTestCase('${escapeHTML(testCase.id)}')"
                >
                    Edit
                </button>


                <button
                    class="danger-button"
                    onclick="deleteTestCase('${escapeHTML(testCase.id)}')"
                >
                    Delete
                </button>

            </div>

        `;

    testCasesContainer.appendChild(testCaseElement);
  });

  updateStatistics();
}

// --------------------------------------------------
// Statistics
// --------------------------------------------------

function updateStatistics() {
  const total = testCases.length;

  const ready = testCases.filter(
    (testCase) => (testCase.status || "Ready") === "Ready",
  ).length;

  const automated = testCases.filter(
    (testCase) => (testCase.status || "Ready") === "Automated",
  ).length;

  const critical = testCases.filter(
    (testCase) => (testCase.priority || "Medium") === "Critical",
  ).length;

  document.getElementById("totalCount").textContent = total;

  document.getElementById("readyCount").textContent = ready;

  document.getElementById("automatedCount").textContent = automated;

  document.getElementById("criticalCount").textContent = critical;
}

// --------------------------------------------------
// Search
// --------------------------------------------------

searchInput.addEventListener("input", displayTestCases);

// --------------------------------------------------
// Filters
// --------------------------------------------------

typeFilter.addEventListener("change", displayTestCases);

priorityFilter.addEventListener("change", displayTestCases);

statusFilter.addEventListener("change", displayTestCases);

// --------------------------------------------------
// Clear Filters
// --------------------------------------------------

clearFiltersButton.addEventListener("click", function () {
  searchInput.value = "";

  typeFilter.value = "All";

  priorityFilter.value = "All";

  statusFilter.value = "All";

  displayTestCases();
});

// --------------------------------------------------
// Initial Load
// --------------------------------------------------

displayTestCases();
