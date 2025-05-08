/**
 * UI handlers for the Punctuality Profit Calculator
 * Manages user interactions, form navigation, and updating the DOM
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

  // Initialize tooltips
  initTooltips();

  // Initialize input event listeners
  initInputListeners();

  // Initialize navigation button listeners
  initNavigationListeners();

  // Initialize modal
  initModal();

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
      window.open("https://www.ByContractorsForContractors.com", "_blank");

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
      };

      // Save form data to local storage
      localStorage.setItem("userContactInfo", JSON.stringify(formData));

      // Close modal
      downloadModal.classList.remove("show");

      // Generate report using report-generator.js
      generatePDFReport();

      // Show confirmation
      showNotification("Your custom report has been downloaded!");
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
      document.getElementById("businessName").value =
        contactInfo.businessName !== "Not provided"
          ? contactInfo.businessName
          : "";
    }

    // Show the modal
    downloadModal.classList.add("show");
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
});
