/**
 * Enhanced UI handlers for the Punctuality Profit Calculator
 * Added PDF report viewing and Google Sheets integration
 */

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Step navigation
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const step3 = document.getElementById("step3");
  const progressIndicator = document.querySelector(".progress-indicator");
  const stepIndicators = document.querySelectorAll(".step");

  // Input elements
  const averageJobValueInput = document.getElementById("averageJobValue");
  const averageJobValueDisplay = document.getElementById(
    "averageJobValueDisplay"
  );
  const appointmentsPerWeekInput = document.getElementById(
    "appointmentsPerWeek"
  );
  const appointmentsPerWeekDisplay = document.getElementById(
    "appointmentsPerWeekDisplay"
  );
  const currentCloseRateInput = document.getElementById("currentCloseRate");
  const currentCloseRateDisplay = document.getElementById(
    "currentCloseRateDisplay"
  );
  const callbackRateInput = document.getElementById("callbackRate");
  const callbackRateDisplay = document.getElementById("callbackRateDisplay");
  const latenessPercentageInput = document.getElementById("latenessPercentage");
  const latenessPercentageDisplay = document.getElementById(
    "latenessPercentageDisplay"
  );
  const premiumToggle = document.getElementById("premiumToggle");
  const premiumRevenue = document.getElementById("premiumRevenue");
  const premiumRevenueValue = document.getElementById("premiumRevenueValue");

  // Navigation buttons
  const step1NextButton = document.getElementById("step1Next");
  const step2BackButton = document.getElementById("step2Back");
  const calculateButton = document.getElementById("calculateButton");
  const step3BackButton = document.getElementById("step3Back");
  const recalculateButton = document.getElementById("recalculateButton");
  const downloadReportButton = document.getElementById("downloadReportButton");
  const fixThisButton = document.getElementById("fixThisButton");

  // Modal elements
  const downloadModal = document.getElementById("downloadModal");
  const closeModal = document.querySelector(".close-modal");
  const downloadForm = document.getElementById("downloadForm");

  // Results elements
  const resultsContainer = document.querySelector(".results-container");
  const calculationAnimation = document.querySelector(".calculation-animation");
  const annualLossValue = document.getElementById("annualLossValue");
  const weeklyLossValue = document.getElementById("weeklyLossValue");
  const fiveYearLossValue = document.getElementById("fiveYearLossValue");
  const annualLossCard = document.getElementById("annualLossCard");
  const hourlyBurnRate = document.getElementById("hourlyBurnRate");
  const dailyBurnRate = document.getElementById("dailyBurnRate");
  const weeklyBurnRate = document.getElementById("weeklyBurnRate");
  const lostRevenueValue = document.getElementById("lostRevenueValue");
  const callbackCostValue = document.getElementById("callbackCostValue");
  const referralCostValue = document.getElementById("referralCostValue");
  const retirementValue = document.getElementById("retirementValue");
  const vacationCount = document.getElementById("vacationCount");
  const truckPayments = document.getElementById("truckPayments");
  const toolBudget = document.getElementById("toolBudget");
  const currentRevenueValue = document.getElementById("currentRevenueValue");
  const potentialRevenueValue = document.getElementById(
    "potentialRevenueValue"
  );
  const revenuePercentIncrease = document.getElementById(
    "revenuePercentIncrease"
  );

  // Create PDF viewer modal elements
  createPdfViewerModal();

  // Initialize tooltips
  initTooltips();

  // Initialize input event listeners
  initInputListeners();

  // Initialize navigation button listeners
  initNavigationListeners();

  // Initialize modal
  initModal();

  /**
   * Submit form data via email using an iframe approach to prevent page reload
   * @param {Object} formData - User contact information
   */
  function submitViaEmail(formData) {
    // Get calculator results
    const results = calculator.results;

    try {
      // Create a formatted message with all the data
      const subject = `Punctuality Calculator Submission - ${formData.name}`;

      // Create an invisible iframe to target the form submission
      const iframe = document.createElement("iframe");
      iframe.name = "hidden_iframe";
      iframe.id = "hidden_iframe";
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      // Create a hidden form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://formsubmit.co/a2e38c53e1da86ac501ca72ce49d6490"; // Your Formspree ID
      form.style.display = "none";
      form.target = "hidden_iframe"; // This is the key - target the form submission to the iframe

      // Formspree configuration
      appendFormField(form, "_subject", subject);
      appendFormField(form, "_template", "table"); // Uses a nice HTML table format
      appendFormField(form, "_captcha", "false"); // Disable captcha

      // Add contact info
      appendFormField(form, "name", formData.name);
      appendFormField(form, "email", formData.email);
      appendFormField(form, "phone", formData.phone);
      appendFormField(form, "businessName", formData.businessName);
      appendFormField(form, "city", formData.city);

      // Add calculation inputs
      appendFormField(
        form,
        "averageJobValue",
        `$${calculator.inputs.averageJobValue}`
      );
      appendFormField(
        form,
        "appointmentsPerWeek",
        calculator.inputs.appointmentsPerWeek
      );
      appendFormField(
        form,
        "currentCloseRate",
        `${calculator.inputs.currentCloseRate}%`
      );
      appendFormField(
        form,
        "callbackRate",
        `${calculator.inputs.callbackRate}%`
      );
      appendFormField(
        form,
        "latenessPercentage",
        `${calculator.inputs.latenessPercentage}%`
      );

      // Add calculation results
      appendFormField(
        form,
        "annualLoss",
        `$${Math.round(results.annualLoss).toLocaleString()}`
      );
      appendFormField(
        form,
        "weeklyLoss",
        `$${Math.round(results.weeklyLoss).toLocaleString()}`
      );
      appendFormField(
        form,
        "dailyBurnRate",
        `$${Math.round(results.dailyBurnRate).toLocaleString()}`
      );

      // Don't need _next with iframe approach - form submits in iframe, no redirect happens

      // Append form to document
      document.body.appendChild(form);

      // Show PDF viewer immediately - don't wait for form submission
      showPdfViewer();

      // Show notification
      showNotification("Your custom report is ready to view!");

      // Listen for iframe load event to know when form submission completes
      iframe.onload = function () {
        console.log("Form submitted successfully");

        // Clean up the form and iframe after submission
        setTimeout(() => {
          if (document.body.contains(form)) document.body.removeChild(form);
          if (document.body.contains(iframe)) document.body.removeChild(iframe);
        }, 1000);
      };

      // Submit the form
      form.submit();
    } catch (error) {
      console.error("Form submission error:", error);
      showNotification(
        "There was an issue sending your information. Please try again."
      );

      // Still show the PDF viewer even if there's an error with the email submission
      showPdfViewer();
    }
  }

  /**
   * Helper function to append form fields
   * @param {HTMLFormElement} form - The form element
   * @param {string} name - Field name
   * @param {string|number} value - Field value
   */
  function appendFormField(form, name, value) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value || "";
    form.appendChild(input);
  }

  /**
   * Enhanced PDF viewer modal creation
   * Improves rendering for download and print functionality
   */
  function createPdfViewerModal() {
    // Create PDF viewer modal if it doesn't exist
    if (!document.getElementById("pdfViewerModal")) {
      const pdfModal = document.createElement("div");
      pdfModal.id = "pdfViewerModal";
      pdfModal.className = "modal pdf-modal";

      pdfModal.innerHTML = `
      <div class="modal-content pdf-modal-content">
        <span class="close-modal" id="closePdfModal">&times;</span>
        <h2>Your Punctuality Profit Report</h2>
        <div class="pdf-controls">
          <button id="downloadPdfButton" class="pdf-button">
            <i class="fas fa-download"></i> Download PDF
          </button>
          <button id="printPdfButton" class="pdf-button">
            <i class="fas fa-print"></i> Print
          </button>
        </div>
        <div class="pdf-container" id="pdfContainer">
          <!-- PDF content will be loaded here -->
        </div>
      </div>
    `;

      document.body.appendChild(pdfModal);

      // Add event listeners for the PDF modal
      document
        .getElementById("closePdfModal")
        .addEventListener("click", function () {
          pdfModal.classList.remove("show");
        });

      document
        .getElementById("downloadPdfButton")
        .addEventListener("click", function () {
          // Generate and download PDF
          generateAndDownloadPDF();
        });

      document
        .getElementById("printPdfButton")
        .addEventListener("click", function () {
          // Print the PDF content
          printReport();
        });

      // Close modal when clicking outside
      window.addEventListener("click", function (event) {
        if (event.target === pdfModal) {
          pdfModal.classList.remove("show");
        }
      });

      // Add improved CSS for PDF viewer modal with better print support
      const style = document.createElement("style");
      style.textContent = `
      .pdf-modal .modal-content {
        width: 90%;
        max-width: 1000px;
        max-height: 90vh;
        padding: 20px;
        overflow: hidden;
      }
      
      .pdf-container {
        overflow-y: auto;
        max-height: calc(90vh - 120px);
        margin-top: 20px;
        padding: 0;
        background-color: #f5f5f5;
        box-sizing: border-box;
      }
      
      .pdf-controls {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 10px;
      }
      
      .pdf-button {
        background-color: #2563eb;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 14px;
        font-weight: 500;
      }
      
      .pdf-button:hover {
        background-color: #1d4ed8;
      }
      
      .report-page {
        background-color: white;
        margin-bottom: 20px;
        padding: 0.5in;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        width: 8.5in;
        min-height: 11in;
        margin-left: auto;
        margin-right: auto;
        box-sizing: border-box;
        page-break-after: always;
        position: relative;
      }
      
      .report-page:last-child {
        page-break-after: auto;
      }
      
      /* Fix for image handling */
      .report-page img {
        max-width: 100%;
        height: auto;
      }
      
      @media print {
        body * {
          visibility: hidden;
        }
        
        #pdfViewerModal, #pdfViewerModal * {
          visibility: visible;
        }
        
        #pdfViewerModal {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        
        .pdf-modal .modal-content {
          width: 100% !important;
          max-width: none !important;
          max-height: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        .pdf-container {
          max-height: none !important;
          overflow: visible !important;
          padding: 0 !important;
          margin: 0 !important;
          background-color: white !important;
        }
        
        .report-page {
          margin: 0 !important;
          page-break-after: always;
          box-shadow: none !important;
        }
        
        .report-page:last-child {
          page-break-after: auto;
        }
        
        .pdf-controls, .close-modal, h2 {
          display: none !important;
        }
      }
    `;

      document.head.appendChild(style);
    }
  }

  /**
   * Initialize tooltip functionality
   */
  function initTooltips() {
    const tooltips = document.querySelectorAll(".tooltip");

    tooltips.forEach((tooltip) => {
      const icon = tooltip.querySelector("i");
      const text = tooltip.querySelector(".tooltiptext");

      // Show tooltip on hover or focus (for accessibility)
      icon.addEventListener("mouseover", () => {
        text.style.visibility = "visible";
        text.style.opacity = "1";
      });

      icon.addEventListener("mouseout", () => {
        text.style.visibility = "hidden";
        text.style.opacity = "0";
      });

      icon.addEventListener("focus", () => {
        text.style.visibility = "visible";
        text.style.opacity = "1";
      });

      icon.addEventListener("blur", () => {
        text.style.visibility = "hidden";
        text.style.opacity = "0";
      });
    });
  }

  /**
   * Initialize input listeners
   */
  function initInputListeners() {
    // Average job value input
    averageJobValueInput.addEventListener("input", function () {
      averageJobValueDisplay.textContent = Number(this.value).toLocaleString();
      updateBurningAnimation();
    });

    // Appointments per week input
    appointmentsPerWeekInput.addEventListener("input", function () {
      appointmentsPerWeekDisplay.textContent = this.value;
      updateBurningAnimation();
    });

    // Current close rate slider
    currentCloseRateInput.addEventListener("input", function () {
      currentCloseRateDisplay.textContent = this.value;
      updateBurningAnimation();
    });

    // Callback rate slider
    callbackRateInput.addEventListener("input", function () {
      callbackRateDisplay.textContent = this.value;
      updateBurningAnimation();
    });

    // Lateness percentage slider
    latenessPercentageInput.addEventListener("input", function () {
      latenessPercentageDisplay.textContent = this.value;
      updateBurningAnimation();
    });

    // Premium toggle
    premiumToggle.addEventListener("change", function () {
      if (this.checked) {
        // Calculate premium revenue
        const inputValues = {
          averageJobValue: parseInt(averageJobValueInput.value),
          appointmentsPerWeek: parseInt(appointmentsPerWeekInput.value),
          currentCloseRate: parseInt(currentCloseRateInput.value),
          callbackRate: parseInt(callbackRateInput.value),
          latenessPercentage: parseInt(latenessPercentageInput.value),
        };

        calculator.setInputs(inputValues);
        const premiumRevenueAmount = calculator.calculatePremiumRevenue();

        // Update premium revenue display
        premiumRevenueValue.textContent =
          Math.round(premiumRevenueAmount).toLocaleString();
        premiumRevenue.classList.remove("hidden");
      } else {
        premiumRevenue.classList.add("hidden");
      }
    });
  }

  /**
   * Initialize navigation button listeners
   */
  function initNavigationListeners() {
    // Step 1 Next button
    step1NextButton.addEventListener("click", function () {
      goToStep(2);
    });

    // Step 2 Back button
    step2BackButton.addEventListener("click", function () {
      goToStep(1);
    });

    // Calculate button
    calculateButton.addEventListener("click", function () {
      goToStep(3);
      startCalculation();
    });

    // Step 3 Back button
    step3BackButton.addEventListener("click", function () {
      goToStep(2);
    });

    // Recalculate button
    recalculateButton.addEventListener("click", function () {
      goToStep(1);
    });

    // Download Report button
    downloadReportButton.addEventListener("click", function () {
      openModal();
    });

    // Fix This Now button
    fixThisButton.addEventListener("click", function () {
      window.open(
        "https://www.ByContractorsForContractors.com/punctuality-pledge",
        "_blank"
      );

      // Create notification
      showNotification("Redirecting you to the Punctuality Revolution...");
    });
  }

  /**
   * Initialize modal functionality
   */
  function initModal() {
    // Close modal when X is clicked
    closeModal.addEventListener("click", function () {
      downloadModal.classList.remove("show");
    });

    // Close modal when clicking outside the modal content
    window.addEventListener("click", function (event) {
      if (event.target === downloadModal) {
        downloadModal.classList.remove("show");
      }
    });

    // Form submission
    downloadForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Get form data
      const formData = {
        name: document.getElementById("userName").value,
        email: document.getElementById("userEmail").value,
        phone: document.getElementById("userPhone").value,
        businessName:
          document.getElementById("businessName").value || "Not provided",
        city: document.getElementById("city").value,
      };

      // Save form data to local storage
      localStorage.setItem("userContactInfo", JSON.stringify(formData));

      // Close download modal
      downloadModal.classList.remove("show");

      // Submit data via email (this now handles showing the PDF viewer)
      submitViaEmail(formData);

      // Note: No need to call showPdfViewer() or showNotification() here
      // as they're now handled inside submitViaEmail()
    });
  }

  /**
   * Open the download modal
   */
  function openModal() {
    // Populate the form with saved data if available
    const savedContactInfo = localStorage.getItem("userContactInfo");
    if (savedContactInfo) {
      const contactInfo = JSON.parse(savedContactInfo);
      document.getElementById("userName").value = contactInfo.name || "";
      document.getElementById("userEmail").value = contactInfo.email || "";
      document.getElementById("userPhone").value = contactInfo.phone || "";
      document.getElementById("city").value = contactInfo.city || "";
      document.getElementById("businessName").value =
        contactInfo.businessName !== "Not provided"
          ? contactInfo.businessName
          : "";
    }

    // Show the modal
    downloadModal.classList.add("show");
  }

  /**
   * Submit form data to Google Sheet
   * @param {Object} formData - User contact information
   */
  function submitToGoogleSheet(formData) {
    // Get calculator results
    const results = calculator.results;

    try {
      // Google Sheet Web App URL - Replace with your deployed Google Apps Script web app URL
      const scriptURL =
        "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

      // Create form data to send
      const dataToSend = new FormData();

      // Add contact info
      dataToSend.append("name", formData.name);
      dataToSend.append("email", formData.email);
      dataToSend.append("phone", formData.phone);
      dataToSend.append("businessName", formData.businessName);
      dataToSend.append("city", formData.city);

      // Add calculation results
      dataToSend.append("submitDate", new Date().toISOString());
      dataToSend.append("averageJobValue", calculator.inputs.averageJobValue);
      dataToSend.append(
        "appointmentsPerWeek",
        calculator.inputs.appointmentsPerWeek
      );
      dataToSend.append("currentCloseRate", calculator.inputs.currentCloseRate);
      dataToSend.append("callbackRate", calculator.inputs.callbackRate);
      dataToSend.append(
        "latenessPercentage",
        calculator.inputs.latenessPercentage
      );
      dataToSend.append("annualLoss", results.annualLoss);
      dataToSend.append("weeklyLoss", results.weeklyLoss);

      // Send the data using fetch
      fetch(scriptURL, { method: "POST", body: dataToSend })
        .then((response) => console.log("Success!", response))
        .catch((error) => console.error("Error!", error.message));
    } catch (error) {
      console.log("Form submission error:", error);
    }
  }

  /**
   * Show PDF viewer with report content
   */
  function showPdfViewer() {
    const pdfModal = document.getElementById("pdfViewerModal");
    const pdfContainer = document.getElementById("pdfContainer");

    try {
      // Get user information
      const savedContactInfo = localStorage.getItem("userContactInfo");
      let userInfo = {
        name: "Contractor",
        businessName: "Your Company",
        city: "Your City",
      };

      if (savedContactInfo) {
        const contactInfo = JSON.parse(savedContactInfo);
        userInfo.name = contactInfo.name || "Contractor";
        userInfo.businessName =
          contactInfo.businessName !== "Not provided"
            ? contactInfo.businessName
            : "Your Company";
        userInfo.city = contactInfo.city || "Your City";
      }

      // Get calculation results
      const results = calculator.results;

      // Create the complete HTML report using the same function from report-generator.js
      const reportHTML = createCompleteReportHTML(userInfo, results);

      // Insert into PDF container
      pdfContainer.innerHTML = reportHTML;

      // Show modal
      pdfModal.classList.add("show");
    } catch (error) {
      console.error("Error generating report preview:", error);
      showNotification(
        "Error loading report preview. Please try downloading the PDF directly."
      );
    }
  }

  /**
   * Replace placeholders in the template with actual values
   * @param {string} html - The HTML template
   * @returns {string} - The updated HTML
   */
  function replacePlaceholders(html) {
    // Get user info
    const userInfo = JSON.parse(
      localStorage.getItem("userContactInfo") || "{}"
    );
    const results = calculator.results;

    // Replace placeholders with actual values
    let updatedHtml = html
      .replace(/\[Name\]/g, userInfo.name || "Valued Contractor")
      .replace(/\[COMPANY NAME\]/g, userInfo.businessName || "Your Company")
      .replace(/\[city\]/g, userInfo.city || "your city");

    // Replace financial values
    updatedHtml = updatedHtml
      .replace(
        /\[\$XX,XXX\]/g,
        `$${Math.round(results.annualLoss).toLocaleString()}`
      )
      .replace(
        /\[\$X,XXX\]/g,
        `$${Math.round(results.annualLoss / 12).toLocaleString()}`
      )
      .replace(
        /\[\$XXX\]/g,
        `$${Math.round(results.dailyBurnRate).toLocaleString()}`
      );

    return updatedHtml;
  }

  /**
   * Generate and download the PDF report
   */

  function generateAndDownloadPDF() {
    // Simply call the enhanced PDF generator
    generatePDFReport();
  }

  /**
   * Create a loading spinner for PDF generation
   * @returns {HTMLElement} The loading spinner element
   */
  function createLoadingSpinner() {
    const spinner = document.createElement("div");
    spinner.className = "pdf-loading-spinner";
    spinner.innerHTML = `
    <div class="spinner-overlay"></div>
    <div class="spinner-container">
      <div class="spinner"></div>
      <p>Generating your PDF...</p>
    </div>
  `;

    // Add inline styles
    const style = document.createElement("style");
    style.textContent = `
    .pdf-loading-spinner {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10000;
    }
    .spinner-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }
    .spinner-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      text-align: center;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      margin: 0 auto 10px;
      animation: spin 2s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .spinner-container p {
      margin: 0;
      color: #333;
      font-weight: bold;
    }
  `;
    document.head.appendChild(style);

    return spinner;
  }

  /**
   * Prepare content for PDF generation
   * Apply temporary fixes to improve rendering
   * @param {HTMLElement} element - The container element
   */
  function prepareContentForPDF(element) {
    // Store original styles to restore later
    element.dataset.originalOverflow = element.style.overflow || "";
    element.dataset.originalHeight = element.style.height || "";
    element.dataset.originalPosition = element.style.position || "";

    // Apply styles that help with PDF generation
    element.style.overflow = "visible";
    element.style.height = "auto";
    element.style.position = "relative";

    // Find all report pages
    const reportPages = element.querySelectorAll(".report-page");

    // Ensure each page has explicit page breaks
    reportPages.forEach((page, index) => {
      // Store original styles
      page.dataset.originalPageBreak = page.style.pageBreakAfter || "";

      // Set explicit page break after each page except the last
      if (index < reportPages.length - 1) {
        page.style.pageBreakAfter = "always";
      }

      // Ensure proper sizing and margins
      page.style.width = "8.5in";
      page.style.minHeight = "11in";
      page.style.boxSizing = "border-box";
      page.style.position = "relative";
      page.style.overflow = "hidden";
    });

    // Fix image loading issues
    const images = element.querySelectorAll("img");
    images.forEach((img) => {
      if (!img.complete) {
        img.loading = "eager"; // Force eager loading
      }
    });
  }

  /**
   * Restore content styles after PDF generation
   * @param {HTMLElement} element - The container element
   */
  function restoreContentAfterPDF(element) {
    // Restore original styles
    element.style.overflow = element.dataset.originalOverflow || "";
    element.style.height = element.dataset.originalHeight || "";
    element.style.position = element.dataset.originalPosition || "";

    // Find all report pages and restore them
    const reportPages = element.querySelectorAll(".report-page");
    reportPages.forEach((page) => {
      // Restore original page break style
      page.style.pageBreakAfter = page.dataset.originalPageBreak || "";
    });
  }

  /**
   * Print the report with improved handling
   */
  function printReport() {
    // Get the content container
    const element = document.getElementById("pdfContainer");

    // Prepare the content for printing
    prepareContentForPrinting(element);

    // Use a timeout to ensure styles are applied
    setTimeout(() => {
      // Open print dialog
      window.print();

      // Restore content after short delay to allow print dialog to open
      setTimeout(() => {
        restoreContentAfterPrinting(element);
      }, 1000);
    }, 100);
  }

  /**
   * Prepare content for printing
   * @param {HTMLElement} element - The container element
   */
  function prepareContentForPrinting(element) {
    // Create a style element for print-specific styles
    const printStyles = document.createElement("style");
    printStyles.id = "print-specific-styles";
    printStyles.textContent = `
    @media print {
      body * {
        visibility: hidden;
      }
      #pdfViewerModal, #pdfViewerModal * {
        visibility: visible;
      }
      #pdfViewerModal {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
      .pdf-modal .modal-content {
        width: 100% !important;
        max-width: none !important;
        max-height: none !important;
        padding: 0 !important;
        box-shadow: none !important;
      }
      .pdf-container {
        max-height: none !important;
        overflow: visible !important;
      }
      .report-page {
        page-break-after: always;
        margin: 0 !important;
        padding: 0.5in !important;
        box-shadow: none !important;
      }
      .report-page:last-child {
        page-break-after: auto;
      }
      .pdf-controls, .close-modal {
        display: none !important;
      }
      h2 {
        display: none !important;
      }
    }
  `;
    document.head.appendChild(printStyles);

    // Apply same fixes as PDF generation
    prepareContentForPDF(element);
  }

  /**
   * Restore content after printing
   * @param {HTMLElement} element - The container element
   */
  function restoreContentAfterPrinting(element) {
    // Remove print styles
    const printStyles = document.getElementById("print-specific-styles");
    if (printStyles) {
      document.head.removeChild(printStyles);
    }

    // Restore content
    restoreContentAfterPDF(element);
  }

  /**
   * Show a notification message
   * @param {string} message - The message to display
   */
  function showNotification(message) {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;

    // Add notification to the page
    document.body.appendChild(notification);

    // Show notification with animation
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Remove notification after a delay
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  }

  /**
   * Navigate to a specific step
   * @param {number} stepNumber - The step number to navigate to
   */
  function goToStep(stepNumber) {
    // Hide all steps
    step1.classList.remove("active");
    step2.classList.remove("active");
    step3.classList.remove("active");

    // Show the selected step
    if (stepNumber === 1) {
      step1.classList.add("active");
      progressIndicator.style.width = "33.33%";
    } else if (stepNumber === 2) {
      step2.classList.add("active");
      progressIndicator.style.width = "66.66%";
    } else if (stepNumber === 3) {
      step3.classList.add("active");
      progressIndicator.style.width = "100%";
    }

    // Update step indicators
    stepIndicators.forEach((indicator) => {
      const step = parseInt(indicator.getAttribute("data-step"));

      if (step < stepNumber) {
        indicator.classList.add("completed");
        indicator.classList.remove("active");
      } else if (step === stepNumber) {
        indicator.classList.add("active");
        indicator.classList.remove("completed");
      } else {
        indicator.classList.remove("active");
        indicator.classList.remove("completed");
      }
    });
  }

  /**
   * Update the burning money animation based on input values
   */
  function updateBurningAnimation() {
    // Get input values
    const jobValue = parseInt(averageJobValueInput.value);
    const appointments = parseInt(appointmentsPerWeekInput.value);
    const latenessPercent = parseInt(latenessPercentageInput.value);

    // Calculate potential loss (very simplified)
    const potentialLoss =
      (jobValue * appointments * (latenessPercent / 100)) / 4; // Divide by 4 to scale down

    // Get the flames elements
    const flamesContainer = document.querySelector(".flames-container");
    const flame1 = document.querySelector(".flame-1");
    const flame2 = document.querySelector(".flame-2");
    const flame3 = document.querySelector(".flame-3");

    if (!flame1 || !flame2 || !flame3) {
      return; // Early return if elements don't exist
    }

    // Update flames intensity based on potential loss
    if (potentialLoss < 1000) {
      flame1.style.height = "30px";
      flame2.style.height = "40px";
      flame3.style.height = "25px";
      flame1.style.opacity = "0.5";
      flame2.style.opacity = "0.6";
      flame3.style.opacity = "0.5";
    } else if (potentialLoss < 5000) {
      flame1.style.height = "40px";
      flame2.style.height = "60px";
      flame3.style.height = "35px";
      flame1.style.opacity = "0.6";
      flame2.style.opacity = "0.7";
      flame3.style.opacity = "0.6";
    } else if (potentialLoss < 10000) {
      flame1.style.height = "60px";
      flame2.style.height = "80px";
      flame3.style.height = "55px";
      flame1.style.opacity = "0.8";
      flame2.style.opacity = "0.9";
      flame3.style.opacity = "0.8";
    } else {
      flame1.style.height = "80px";
      flame2.style.height = "100px";
      flame3.style.height = "75px";
      flame1.style.opacity = "0.9";
      flame2.style.opacity = "1";
      flame3.style.opacity = "0.9";
    }

    // Also affect the money bills
    const moneyBills = document.querySelectorAll(".money-bill");
    if (moneyBills.length > 0) {
      // Make the money bills move faster with higher values
      const animationDuration = Math.max(0.5, 3 - potentialLoss / 10000); // Between 0.5s and 3s
      moneyBills.forEach((bill) => {
        bill.style.animationDuration = `${animationDuration}s`;
      });
    }
  }

  /**
   * Start the calculation process
   */
  function startCalculation() {
    // Show calculation animation
    calculationAnimation.style.display = "flex";
    resultsContainer.style.display = "none";

    // Collect input values
    const inputValues = {
      averageJobValue: parseInt(averageJobValueInput.value),
      appointmentsPerWeek: parseInt(appointmentsPerWeekInput.value),
      currentCloseRate: parseInt(currentCloseRateInput.value),
      callbackRate: parseInt(callbackRateInput.value),
      latenessPercentage: parseInt(latenessPercentageInput.value),
    };

    // Set input values and calculate results
    calculator.setInputs(inputValues);
    const results = calculator.calculate();

    // Save results to local storage
    calculator.saveResults();

    // Simulate calculation time for better UX (3 seconds)
    setTimeout(() => {
      // Hide calculation animation and show results
      calculationAnimation.style.display = "none";
      resultsContainer.style.display = "block";

      // Update results in the UI with animations
      updateResultsUI(results);
    }, 3000);
  }

  /**
   * Update the results UI with calculated values
   * @param {Object} results - The calculation results
   */
  function updateResultsUI(results) {
    // Format numbers for display
    const formatNumber = (num) => Math.round(num).toLocaleString();
    const formatDecimal = (num) => num.toFixed(1);

    // Update total cost with animation
    const totalCostElement = document.querySelector(".total-cost");
    totalCostElement.classList.add("animate");

    // Update annual loss values
    annualLossValue.textContent = formatNumber(results.annualLoss);
    annualLossCard.textContent = formatNumber(results.annualLoss);

    // Update cost breakdown items with sequential animations
    setTimeout(() => {
      lostRevenueValue.textContent = formatNumber(results.annualLostRevenue);
      document.querySelectorAll(".loss-item")[0].classList.add("animate");
    }, 200);

    setTimeout(() => {
      callbackCostValue.textContent = formatNumber(results.annualCallbackCost);
      document.querySelectorAll(".loss-item")[1].classList.add("animate");
    }, 400);

    setTimeout(() => {
      referralCostValue.textContent = formatNumber(results.annualReferralCost);
      document.querySelectorAll(".loss-item")[2].classList.add("animate");
    }, 600);

    // Update burn rates
    setTimeout(() => {
      hourlyBurnRate.textContent = formatNumber(results.hourlyBurnRate);
      dailyBurnRate.textContent = formatNumber(results.dailyBurnRate);
      weeklyBurnRate.textContent = formatNumber(results.weeklyLoss);
    }, 800);

    // Update comparison metrics
    setTimeout(() => {
      weeklyLossValue.textContent = formatNumber(results.weeklyLoss);
      document.querySelectorAll(".metric-card")[0].classList.add("animate");
    }, 1000);

    setTimeout(() => {
      // Annual loss already updated
      document.querySelectorAll(".metric-card")[1].classList.add("animate");
    }, 1200);

    setTimeout(() => {
      fiveYearLossValue.textContent = formatNumber(results.fiveYearLoss);
      document.querySelectorAll(".metric-card")[2].classList.add("animate");
    }, 1400);

    // Update opportunity cost
    setTimeout(() => {
      vacationCount.textContent = formatNumber(results.vacationsLost);
      truckPayments.textContent = formatNumber(results.truckPaymentsLost);
      toolBudget.textContent = formatNumber(results.toolBudgetLost);

      document.querySelectorAll(".opportunity-item").forEach((item) => {
        item.classList.add("animate");
      });
    }, 1600);

    // Update retirement value
    setTimeout(() => {
      retirementValue.textContent = formatNumber(results.retirementValue);
      document.querySelector(".retirement-value").classList.add("animate");
    }, 1800);

    // Update competitive edge
    setTimeout(() => {
      currentRevenueValue.textContent = formatNumber(results.currentRevenue);
      potentialRevenueValue.textContent = formatNumber(
        results.potentialRevenue
      );
      revenuePercentIncrease.textContent = formatDecimal(
        results.revenuePercentIncrease
      );

      document.querySelector(".current-revenue").classList.add("animate");
      document.querySelector(".potential-revenue").classList.add("animate");
    }, 2000);

    // Initialize the chart
    setTimeout(() => {
      initChart(results.lossBreakdown);
    }, 1000);
  }

  /**
   * Initialize the loss breakdown chart
   * @param {Array} lossBreakdown - Array of loss breakdown items
   */
  function initChart(lossBreakdown) {
    // If there's an existing chart, destroy it first
    if (window.lossChart) {
      window.lossChart.destroy();
    }

    // Get the canvas context
    const ctx = document.getElementById("lossBreakdownChart").getContext("2d");

    // Prepare data for the chart
    const labels = lossBreakdown.map((item) => item.label);
    const data = lossBreakdown.map((item) => item.value);
    const colors = lossBreakdown.map((item) => item.color);

    // Create the chart
    window.lossChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colors,
            borderColor: "white",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              font: {
                size: 12,
              },
              color: "#475569",
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.raw;
                const percentage = (
                  (value / context.dataset.data.reduce((a, b) => a + b, 0)) *
                  100
                ).toFixed(1);
                return `${label}: ${Math.round(
                  value
                ).toLocaleString()} (${percentage}%)`;
              },
            },
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 2000,
          easing: "easeOutQuart",
        },
        cutout: "60%",
      },
    });

    // Add class for animation
    document.querySelector(".chart-container").classList.add("chart-animate");
  }

  // Check if there are saved results to restore
  if (calculator.loadResults()) {
    // If there are saved results, offer to restore them
    const restorePrompt = document.createElement("div");
    restorePrompt.className = "restore-prompt";
    restorePrompt.innerHTML = `
      <div class="restore-message">
        <i class="fas fa-history"></i>
        <p>We found your previous calculation. Would you like to restore it?</p>
        <div class="restore-buttons">
          <button class="restore-yes">Yes, restore</button>
          <button class="restore-no">No, start fresh</button>
        </div>
      </div>
    `;

    // Add restore prompt to the page
    document.body.appendChild(restorePrompt);

    // Show restore prompt with animation
    setTimeout(() => {
      restorePrompt.classList.add("show");
    }, 500);

    // Handle restore prompt buttons
    restorePrompt
      .querySelector(".restore-yes")
      .addEventListener("click", function () {
        // Restore the saved values
        const inputs = calculator.inputs;

        // Update UI with saved values
        averageJobValueInput.value = inputs.averageJobValue;
        averageJobValueDisplay.textContent = Number(
          inputs.averageJobValue
        ).toLocaleString();

        appointmentsPerWeekInput.value = inputs.appointmentsPerWeek;
        appointmentsPerWeekDisplay.textContent = inputs.appointmentsPerWeek;

        currentCloseRateInput.value = inputs.currentCloseRate;
        currentCloseRateDisplay.textContent = inputs.currentCloseRate;

        callbackRateInput.value = inputs.callbackRate;
        callbackRateDisplay.textContent = inputs.callbackRate;

        latenessPercentageInput.value = inputs.latenessPercentage;
        latenessPercentageDisplay.textContent = inputs.latenessPercentage;

        // Go to the results page and show the results
        goToStep(3);

        // Show calculation animation briefly
        calculationAnimation.style.display = "flex";
        resultsContainer.style.display = "none";

        // Short delay to simulate recalculation
        setTimeout(() => {
          calculationAnimation.style.display = "none";
          resultsContainer.style.display = "block";

          // Update results in the UI
          updateResultsUI(calculator.results);
        }, 1000);

        // Remove restore prompt
        restorePrompt.classList.remove("show");
        setTimeout(() => {
          document.body.removeChild(restorePrompt);
        }, 500);
      });

    restorePrompt
      .querySelector(".restore-no")
      .addEventListener("click", function () {
        // Remove saved data
        localStorage.removeItem("punctualityInputs");
        localStorage.removeItem("punctualityResults");

        // Remove restore prompt
        restorePrompt.classList.remove("show");
        setTimeout(() => {
          document.body.removeChild(restorePrompt);
        }, 500);
      });
  }

  // Update burning animation on initial load
  updateBurningAnimation();

  // Load necessary libraries dynamically
  loadLibraries();
});

/**
 * Load necessary third-party libraries
 */
function loadLibraries() {
  // Load html2pdf.js if not already loaded
  if (typeof html2pdf === "undefined") {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    document.body.appendChild(script);
  }
}
