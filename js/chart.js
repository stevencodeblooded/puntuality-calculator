/**
 * Chart visualization logic for the Punctuality Profit Calculator
 * This file contains additional chart configuration and animation options
 */

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Chart configuration - extended options beyond what's in ui-handlers.js
  const chartConfig = {
    // Color palette for the chart (used in lossBreakdown)
    colors: {
      lostContracts: "#ef4444",
      callbackCosts: "#f97316",
      lostReferrals: "#8b5cf6",
    },

    // Chart animation settings
    animation: {
      duration: 2000,
      easing: "easeOutQuart",
    },

    // Chart size and styling
    style: {
      cutoutPercentage: 60,
      borderWidth: 2,
      hoverBorderWidth: 4,
    },
  };

  /**
   * Creates a custom tooltip with improved styling for Chart.js
   * @param {Object} chart - The Chart.js instance
   * @returns {HTMLElement} The tooltip element
   */
  function createCustomTooltip(chart) {
    const tooltipEl = document.createElement("div");
    tooltipEl.style.opacity = 0;
    tooltipEl.style.position = "absolute";
    tooltipEl.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    tooltipEl.style.color = "white";
    tooltipEl.style.borderRadius = "3px";
    tooltipEl.style.padding = "10px";
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.transform = "translate(-50%, 0)";
    tooltipEl.style.transition = "all .1s ease";

    const table = document.createElement("table");
    table.style.margin = "0px";

    tooltipEl.appendChild(table);
    chart.canvas.parentNode.appendChild(tooltipEl);

    return tooltipEl;
  }

  /**
   * Updates the custom tooltip content and position
   * @param {Object} chart - The Chart.js instance
   * @param {Object} tooltip - The tooltip data
   * @param {HTMLElement} tooltipEl - The tooltip element
   */
  function updateCustomTooltip(chart, tooltip, tooltipEl) {
    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    // Set Text
    if (tooltip.body) {
      const titleLines = tooltip.title || [];
      const bodyLines = tooltip.body.map((b) => b.lines);

      const tableHead = document.createElement("thead");

      titleLines.forEach((title) => {
        const tr = document.createElement("tr");
        tr.style.borderWidth = 0;

        const th = document.createElement("th");
        th.style.borderWidth = 0;
        th.style.fontSize = "16px";
        th.style.fontWeight = "bold";

        const text = document.createTextNode(title);

        th.appendChild(text);
        tr.appendChild(th);
        tableHead.appendChild(tr);
      });

      const tableBody = document.createElement("tbody");
      bodyLines.forEach((body, i) => {
        const colors = tooltip.labelColors[i];

        const tr = document.createElement("tr");
        tr.style.backgroundColor = "inherit";
        tr.style.borderWidth = 0;

        const td = document.createElement("td");
        td.style.borderWidth = 0;
        td.style.padding = "5px";

        const colorSquare = document.createElement("span");
        colorSquare.style.display = "inline-block";
        colorSquare.style.width = "12px";
        colorSquare.style.height = "12px";
        colorSquare.style.backgroundColor = colors.backgroundColor;
        colorSquare.style.borderRadius = "2px";
        colorSquare.style.marginRight = "8px";

        const text = document.createTextNode(body);

        td.appendChild(colorSquare);
        td.appendChild(text);
        tr.appendChild(td);
        tableBody.appendChild(tr);
      });

      const tableRoot = tooltipEl.querySelector("table");

      // Remove old children
      while (tableRoot.firstChild) {
        tableRoot.firstChild.remove();
      }

      // Add new children
      tableRoot.appendChild(tableHead);
      tableRoot.appendChild(tableBody);
    }

    // Position tooltip and set styles
    const position = chart.canvas.getBoundingClientRect();

    tooltipEl.style.opacity = 1;
    tooltipEl.style.left =
      position.left + window.scrollX + tooltip.caretX + "px";
    tooltipEl.style.top = position.top + window.scrollY + tooltip.caretY + "px";
    tooltipEl.style.fontSize = "14px";
    tooltipEl.style.fontFamily = chart.options.defaultFontFamily;
    tooltipEl.style.padding =
      tooltip.yPadding + "px " + tooltip.xPadding + "px";
  }

  /**
   * Creates and animates the loss breakdown chart using Chart.js
   * @param {Array} lossBreakdown - Array of loss breakdown items with values and colors
   * @param {string} chartId - The ID of the chart canvas element
   */
  function createAnimatedChart(lossBreakdown, chartId = "lossBreakdownChart") {
    // Get the chart canvas
    const chartCanvas = document.getElementById(chartId);
    if (!chartCanvas) return;

    // If there's an existing chart, destroy it first
    if (window.lossChart) {
      window.lossChart.destroy();
    }

    // Prepare data for the chart
    const labels = lossBreakdown.map((item) => item.label);
    const data = lossBreakdown.map((item) => item.value);
    const colors = lossBreakdown.map((item) => item.color);

    // Create the chart
    window.lossChart = new Chart(chartCanvas, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colors,
            borderColor: "white",
            borderWidth: chartConfig.style.borderWidth,
            hoverBorderWidth: chartConfig.style.hoverBorderWidth,
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
            enabled: false,
            external: function (context) {
              let tooltipEl = document.getElementById("chartjs-tooltip");

              // Create element if it doesn't exist
              if (!tooltipEl) {
                tooltipEl = createCustomTooltip(context.chart);
                tooltipEl.id = "chartjs-tooltip";
              }

              // Hide if no tooltip
              if (context.tooltip.opacity === 0) {
                tooltipEl.style.opacity = 0;
                return;
              }

              // Set tooltip content and position
              updateCustomTooltip(context.chart, context.tooltip, tooltipEl);
            },
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
          duration: chartConfig.animation.duration,
          easing: chartConfig.animation.easing,
        },
        cutout: `${chartConfig.style.cutoutPercentage}%`,
      },
    });

    // Add click event to toggle segment highlight
    chartCanvas.addEventListener("click", function (event) {
      const activePoints = window.lossChart.getElementsAtEventForMode(
        event,
        "nearest",
        { intersect: true },
        false
      );

      if (activePoints.length > 0) {
        const clickedIndex = activePoints[0].index;
        const dataset = window.lossChart.data.datasets[0];

        // Create highlight effect
        if (dataset._highlightedIndex !== undefined) {
          // Reset previous highlight
          dataset.backgroundColor[dataset._highlightedIndex] =
            dataset._originalColors[dataset._highlightedIndex];
        }

        // Store original colors if not already stored
        if (!dataset._originalColors) {
          dataset._originalColors = [...dataset.backgroundColor];
        }

        if (dataset._highlightedIndex === clickedIndex) {
          // If same segment clicked, remove highlight
          dataset._highlightedIndex = undefined;
        } else {
          // Highlight the clicked segment
          dataset._highlightedIndex = clickedIndex;
          const originalColor = dataset.backgroundColor[clickedIndex];

          // Create a brighter version of the color
          const brighterColor = pSBC(0.2, originalColor);
          dataset.backgroundColor[clickedIndex] = brighterColor;
        }

        window.lossChart.update();

        // Highlight corresponding item in the list
        document.querySelectorAll(".loss-item").forEach((item, index) => {
          if (index === clickedIndex) {
            item.classList.toggle("highlighted");
          } else {
            item.classList.remove("highlighted");
          }
        });
      }
    });
  }

  /**
   * Color manipulation utility - percent Shade Blend Convert
   * @param {number} p - Percentage (-1.0 to 1.0) of blend/shade
   * @param {string} c0 - From color
   * @param {string} c1 - To color (optional)
   * @param {boolean} l - Whether to log blending result
   * @returns {string} The resulting color
   */
  function pSBC(p, c0, c1, l) {
    let r,
      g,
      b,
      a,
      P,
      f,
      t,
      h,
      i = parseInt,
      m = Math.round,
      alpha = typeof c1 == "string";
    if (
      typeof p != "number" ||
      p < -1 ||
      p > 1 ||
      typeof c0 != "string" ||
      (c0[0] != "r" && c0[0] != "#") ||
      (c1 && !alpha)
    )
      return null;
    (h = c0.length > 9),
      (h = a = h ? c0.substring(7, 9) : ""),
      (c0 = c0.substring(0, 7)),
      (f = c0.substring(1)),
      (P = p < 0),
      (t = c1 && c1 != "c" ? c1.substring(1) : f),
      (i = P ? 0 : 255 * p);
    P = P ? 1 + p : 1 - p;
    if (h) {
      r = m(parseInt(f.substring(0, 2), 16) * P + i);
      g = m(parseInt(f.substring(2, 4), 16) * P + i);
      b = m(parseInt(f.substring(4, 6), 16) * P + i);
    } else {
      r = m(parseInt(f.substring(0, 2), 16) * P + i);
      g = m(parseInt(f.substring(2, 4), 16) * P + i);
      b = m(parseInt(f.substring(4, 6), 16) * P + i);
    }
    a = a ? "," + m(P * parseInt(a, 16) + i) : "";
    return (
      "#" +
      (
        0x1000000 +
        (r < 0 ? 0 : r) * 0x10000 +
        (g < 0 ? 0 : g) * 0x100 +
        (b < 0 ? 0 : b)
      )
        .toString(16)
        .slice(1) +
      a
    );
  }

  /**
   * Create animated flying money elements
   * Creates visual effect of money flying away
   */
  function createMoneyFlyAnimation() {
    const moneyContainer = document.querySelector(".burning-money-large");
    if (!moneyContainer) return;

    // Create flying money bills at intervals
    setInterval(() => {
      const moneyBill = document.createElement("i");
      moneyBill.className = "fas fa-money-bill-wave flying-money";

      // Random position and rotation
      const randomX = Math.random() * 200 - 100;
      const randomY = -100 - Math.random() * 100;
      const randomRotation = Math.random() * 90 - 45;

      moneyBill.style.setProperty("--fly-x", `${randomX}px`);
      moneyBill.style.setProperty("--fly-y", `${randomY}px`);
      moneyBill.style.setProperty("--fly-rotate", `${randomRotation}deg`);

      moneyContainer.appendChild(moneyBill);

      // Remove after animation completes
      setTimeout(() => {
        if (moneyContainer.contains(moneyBill)) {
          moneyContainer.removeChild(moneyBill);
        }
      }, 2000);
    }, 400);
  }

  // Expose chart functions to window for use in ui-handlers.js
  window.chartTools = {
    createAnimatedChart,
    chartConfig,
    createMoneyFlyAnimation,
  };

  // Start money animation if on calculation page
  if (document.querySelector(".calculation-animation")) {
    createMoneyFlyAnimation();
  }
});
