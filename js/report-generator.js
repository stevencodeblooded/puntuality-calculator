/**
 * Report Generator for Punctuality Profit Calculator
 * Creates a downloadable PDF report with calculation results
 */

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize report generator when needed
  // Function is called from ui-handlers.js
});

/**
 * Generate a PDF report with the calculation results
 */
function generatePDFReport() {
  // Make sure jsPDF is loaded
  if (typeof window.jspdf === "undefined") {
    console.error("jsPDF library not loaded");
    addJspdfDynamically(function () {
      generatePDFReport();
    });
    return;
  }

  // Get the current date for the report
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString();

  // Create a new PDF document
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Check if calculator has results
  if (!calculator.results || !calculator.results.annualLoss) {
    console.error("No calculation results to generate report");
    return;
  }

  // Format numbers for display
  const formatNumber = (num) => Math.round(num).toLocaleString();
  const formatDecimal = (num) => num.toFixed(1);

  // Get results and inputs
  const results = calculator.results;
  const inputs = calculator.inputs;

  // Get user contact info if available
  const contactInfo = JSON.parse(
    localStorage.getItem("userContactInfo") || "{}"
  );
  const userName = contactInfo.name || "Contractor";
  const businessName =
    contactInfo.businessName !== "Not provided"
      ? contactInfo.businessName
      : userName + "'s Business";

  // Set up document properties
  doc.setProperties({
    title: "Punctuality Profit Report",
    subject: "Punctuality Profit Analysis",
    author: "By Contractors, For Contractors",
    keywords: "punctuality, profit, contractor, analysis",
    creator: "Punctuality Profit Calculator",
  });

  // Add header
  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235); // Primary color
  doc.text("PUNCTUALITY PROFIT REPORT", 105, 20, {
    align: "center",
  });

  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139); // Medium color
  doc.text(`Prepared exclusively for ${userName}`, 105, 28, {
    align: "center",
  });
  doc.text(`Generated on ${dateString}`, 105, 34, { align: "center" });

  // Add divider line
  doc.setDrawColor(226, 232, 240); // Light color
  doc.setLineWidth(0.5);
  doc.line(20, 40, 190, 40);

  // Add executive summary
  doc.setFontSize(14);
  doc.setTextColor(220, 38, 38); // Error color
  doc.text("EXECUTIVE SUMMARY", 20, 50);

  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105); // Medium-dark color
  doc.text(
    `This report provides a comprehensive analysis of the financial impact of punctuality`,
    20,
    58
  );
  doc.text(
    `issues on your business. Based on your inputs, ${businessName} could recapture`,
    20,
    64
  );
  doc.text(
    `approximately $${formatNumber(
      results.annualLoss
    )} in annual revenue through improved appointment management.`,
    20,
    70
  );

  // Add financial exposure highlight
  doc.setFillColor(239, 68, 68); // Red
  doc.setDrawColor(220, 38, 38); // Darker red
  doc.roundedRect(20, 80, 170, 35, 3, 3, "FD");

  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255); // White
  doc.text("YOUR FINANCIAL EXPOSURE", 105, 90, { align: "center" });

  doc.setFontSize(18);
  doc.setFont(undefined, "bold");
  doc.text(
    `Annual Profit Incinerated: $${formatNumber(results.annualLoss)}`,
    105,
    100,
    { align: "center" }
  );
  doc.setFont(undefined, "normal");

  doc.setFontSize(12);
  doc.text(
    `Five-Year Financial Inferno: $${formatNumber(results.fiveYearLoss)}`,
    105,
    110,
    { align: "center" }
  );

  // Add company metrics section
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59); // Dark color
  doc.text("YOUR BUSINESS METRICS", 20, 130);

  // Create a table for inputs
  const inputsTableBody = [
    ["Average Job Value:", `$${formatNumber(inputs.averageJobValue)}`],
    ["Appointments Per Week:", inputs.appointmentsPerWeek],
    ["Current Close Rate:", `${inputs.currentCloseRate}%`],
    ["Callback Rate for Late Appointments:", `${inputs.callbackRate}%`],
    ["Appointments You Arrive Late To:", `${inputs.latenessPercentage}%`],
  ];

  doc.autoTable({
    startY: 135,
    body: inputsTableBody,
    theme: "plain",
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 90, fontStyle: "bold" },
      1: { cellWidth: 60, halign: "right" },
    },
  });

  // Add loss breakdown section
  const finalY = doc.previousAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59); // Dark color
  doc.text("PROFIT LOSS BREAKDOWN", 20, finalY);

  // Create a table for loss breakdown
  const breakdownTableBody = [
    ["Lost Contracts:", `$${formatNumber(results.annualLostRevenue)}`],
    ["Callback Costs:", `$${formatNumber(results.annualCallbackCost)}`],
    ["Lost Referrals:", `$${formatNumber(results.annualReferralCost)}`],
  ];

  doc.autoTable({
    startY: finalY + 5,
    body: breakdownTableBody,
    theme: "plain",
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 90, fontStyle: "bold" },
      1: { cellWidth: 60, halign: "right" },
    },
  });

  // Add real-time burn rates
  const finalY2 = doc.previousAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59); // Dark color
  doc.text("YOUR MONEY IS BURNING IN REAL-TIME", 20, finalY2);

  // Create a table for burn rates
  const burnRatesTableBody = [
    ["Hourly Burn Rate:", `$${formatNumber(results.hourlyBurnRate)}`],
    ["Daily Burn Rate:", `$${formatNumber(results.dailyBurnRate)}`],
    ["Weekly Burn Rate:", `$${formatNumber(results.weeklyLoss)}`],
  ];

  doc.autoTable({
    startY: finalY2 + 5,
    body: burnRatesTableBody,
    theme: "plain",
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 90, fontStyle: "bold" },
      1: { cellWidth: 60, halign: "right" },
    },
  });

  // Add opportunity cost section - add a new page
  doc.addPage();

  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59); // Dark color
  doc.text("WHAT THIS MONEY COULD BUY INSTEAD", 20, 20);

  // Create a table for opportunity costs
  const opportunityTableBody = [
    ["Family Vacations:", `${formatNumber(results.vacationsLost)}`],
    ["Truck Payments:", `${formatNumber(results.truckPaymentsLost)} months`],
    ["Tool Budget:", `$${formatNumber(results.toolBudgetLost)}`],
  ];

  doc.autoTable({
    startY: 25,
    body: opportunityTableBody,
    theme: "plain",
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 90, fontStyle: "bold" },
      1: { cellWidth: 60, halign: "right" },
    },
  });

  // Add retirement impact
  const finalY3 = doc.previousAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59); // Dark color
  doc.text("YOUR LONG-TERM OPPORTUNITY COST", 20, finalY3);

  // Create retirement highlight box
  doc.setFillColor(37, 99, 235); // Primary color blue
  doc.setDrawColor(29, 78, 216); // Primary dark
  doc.roundedRect(20, finalY3 + 5, 170, 35, 3, 3, "FD");

  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255); // White
  doc.text(
    "If you invested your annual punctuality losses at 7% interest for 20 years:",
    105,
    finalY3 + 20,
    { align: "center" }
  );

  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.text(
    `Retirement Value: $${formatNumber(results.retirementValue)}`,
    105,
    finalY3 + 32,
    { align: "center" }
  );
  doc.setFont(undefined, "normal");

  // Add competitive edge section
  const finalY4 = finalY3 + 50;
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59); // Dark color
  doc.text("YOUR COMPETITIVE EDGE OPPORTUNITY", 20, finalY4);

  // Create edge comparison
  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105); // Medium-dark color
  doc.text("Current Annual Revenue:", 40, finalY4 + 15);
  doc.text(`$${formatNumber(results.currentRevenue)}`, 170, finalY4 + 15, {
    align: "right",
  });

  doc.text("Potential Revenue with Punctuality:", 40, finalY4 + 25);
  doc.setTextColor(22, 163, 74); // Green
  doc.setFont(undefined, "bold");
  doc.text(`$${formatNumber(results.potentialRevenue)}`, 170, finalY4 + 25, {
    align: "right",
  });
  doc.setFont(undefined, "normal");

  doc.setTextColor(71, 85, 105); // Medium-dark color
  doc.text("Revenue Increase:", 40, finalY4 + 35);
  doc.setTextColor(22, 163, 74); // Green
  doc.setFont(undefined, "bold");
  doc.text(
    `${formatDecimal(results.revenuePercentIncrease)}%`,
    170,
    finalY4 + 35,
    { align: "right" }
  );
  doc.setFont(undefined, "normal");

  // Add the revolution section
  const finalY5 = finalY4 + 50;
  doc.setFontSize(14);
  doc.setTextColor(22, 163, 74); // Green
  doc.text("JOIN THE PUNCTUALITY REVOLUTION", 20, finalY5);

  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105); // Medium-dark color
  doc.text(
    "The Punctuality Revolution is a national movement of contractors committed to transforming",
    20,
    finalY5 + 10
  );
  doc.text(
    'the industry through exceptional service standards. By implementing the "Insanely Great',
    20,
    finalY5 + 18
  );
  doc.text(
    'Appointment System", contractors are recapturing lost profits and gaining competitive advantage.',
    20,
    finalY5 + 26
  );

  // Add CTA
  doc.setFillColor(22, 163, 74); // Green
  doc.setDrawColor(21, 128, 61); // Darker green
  doc.roundedRect(40, finalY5 + 35, 130, 35, 3, 3, "FD");

  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255); // White
  doc.text("APPLY FOR 1 OF 5 SPOTS NOW", 105, finalY5 + 50, {
    align: "center",
  });

  doc.setFontSize(12);
  doc.text("www.ByContractorsForContractors.com", 105, finalY5 + 62, {
    align: "center",
  });

  // Add footer
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // Medium color
  doc.text(
    "This report is based on industry research and your specific inputs. Individual results may vary.",
    105,
    280,
    { align: "center" }
  );
  doc.text(
    "© 2025 By Contractors, For Contractors. All rights reserved.",
    105,
    285,
    { align: "center" }
  );

  // Save the PDF
  const fileName = `Punctuality_Profit_Report_${dateString.replace(
    /\//g,
    "-"
  )}.pdf`;
  doc.save(fileName);
}

/**
 * Dynamically add jsPDF library if not present
 * @param {Function} callback - Function to call after library is loaded
 */
function addJspdfDynamically(callback) {
  // Add jsPDF
  const jsPdfScript = document.createElement("script");
  jsPdfScript.src =
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
  jsPdfScript.onload = function () {
    // Add AutoTable plugin after jsPDF is loaded
    const autoTableScript = document.createElement("script");
    autoTableScript.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js";
    autoTableScript.onload = callback;
    document.head.appendChild(autoTableScript);
  };
  document.head.appendChild(jsPdfScript);
}
