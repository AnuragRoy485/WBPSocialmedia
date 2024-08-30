// scripts.js

let caseIdCounter = 1;
const violations = {}; // Object to store violations by username

document.getElementById("reportForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const reporterName = document.getElementById("reporterName").value;
  const username = document.getElementById("username").value;
  const designation = document.getElementById("designation").value;
  const violationDescription = document.getElementById("violation").value;
  const link = document.getElementById("link").value;

  const platform = detectPlatform(link);
  const timestamp = generateTimestamp(); // Get current date and time in IST

  // Check if username already exists
  if (violations[username]) {
    // Update existing entry
    updateExistingViolation(
      username,
      reporterName,
      designation,
      violationDescription,
      link,
      platform,
      timestamp
    );
  } else {
    // Create a new violation
    const caseId = generateCaseId();
    addViolation(
      caseId,
      reporterName,
      username,
      designation,
      violationDescription,
      link,
      platform,
      timestamp
    );
    violations[username] = caseId; // Store the case ID for the username
  }

  // Clear the form fields after submission
  document.getElementById("reporterName").value = "";
  document.getElementById("username").value = "";
  document.getElementById("designation").value = "Constable"; // Reset to default
  document.getElementById("violation").value = "";
  document.getElementById("link").value = "";
});

function generateCaseId() {
  return `CASE-${caseIdCounter++}`;
}

function detectPlatform(link) {
  if (link.includes("facebook.com")) return "Facebook";
  if (link.includes("twitter.com") || link.includes("x.com"))
    return "Twitter (X)";
  if (link.includes("instagram.com")) return "Instagram";
  if (link.includes("youtube.com") || link.includes("youtu.be"))
    return "YouTube";
  return "Other";
}

function generateTimestamp() {
  const now = new Date();
  const options = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  };
  const istDate = new Intl.DateTimeFormat("en-GB", options).format(now);
  return istDate;
}

function addViolation(
  caseId,
  reporterName,
  designation,
  username,
  description,
  link,
  platform,
  timestamp
) {
  const violationList = document.getElementById("violationList");

  const li = document.createElement("li");
  li.innerHTML = `
        <div>
            <p><strong>Case ID:</strong> <span class="case-id">${caseId}</span></p>
            <p><strong>Reporting Person's Name:</strong> <span class="reporter-name">${reporterName}</span></p>
            <p><strong>Designation:</strong> <span class="username">${username}</span></p>
            <p><strong>Username:</strong> <span class="designation">${designation}</span></p>
            <p><strong>Violation:</strong> <span class="violation">${description}</span></p>
            <p><strong>Link:</strong> <a href="${link}" class="link" target="_blank">${link}</a></p>
            <p><strong>Platform:</strong> <span class="platform">${platform}</span></p>
            <p><strong>Timestamp:</strong> <span class="timestamp">${timestamp}</span> <span class="edited-label" style="display:none;">(Edited)</span></p>
        </div>
        <div>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        </div>
    `;

  // Edit Button
  li.querySelector(".edit").addEventListener("click", function () {
    const currentCaseId = li.querySelector(".case-id").textContent;
    const newCaseId = prompt("Edit Case ID:", currentCaseId);

    const currentReporterName = li.querySelector(".reporter-name").textContent;
    const newReporterName = prompt(
      "Edit Reporting Person's Name:",
      currentReporterName
    );

    const currentUsername = li.querySelector(".username").textContent;
    const newUsername = prompt("Edit Username:", currentUsername);

    const currentDesignation = li.querySelector(".designation").textContent;
    const newDesignation = prompt("Edit Designation:", currentDesignation);

    const currentDescription = li.querySelector(".violation").textContent;
    const newDescription = prompt(
      "Edit Violation Description:",
      currentDescription
    );

    const currentLink = li.querySelector(".link").textContent;
    const newLink = prompt("Edit Link:", currentLink);
    const newPlatform = detectPlatform(newLink); // Detect platform based on new link

    const currentPlatform = li.querySelector(".platform").textContent;
    const newPlatformName = prompt("Edit Platform:", currentPlatform);

    const currentTimestamp = li.querySelector(".timestamp").textContent;
    const newTimestamp = generateTimestamp(); // Generate new timestamp on edit

    if (newCaseId !== null) {
      li.querySelector(".case-id").textContent = newCaseId;
    }
    if (newReporterName !== null) {
      li.querySelector(".reporter-name").textContent = newReporterName;
    }
    if (newUsername !== null) {
      li.querySelector(".username").textContent = newUsername;
    }
    if (newDesignation !== null) {
      li.querySelector(".designation").textContent = newDesignation;
    }
    if (newDescription !== null) {
      li.querySelector(".violation").textContent = newDescription;
    }
    if (newLink !== null) {
      li.querySelector(".link").textContent = newLink;
      li.querySelector(".link").href = newLink;
    }
    if (newPlatformName !== null) {
      li.querySelector(".platform").textContent = newPlatformName;
    } else {
      li.querySelector(".platform").textContent = newPlatform; // Update platform if name is not edited
    }
    if (newTimestamp !== null) {
      li.querySelector(".timestamp").textContent = newTimestamp;
      li.querySelector(".edited-label").style.display = "inline"; // Show "Edited" label
    }
  });

  // Delete Button
  li.querySelector(".delete").addEventListener("click", function () {
    if (confirm("Are you sure you want to delete this violation?")) {
      li.remove();
      delete violations[username]; // Remove entry from violations object
    }
  });

  violationList.appendChild(li);
}

function updateExistingViolation(
  username,
  reporterName,
  designation,
  description,
  newLink,
  platform,
  timestamp
) {
  const violationList = document.getElementById("violationList");
  const existingLi = Array.from(violationList.children).find(
    (li) => li.querySelector(".username").textContent === username
  );

  if (existingLi) {
    const existingLink = existingLi.querySelector(".link").textContent;
    const existingPlatform = existingLi.querySelector(".platform").textContent;

    existingLi.querySelector(
      ".link"
    ).textContent = `${existingLink}, ${newLink}`;
    existingLi.querySelector(".link").href = `${existingLink}, ${newLink}`; // Update the href if necessary
    existingLi.querySelector(
      ".platform"
    ).textContent = `${existingPlatform}, ${platform}`;

    existingLi.querySelector(".violation").textContent = description;
    existingLi.querySelector(".timestamp").textContent = timestamp;
    existingLi.querySelector(".edited-label").style.display = "inline"; // Show "Edited" label
  }
}
