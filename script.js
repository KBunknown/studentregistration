document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registration-form");

  // Form Elements
  const sameAsPhoneCheckbox = document.getElementById("sameAsPhone");
  const phoneInput = document.getElementById("phoneNumber");
  const whatsappInput = document.getElementById("whatsappNumber");

  const programmeSelect = document.getElementById("programme");
  const otherProgrammeGroup = document.getElementById("otherProgrammeGroup");
  const otherProgrammeInput = document.getElementById("otherProgramme");

  const levelSelect = document.getElementById("level");
  const expectedGradYearPanel = document.getElementById("expectedGradYear");

  // Navigation Elements
  const stepRegistration = document.getElementById("step-registration");
  const stepReview = document.getElementById("step-review");
  const stepSuccess = document.getElementById("step-success");

  // Action Buttons
  const btnEdit = document.getElementById("btn-edit");
  const btnSubmit = document.getElementById("btn-submit");

  // Application State
  let registrationData = {};

  // --- Interactive Logic ---

  // WhatsApp same as phone sync
  sameAsPhoneCheckbox.addEventListener("change", (e) => {
    if (e.target.checked) {
      whatsappInput.value = phoneInput.value;
      whatsappInput.readOnly = true;
      whatsappInput.style.backgroundColor = "rgba(28, 101, 201, 0.05)";
    } else {
      whatsappInput.readOnly = false;
      whatsappInput.style.backgroundColor = ""; // Reset to CSS default
    }
  });

  phoneInput.addEventListener("input", () => {
    if (sameAsPhoneCheckbox.checked) {
      whatsappInput.value = phoneInput.value;
    }
  });

  // Conditional "Other" Programme field
  programmeSelect.addEventListener("change", (e) => {
    if (e.target.value === "Other Program") {
      otherProgrammeGroup.style.display = "flex";
      otherProgrammeInput.required = true;
    } else {
      otherProgrammeGroup.style.display = "none";
      otherProgrammeInput.required = false;
      otherProgrammeInput.value = "";
    }
  });

  // Expected Graduation Year Automatic Calculation
  levelSelect.addEventListener("change", (e) => {
    const level = parseInt(e.target.value, 10);
    if (!isNaN(level)) {
      const currentYear = new Date().getFullYear();
      // Assuming typical 4-year undergraduate progression
      const yearsRemaining = 4 - level / 100 + 1;
      const gradYear = currentYear + yearsRemaining;

      expectedGradYearPanel.textContent = gradYear;
      expectedGradYearPanel.dataset.year = gradYear;
    } else {
      expectedGradYearPanel.textContent = "--";
      delete expectedGradYearPanel.dataset.year;
    }
  });

  // --- Navigation & State Transitions ---

  // 1. Submit Form -> Review Step
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent standard form submission

    // Harvest all form data into our state object
    registrationData = {
      fullName: document.getElementById("fullName").value.trim(),
      gender: document.getElementById("gender").value,
      country: document.getElementById("country").value.trim(),
      email: document.getElementById("email").value.trim(),
      phoneNumber: phoneInput.value.trim(),
      whatsappNumber: whatsappInput.value.trim(),
      programme:
        programmeSelect.value === "Other Program"
          ? otherProgrammeInput.value.trim()
          : programmeSelect.value,
      indexNumber: document.getElementById("indexNumber").value.trim(),
      level: levelSelect.options[levelSelect.selectedIndex].text,
      expectedGradYear: expectedGradYearPanel.dataset.year || "--",
    };

    populateReview();
    showStep(stepReview);
  });

  // 2. Edit Information -> Registration Step
  btnEdit.addEventListener("click", () => {
    showStep(stepRegistration);
  });

  // 3. Confirm Submission -> Success Step
  btnSubmit.addEventListener("click", () => {
    // In a real application, an API call would happen here.
    // For this frontend assignment, we proceed directly to success.

    populateSuccess();
    showStep(stepSuccess);
  });

  // --- View Rendering ---

  function populateReview() {
    const reviewContent = document.getElementById("reviewContent");
    reviewContent.innerHTML = `
            <div class="review-section">
                <h3>Personal Information</h3>
                <div class="review-grid">
                    <div class="review-item">
                        <span class="review-label">Full Name</span>
                        <span class="review-value">${escapeHtml(registrationData.fullName)}</span>
                    </div>
                    <div class="review-item">
                        <span class="review-label">Gender</span>
                        <span class="review-value">${escapeHtml(registrationData.gender)}</span>
                    </div>
                    <div class="review-item">
                        <span class="review-label">Country</span>
                        <span class="review-value">${escapeHtml(registrationData.country)}</span>
                    </div>
                </div>
            </div>
            <div class="review-section">
                <h3>Contact Information</h3>
                <div class="review-grid">
                    <div class="review-item">
                        <span class="review-label">Email Address</span>
                        <span class="review-value">${escapeHtml(registrationData.email)}</span>
                    </div>
                    <div class="review-item">
                        <span class="review-label">Phone Number</span>
                        <span class="review-value">${escapeHtml(registrationData.phoneNumber)}</span>
                    </div>
                    <div class="review-item">
                        <span class="review-label">WhatsApp Number</span>
                        <span class="review-value">${escapeHtml(registrationData.whatsappNumber)}</span>
                    </div>
                </div>
            </div>
            <div class="review-section">
                <h3>Academic Information</h3>
                <div class="review-grid">
                    <div class="review-item">
                        <span class="review-label">Programme</span>
                        <span class="review-value">${escapeHtml(registrationData.programme)}</span>
                    </div>
                    <div class="review-item">
                        <span class="review-label">Index Number</span>
                        <span class="review-value">${escapeHtml(registrationData.indexNumber)}</span>
                    </div>
                    <div class="review-item">
                        <span class="review-label">Level</span>
                        <span class="review-value">${escapeHtml(registrationData.level)}</span>
                    </div>
                    <div class="review-item">
                        <span class="review-label">Expected Graduation Year</span>
                        <span class="review-value">${escapeHtml(registrationData.expectedGradYear)}</span>
                    </div>
                </div>
            </div>
        `;
  }

  function populateSuccess() {
    const successDetails = document.getElementById("successDetails");
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    successDetails.innerHTML = `
            <div class="review-item">
                <span class="review-label">Full Name</span>
                <span class="review-value">${escapeHtml(registrationData.fullName)}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Index Number</span>
                <span class="review-value">${escapeHtml(registrationData.indexNumber)}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Programme</span>
                <span class="review-value">${escapeHtml(registrationData.programme)}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Level</span>
                <span class="review-value">${escapeHtml(registrationData.level)}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Expected Graduation Year</span>
                <span class="review-value">${escapeHtml(registrationData.expectedGradYear)}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Registration Date</span>
                <span class="review-value">${formattedDate}</span>
            </div>
        `;
  }

  // --- Utilities ---

  function showStep(stepElement) {
    // Hide all steps
    document.querySelectorAll(".step").forEach((s) => s.classList.remove("active"));
    // Show target step
    stepElement.classList.add("active");
    // Scroll to top for better UX, particularly on mobile
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function escapeHtml(unsafe) {
    if (!unsafe) return "";
    return unsafe
      .toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
