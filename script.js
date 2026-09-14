const addTestCaseButton = document.getElementById("addTestCase");
const testCasesContainer = document.getElementById("testCases");

let testCases = JSON.parse(localStorage.getItem("testCases")) || [];

function displayTestCases() {
  testCasesContainer.innerHTML = "";

  testCases.forEach((testCase) => {
    const testCaseElement = document.createElement("div");
    testCaseElement.classList.add("test-case");

    testCaseElement.innerHTML = `
            <strong>${testCase.id}</strong>
            <h3>${testCase.title}</h3>
            <p>${testCase.steps}</p>
        `;

    testCasesContainer.appendChild(testCaseElement);
  });
}

addTestCaseButton.addEventListener("click", function () {
  const title = document.getElementById("title").value.trim();
  const steps = document.getElementById("steps").value.trim();

  if (!title || !steps) {
    alert("Please enter title and steps.");
    return;
  }

  const testCase = {
    id: `TC-${String(testCases.length + 1).padStart(3, "0")}`,
    title: title,
    steps: steps,
  };

  testCases.push(testCase);

  localStorage.setItem("testCases", JSON.stringify(testCases));

  displayTestCases();

  document.getElementById("title").value = "";
  document.getElementById("steps").value = "";
});

displayTestCases();
