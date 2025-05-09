/**
 * Punctuality Profit Calculator - PDF Report Generator
 * Generates a placeholder PDF report based on the calculator results
 * This is a temporary version until the client finalizes the template
 */

/**
 * Generate a placeholder PDF report
 */
function generatePDFReport() {
  // Check if jsPDF is available, if not, add script
  if (typeof jspdf === "undefined") {
    console.log("jsPDF not found. Adding script...");
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    document.body.appendChild(script);

    // Add autotable plugin
    const autoTableScript = document.createElement("script");
    autoTableScript.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js";
    document.body.appendChild(autoTableScript);

    // Load the fonts
    setTimeout(generatePlaceholderPDF, 1000);
  } else {
    generatePlaceholderPDF();
  }
}

/**
 * Generate a placeholder PDF instead of the full report
 * This function will be replaced when the client finalizes their template
 */
function generatePlaceholderPDF() {
  // Get user information from local storage
  const savedContactInfo = localStorage.getItem("userContactInfo");
  let userInfo = {
    name: "Contractor",
    email: "",
    phone: "",
    businessName: "Your Company",
    city: "Your City",
  };

  if (savedContactInfo) {
    const contactInfo = JSON.parse(savedContactInfo);
    userInfo.name = contactInfo.name || "Contractor";
    userInfo.email = contactInfo.email || "";
    userInfo.phone = contactInfo.phone || "";
    userInfo.businessName =
      contactInfo.businessName !== "Not provided"
        ? contactInfo.businessName
        : "Your Company";
    userInfo.city = contactInfo.city || "Your City";
  }

  // Get the calculation results
  const results = calculator.results;
  const inputs = calculator.inputs;

  // Format today's date
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Create the document
  const { jsPDF } = jspdf;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set document properties
  doc.setProperties({
    title: "Punctuality Profit Report",
    subject: "Punctuality Profit Calculator Results Summary",
    author: "By Contractors, For Contractors",
    keywords: "punctuality, profit, calculator, contractor",
  });

  // Define colors
  const primaryColor = [37, 99, 235]; // Blue
  const secondaryColor = [20, 184, 166]; // Teal
  const darkColor = [30, 41, 59]; // Dark slate

  // Default margins and positioning
  const margin = 20;
  const pageWidth = 210 - margin * 2; // A4 width minus margins
  const lineHeight = 7;
  let y = margin; // Starting y position

  // Helper functions for text styling
  function addHeading(text, y, size = 16) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(text, margin, y);
    return y + (size * 0.5) / 2;
  }

  function addSubheading(text, y, size = 14) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(text, margin, y);
    return y + (size * 0.5) / 2;
  }

  function addParagraph(text, y, size = 11) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);

    // Handle multi-line text
    const splitText = doc.splitTextToSize(text, pageWidth);
    doc.text(splitText, margin, y);
    return y + lineHeight * splitText.length;
  }

  function addBulletPoint(text, y, indent = 5, size = 11) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);

    // Add bullet point
    doc.text("•", margin, y);

    // Handle multi-line text with indent
    const splitText = doc.splitTextToSize(text, pageWidth - indent);
    doc.text(splitText, margin + indent, y);
    return y + lineHeight * splitText.length;
  }

  function formatCurrency(amount) {
    return "$" + Math.round(amount).toLocaleString();
  }

  // Start building the PDF
  y = addHeading("PUNCTUALITY PROFIT REPORT", y);
  y += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text("Prepared for: " + userInfo.name, margin, y);
  y += lineHeight;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Company: " + userInfo.businessName, margin, y);
  y += lineHeight;

  doc.text("City: " + userInfo.city, margin, y);
  y += lineHeight;

  doc.text("Report Date: " + dateStr, margin, y);
  y += lineHeight * 2;

  // Executive summary
  y = addSubheading("EXECUTIVE SUMMARY", y);
  y += lineHeight;

  const executiveSummary =
    "Thank you for using the Punctuality Profit Calculator. Your detailed report is currently being finalized with the most up-to-date industry data and personalized recommendations based on your inputs. This placeholder report provides a summary of your key metrics.";
  y = addParagraph(executiveSummary, y);
  y += lineHeight;

  const dataNote =
    "Your contact information and calculation results have been saved. When the complete report template is finalized, you will receive a notification with access to your comprehensive analysis. This typically occurs within 1-2 business days.";
  y = addParagraph(dataNote, y);
  y += lineHeight * 2;

  // Key Metrics
  y = addSubheading("YOUR KEY METRICS", y);
  y += lineHeight;

  const metricData = [
    ["YOUR INPUTS", ""],
    ["Average Job Value", formatCurrency(inputs.averageJobValue)],
    ["Appointments Per Week", inputs.appointmentsPerWeek],
    ["Current Close Rate", inputs.currentCloseRate + "%"],
    ["Callback Rate", inputs.callbackRate + "%"],
    ["Late Appointment Percentage", inputs.latenessPercentage + "%"],
  ];

  doc.autoTable({
    body: metricData,
    startY: y,
    theme: "grid",
    styles: {
      font: "helvetica",
      cellPadding: 5,
      lineColor: [200, 200, 200],
    },
    columnStyles: {
      0: { fontStyle: "bold" },
    },
    headStyles: {
      fillColor: [37, 99, 235],
    },
  });

  y = doc.lastAutoTable.finalY + 10;

  // Financial Impact
  y = addSubheading("YOUR FINANCIAL IMPACT", y);
  y += lineHeight;

  const financialData = [
    ["FINANCIAL METRICS", ""],
    ["Weekly Profit Burned", formatCurrency(results.weeklyLoss)],
    ["Annual Profit Incinerated", formatCurrency(results.annualLoss)],
    ["Five-Year Financial Impact", formatCurrency(results.fiveYearLoss)],
    ["Lost Revenue Breakdown", ""],
    ["- Lost Contracts", formatCurrency(results.annualLostRevenue)],
    ["- Callback Costs", formatCurrency(results.annualCallbackCost)],
    ["- Lost Referrals", formatCurrency(results.annualReferralCost)],
  ];

  doc.autoTable({
    body: financialData,
    startY: y,
    theme: "grid",
    styles: {
      font: "helvetica",
      cellPadding: 5,
      lineColor: [200, 200, 200],
    },
    columnStyles: {
      0: { fontStyle: "bold" },
    },
    headStyles: {
      fillColor: [37, 99, 235],
    },
  });

  y = doc.lastAutoTable.finalY + 15;

  // Next Steps
  y = addSubheading("NEXT STEPS", y);
  y += lineHeight;

  y = addParagraph(
    "Your complete Punctuality Revolution Report will provide:",
    y
  );
  y += lineHeight;

  y = addBulletPoint("A comprehensive analysis of your financial exposure", y);
  y = addBulletPoint("Industry benchmarking against other contractors", y);
  y = addBulletPoint(
    "Detailed implementation timeline for the Insanely Great Appointment System",
    y
  );
  y = addBulletPoint("ROI projections for the first 30, 90, and 365 days", y);
  y = addBulletPoint(
    "Revolutionary benefits and credentials package information",
    y
  );
  y += lineHeight * 2;

  // Final call to action
  const ctaText =
    "Visit www.ByContractorsForContractors.com for more information about the Punctuality Revolution and how it can transform your business.";
  y = addParagraph(ctaText, y);
  y += lineHeight * 2;

  // Footer
  y = 267; // Position at the bottom of the page

  doc.setLineWidth(0.5);
  doc.line(margin, y - 7, 210 - margin, y - 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "This report is confidential and prepared exclusively for " +
      userInfo.name +
      ".",
    margin,
    y
  );
  y += 4;

  doc.text(
    "Your calculation results and contact information have been securely stored and will be used to",
    margin,
    y
  );
  y += 4;

  doc.text(
    "generate your comprehensive report. No further action is required at this time.",
    margin,
    y
  );
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    "© 2025 By Contractors, For Contractors | All Rights Reserved",
    margin,
    y
  );

  // Save the PDF
  const filename =
    "Punctuality_Profit_Summary_" +
    userInfo.businessName.replace(/\s+/g, "_") +
    ".pdf";
  doc.save(filename);

  // Simulate data submission
  simulateDataSubmission(userInfo, inputs, results);
}

/**
 * Simulate data submission to database
 * This is a placeholder function that will be replaced with actual data submission
 * @param {Object} userInfo - User contact information
 * @param {Object} inputs - Calculator inputs
 * @param {Object} results - Calculator results
 */
function simulateDataSubmission(userInfo, inputs, results) {
  // Simulate data submission
  const dataToSubmit = {
    submissionDate: new Date().toISOString(),
    userInfo: userInfo,
    calculatorInputs: inputs,
    calculatorResults: results,
  };

  console.log("Data prepared for submission:", dataToSubmit);
  console.log(
    "When the complete system is implemented, this data will be securely transmitted to the database for processing and generating the comprehensive report."
  );

  // Show a notification that data is being processed
  setTimeout(() => {
    showProcessingNotification();
  }, 2000);
}

/**
 * Show a notification that data is being processed
 */
function showProcessingNotification() {
  // Create notification element if it doesn't exist
  let notification = document.querySelector(".processing-notification");

  if (!notification) {
    notification = document.createElement("div");
    notification.className = "processing-notification";
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-server"></i>
        <p>Your data has been securely stored and is being processed. Your comprehensive report will be available soon.</p>
        <button class="close-notification">OK</button>
      </div>
    `;

    // Add styles
    const style = document.createElement("style");
    style.textContent = `
      .processing-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #f8fafc;
        border-left: 4px solid #2563eb;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 15px;
        max-width: 350px;
        z-index: 1000;
        border-radius: 4px;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      .notification-content {
        display: flex;
        align-items: start;
        gap: 10px;
      }
      .notification-content i {
        color: #2563eb;
        font-size: 1.2rem;
        margin-top: 2px;
      }
      .notification-content p {
        margin: 0;
        font-size: 0.9rem;
        color: #1e293b;
        flex: 1;
      }
      .close-notification {
        background-color: #2563eb;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
        margin-top: 10px;
        align-self: flex-end;
      }
      .processing-notification.show {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);

    // Add notification to the page
    document.body.appendChild(notification);

    // Add event listener to the close button
    const closeButton = notification.querySelector(".close-notification");
    closeButton.addEventListener("click", () => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    });
  }

  // Show notification with animation
  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  // Automatically hide notification after 8 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 8000);
}
