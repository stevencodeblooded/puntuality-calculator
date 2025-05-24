/**
 * Enhanced UI handlers for the Punctuality Profit Calculator
 * Updated to show report in modal instead of direct download
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
  const reportViewModal = document.getElementById("reportViewModal");
  const closeModal = document.querySelector(".close-modal");
  const closeReportModal = document.querySelector(".close-report-modal");
  const downloadForm = document.getElementById("downloadForm");
  const printReportButton = document.getElementById("printReportButton");
  const reportContent = document.getElementById("reportContent");

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
   * Submit form data via email and show report in modal
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
      form.action = "https://formsubmit.co/a2e38c53e1da86ac501ca72ce49d6490";
      form.style.display = "none";
      form.target = "hidden_iframe";

      // Formspree configuration
      appendFormField(form, "_subject", subject);
      appendFormField(form, "_template", "table");
      appendFormField(form, "_captcha", "false");

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

      // Append form to document
      document.body.appendChild(form);

      // Show notification
      showNotification("Generating your personalized report...");

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

      // Show the report in modal after a short delay
      setTimeout(() => {
        showReportInModal(formData, results);
      }, 500);
    } catch (error) {
      console.error("Form submission error:", error);
      showNotification(
        "There was an issue sending your information, but your report is being generated."
      );

      // Still show the report even if there's an error with the email submission
      setTimeout(() => {
        showReportInModal(formData, results);
      }, 500);
    }
  }

  /**
   * Show the complete report in a modal
   * @param {Object} userInfo - User information
   * @param {Object} results - Calculator results
   */
  function showReportInModal(userInfo, results) {
    // Generate the report HTML
    const reportHTML = generateReportHTML(userInfo, results);

    // Insert the report into the modal
    reportContent.innerHTML = reportHTML;

    // Show the modal
    reportViewModal.classList.add("show");

    // Scroll to top of modal content
    reportContent.scrollTop = 0;

    showNotification("Your personalized report is ready!");
  }

  /**
   * Generate the complete HTML report content
   * @param {Object} userInfo - User information
   * @param {Object} results - Calculator results
   * @returns {string} HTML content for the report
   */
  function generateReportHTML(userInfo, results) {
    // Format the financial values
    const annualLoss = Math.round(results.annualLoss).toLocaleString();
    const monthlyLoss = Math.round(results.annualLoss / 12).toLocaleString();
    const dailyLoss = Math.round(results.dailyBurnRate).toLocaleString();
    const beforeDollars = Math.round(results.currentRevenue / 1000) + "K";
    const afterDollars = Math.round(results.potentialRevenue / 1000) + "K";

    return `
      <!-- PAGE 1 -->
      <div class="pdf-section">
        <div style="text-align: center; margin-bottom: 18px">
          <span style="background: #ffce54; color: #222; font-weight: 700; font-size: 1.45em; padding: 6px 20px 6px 20px; border-radius: 7px; display: inline-block;">
            Fixing The Trust Problem:
          </span>
        </div>
        <h1 style="text-align: center; color: #14316a; font-size: 1.4em; margin-top: 0; margin-bottom: 18px; font-weight: 700;">
          The Contractor's No-BS Fix for the Tardiness Trap
        </h1>
        <div style="text-align: center; font-weight: bold; letter-spacing: 0.02em; margin-bottom: 12px;">
          STOP LEAVING MONEY ON THE TABLE
        </div>
        <p>Hi <span style="font-weight: bold;">${userInfo.name}</span>, it's great to meet you.</p>
        <p>Here is your Confidential Financial report from the <em>"How Much Is Being Late Costing You?" calculator.</em></p>
        <h2 style="text-align: center; color: #14316a; font-size: 1.2em; margin: 15px 0 10px 0; letter-spacing: 0.03em;">
          THE REAL COST OF BEING LATE
        </h2>
        <p>Based on your calculator results, here's what punctuality problems are actually costing <span style="text-transform: uppercase;">${userInfo.businessName}</span>:</p>
        <div style="font-weight: bold; margin: 18px 0 6px 0">YOUR FINANCIAL BLEEDING:</div>
        <ul style="font-size: 1.13em; margin-left: 18px">
          <li><span style="color: #c00; font-weight: bold">${annualLoss}</span> walking out your door EVERY YEAR</li>
          <li>That's <span style="color: #c00; font-weight: bold">${monthlyLoss}</span> lost EVERY MONTH</li>
          <li><span style="color: #c00; font-weight: bold">${dailyLoss}</span> slipping away EVERY DAY you don't fix this</li>
        </ul>
        <p>This isn't theoretical. This is cash that should be in <strong>YOUR</strong> pocket, based on <strong>YOUR</strong> numbers.</p>
        <div style="width: 100%; text-align: center; margin: 22px 0 20px 0">
            <img
              src="assets/image1.jpg"
              alt="Contractor financial loss illustration"
              style="
                width: 230px;
                max-width: 100%;
                box-shadow: 0 2px 7px rgba(0, 0, 0, 0.08);
              "
            />
          </div>
        <p style="font-size: 1.08em">
          <strong>Ready to turn that lost cash into real profits,</strong>
          not by changing <em>what</em> you do, but by simply showing up on
          time and winning over those clients from the start?
        </p>
        <p style="color: #d10000; font-weight: bold; font-size: 1.08em; text-align: center;">
          Continue reading to see how this fix can improve your profit and
          reputation!
        </p>
        <div class="pdf-footer">
          <a href="http://www.bycontractorsforcontractors.com/" style="color: white; text-decoration: none;">
            <span>WWW.BYCONTRACTORSFORCONTRACTORS.COM</span>
          </a>
          <a href="mailto:CONTACT@CONSUMERSTRUSTAWARD.COM">
            <span style="float: right; color: white;">CONTACT@CONSUMERSTRUSTAWARD.COM</span>
          </a>
        </div>
      </div>

      <!-- PAGE 2 -->
      <div class="page-break"></div>
      <div class="pdf-section">
        <h2 style="text-align: center; color: #14316a; font-size: 1.35em; font-weight: bold; margin-top: 0; margin-bottom: 16px;">
          Stop the Leaks: The Real Damage of Being Late
        </h2>
        <div style="width: 100%; text-align: center; margin-bottom: 18px">
            <img
              src="assets/image2.jpg"
              alt="Two contractors at table"
              style="
                width: 310px;
                max-width: 100%;
                box-shadow: 0 2px 7px rgba(0, 0, 0, 0.08);
              "
            />
          </div>
        <p>Alright, listen up, you guys. Let's talk about something that's probably costing you more than you even realize: <strong>being late.</strong></p>
        <p>Yeah, I know, traffic's a bitch, jobs run over, stuff happens. But think of it like this: every minute your crew's not where they're supposed to be, when they're supposed to be, it's like you've got a damn leak in your bucket, and that leak's your hard-earned cash just dripping away.</p>
        <p>We're not just talking about a pissed-off homeowner tapping their foot. We're talking about <strong>real damage to your bottom line</strong>, damage that can sink your business faster than a poorly poured foundation. Think about it. You show up late for an estimate? Half the time, that potential client's already sour, maybe even called someone else. That's a job you didn't even get a swing at, gone.</p>
        <p><strong>And even when you <em>do</em> get the job after a late start?</strong> You think they've forgotten? Nope. They're watching you closer, quicker to complain, and way more likely to nickel and dime you on every little thing. That erodes your profit margin faster than acid on concrete.</p>
        <p>Then there's the domino effect. Late starts push everything else back. You're rushing, your guys are stressed, mistakes happen. And what do mistakes cost? Time, materials, callbacks – more leaks in that damn bucket.</p>
        <p>So, yeah, being late isn't just a slap on the wrist. <strong>It's a silent killer of your profits, your reputation, and your peace of mind.</strong> It's time we stopped those leaks for good.</p>
        <div class="pdf-footer">
          <a href="http://www.bycontractorsforcontractors.com/" style="color: white; text-decoration: none;">
            <span>WWW.BYCONTRACTORSFORCONTRACTORS.COM</span>
          </a>
          <a href="mailto:CONTACT@CONSUMERSTRUSTAWARD.COM">
            <span style="float: right; color: white;">CONTACT@CONSUMERSTRUSTAWARD.COM</span>
          </a>
        </div>
      </div>

      <!-- PAGE 3 -->
      <div class="page-break"></div>
      <div class="pdf-section">
        <p style="margin-top: 0">
          <b>Be honest</b>, do any of these
          <a href="#" style="color: #14316a; text-decoration: underline">sample</a>
          poor reviews (there are thousands of them) describe your experience?
        </p>
        <div style="width: 100%; text-align: center; margin: 20px 0 10px 0">
            <img
              src="assets/image3.jpg"
              alt="Client talking to contractor"
              style="
                width: 220px;
                max-width: 100%;
                box-shadow: 0 2px 7px rgba(0, 0, 0, 0.08);
              "
            />
          </div>

        <p style="margin-bottom: 2px">
          <span style="font-size: 1.17em">⭐<span style="color: #bfbfbf">☆☆☆☆</span></span>
          <span style="font-style: italic">"Absolutely unprofessional! The contractor was scheduled between 9am–11am. By noon, no one had shown up and no call. I wasted my entire morning waiting. Don't bother with this company if you value your time."</span>
        </p>
        <p style="margin-bottom: 2px">
          <span style="font-size: 1.17em">⭐<span style="color: #bfbfbf">☆☆☆☆</span></span>
          <span style="font-style: italic">"Extremely disappointed with the lack of punctuality. They confirmed 2pm, and it's now 3:30pm with no sign of them. I had to leave work early for this. Looking for a more reliable contractor."</span>
        </p>
        <p style="margin-bottom: 2px">
          <span style="font-size: 1.17em">⭐<span style="color: #bfbfbf">☆☆☆☆</span></span>
          <span style="font-style: italic">"This contractor was a no-show for our initial consultation. No call, no email, nothing. If they can't even be on time for a simple appointment, I have zero confidence in their ability to manage a project."</span>
        </p>
        <p style="margin-bottom: 2px">
          <span style="font-size: 1.17em">⭐<span style="color: #bfbfbf">☆☆☆☆</span></span>
          <span style="font-style: italic">"Waited around for over three hours. When I finally called, they acted like it was no big deal and said they were 'running a bit behind.' A 'bit behind' is not three hours! My entire afternoon is now shot."</span>
        </p>
        <p style="margin-top: 1.3em; margin-bottom: 0.2em">
          <b>And I really hope this wasn't you.</b>
          This was posted on a community form in your area:
        </p>
        <p style="margin-bottom: 0.2em"><em>Hi all,</em></p>
        <p>
          <em>I wanted to warn everyone about the contractor that I tried to use for a small bathroom remodel, Ver.. Tile - Taylor Anthony Tr..... Below is a copy of the <b><span style="font-style: normal">complaint I filed with the Better Business Bureau</span></b> ~……….. </em>
        </p>
        <div class="pdf-footer">
          <a href="http://www.bycontractorsforcontractors.com/" style="color: white; text-decoration: none;">
            <span>WWW.BYCONTRACTORSFORCONTRACTORS.COM</span>
          </a>
          <a href="mailto:CONTACT@CONSUMERSTRUSTAWARD.COM">
            <span style="float: right; color: white;">CONTACT@CONSUMERSTRUSTAWARD.COM</span>
          </a>
        </div>
      </div>

      <!-- PAGE 4 -->
      <div class="page-break"></div>
      <div class="pdf-section">
        <h2 style="text-align: center; color: #14316a; font-size: 1.35em; font-weight: bold; margin-top: 0; margin-bottom: 16px;">
          From Late & Losing to On-Time & Winning: How We Fixed This Mess
        </h2>
        <div style="width: 100%; text-align: center; margin-bottom: 18px">
            <div style="display: inline-block; position: relative">
              <img
                src="assets/image4.jpg"
                alt="Before and After contractors"
                style="
                  width: 320px;
                  max-width: 100%;
                  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.08);
                "
              />
              <span
                style="
                  position: absolute;
                  top: 8px;
                  left: 24px;
                  color: #fff;
                  font-weight: bold;
                  font-size: 1.1em;
                  text-shadow: 0 1px 4px #222;
                "
              ></span>
              <span
                style="
                  position: absolute;
                  top: 8px;
                  right: 24px;
                  color: #fff;
                  font-weight: bold;
                  font-size: 1.1em;
                  text-shadow: 0 1px 4px #222;
                "
              ></span>
            </div>
          </div>
        <p>Okay, so we've all been there, right? Late, scrambling, losing money and sleep over this damn lateness problem. But here's the thing: <b>we're contractors. We're problem-solvers.</b> We don't just whine about a busted pipe; we fix it. And that's exactly what we did with this appointment mess.</p>
        <p><b>A bunch of us got together</b> – guys who were sick of the same old BS – and we hammered out a system. Not some fancy software that costs more than a new truck, but a real, practical way to get to our appointments on time, get our crews where they need to be, when they need to be there, without all the headaches.</p>
        <p>And <b>a way to establish INSTANT trust with our first appointment</b>, and leave that appointment with an agreement and a 5-Star review.</p>
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%; margin: 0 auto;">
        <div style="font-weight: bold; color: #2381c3; margin: 26px 0 8px 0; font-size: 1.13em; letter-spacing: 0.01em;">
          WHAT HAPPENS WHEN YOU FIX THIS <span style="color: #3dc475; text-decoration: underline;">ONE</span> THING
        </div>
        <ul style="font-size: 1.12em; margin-left: 0; margin-bottom: 0; list-style: none; padding: 0; text-align: left; display: inline-block;">
          <li style="margin-bottom: 4px; list-style: none;">
            <span style="color: #23b44b; font-size: 1.15em">&#x2705;</span>
            Average annual revenue increase: <span style="font-weight: 700; color: #267849">$37,500</span>
          </li>
          <li style="margin-bottom: 4px; list-style: none;">
            <span style="color: #23b44b; font-size: 1.15em">&#x2705;</span>
            Average increase in referrals: <span style="font-weight: 700; color: #267849">32%</span>
          </li>
          <li style="margin-bottom: 4px; list-style: none;">
            <span style="color: #23b44b; font-size: 1.15em">&#x2705;</span>
            Average reduction in negative reviews: <span style="font-weight: 700; color: #267849">91%</span>
          </li>
          <li style="list-style: none;">
            <span style="color: #23b44b; font-size: 1.15em">&#x2705;</span>
            Average increase in pricing: <span style="font-weight: 700; color: #267849">17%</span>
          </li>
        </ul>
      </div>
        <div class="pdf-footer">
          <a href="http://www.bycontractorsforcontractors.com/" style="color: white; text-decoration: none;">
            <span>WWW.BYCONTRACTORSFORCONTRACTORS.COM</span>
          </a>
          <a href="mailto:CONTACT@CONSUMERSTRUSTAWARD.COM">
            <span style="float: right; color: white;">CONTACT@CONSUMERSTRUSTAWARD.COM</span>
          </a>
        </div>
      </div>

      <!-- PAGE 5 -->
      <div class="page-break"></div>
        <div class="pdf-section" style="padding-bottom: 82px">
          <p style="margin-top: 0; font-weight: bold">
            By simply <span style="color: #2381c3">FIXING</span> this
            <span style="color: #3dc475">ONE</span> thing…..
          </p>
          <blockquote
            style="
              font-style: italic;
              margin-left: 32px;
              margin-right: 32px;
              color: #23272c;
              margin-top: 7px;
            "
          >
            "Finally, a contractor who shows up when they say they will! Not
            only were they on time, but they called ahead to confirm. The work
            was excellent, but I was most impressed by their professionalism and
            respect for my schedule."
            <br /><br />
            "I've hired 5 different contractors this year, and this is the only
            one who was actually punctual. I'll gladly pay their higher rates
            for the peace of mind and reliability. Already recommended to three
            neighbors."
          </blockquote>
          <p style="margin-top: 18px">
            This isn’t rocket science, but it's about getting the basics nailed
            down so tight that lateness just isn't an option anymore. It's about
            taking control of our time, our reputation, and our damn businesses.
            And guess what? <b>It works.</b>
          </p>
          <p
            style="
              margin-top: 28px;
              color: #3dc475;
              font-weight: 700;
              text-align: center;
              font-size: 1.12em;
            "
          >
            See the Payoff:
          </p>
          <p
            style="
              color: #14316a;
              font-weight: 700;
              font-size: 1.1em;
              text-align: center;
              margin-bottom: 0.2em;
            "
          >
            Real Contractors Building Trust (and Bank Accounts) with This System
          </p>
           <p style="font-size: 1.09em; text-align: center; font-weight: bold; margin-top: 0;">
          Converting your <span style="color: #d10000">${beforeDollars}</span> into
          <span style="color: #3dc475">${afterDollars}</span> more income
        </p>
          <div style="width: 100%; margin: 18px 0 0 0">
            <div
              style="display: flex; align-items: flex-start; margin-bottom: 7px"
            >
              <img
                src="assets/contractor1.jpg"
                alt="Contractor testimonial"
                style="
                  width: 56px;
                  height: 56px;
                  border-radius: 50%;
                  margin-right: 14px;
                  object-fit: cover;
                  flex-shrink: 0;
                "
              />
              <span style="font-style: italic">
                "After implementing the
                <b>Insanely Great Appointment System</b>, our appointment
                reliability improved from 72% to 98%. Customer callbacks
                increased 43% and we've documented a 17% revenue increase in
                just 90 days." John Martinez, Electrical Contractor – Riverside,
                CA
              </span>
            </div>
            <div style="margin-bottom: 7px">
              <span style="font-style: italic">
                "We were leaving money on the table with every late appointment.
                The Revolution changed everything – we now have the highest
                punctuality rating in our market and it's become our main
                competitive advantage." Sarah Wilson, Painting Contractor –
                Atlanta, GA
              </span>
            </div>
            <div
              style="display: flex; align-items: flex-start; margin-bottom: 7px"
            >
              <img
                src="assets/contractor2.jpg"
                alt="Contractor testimonial"
                style="
                  width: 56px;
                  height: 56px;
                  border-radius: 50%;
                  margin-right: 14px;
                  object-fit: cover;
                  flex-shrink: 0;
                "
              />
              <span style="font-style: italic">
                "I've been in business 17 years. I thought I knew everything
                about running jobs. When another contractor told me about this
                punctuality system, I laughed it off. What could I possibly
                learn about showing up to appointments? Six months later, my
                close rate is up 21%, callbacks are down 64%, and I've added
                $11,200 in monthly revenue. I'm not laughing anymore." — Mike
                D., Plumbing & Heating, Boston
              </span>
            </div>
            <div style="display: flex; align-items: flex-start">
              <img
                src="assets/contractor3.jpg"
                alt="Contractor testimonial"
                style="
                  width: 56px;
                  height: 56px;
                  border-radius: 50%;
                  margin-right: 14px;
                  object-fit: cover;
                  flex-shrink: 0;
                "
              />
              <span style="font-style: italic">
                "Since implementing the
                <b>Insanely Great Appointment System</b>, we’ve seen immediate
                impacts on our bottom line. Customers notice the difference, and
                our team appreciates the positive feedback from the customers."
                -Larry D, Remodeling, Heber
              </span>
            </div>
          </div>
          <div class="pdf-footer">
            <a href="http://www.bycontractorsforcontractors.com/" style="color: white; text-decoration: none;">
                <span>WWW.BYCONTRACTORSFORCONTRACTORS.COM</span>
            </a>
            <a href="mailto:CONTACT@CONSUMERSTRUSTAWARD.COM">
                <span style="float: right; color: white;">CONTACT@CONSUMERSTRUSTAWARD.COM</span>
            </a>
          </div>
        </div>

      <!-- PAGE 6 -->
      <div class="page-break"></div>
      <div class="pdf-section">
        <div style="display: flex; align-items: flex-start; margin-bottom: 11px">
          <img
              src="assets/contractor1.jpg"
              alt="Contractor portrait"
              style="
                width: 56px;
                height: 56px;
                border-radius: 50%;
                margin-right: 16px;
                object-fit: cover;
                flex-shrink: 0;
              "
            />
          <span style="font-style: italic; color: #23272c">
            "I've been running service calls for 13 years and thought I had my
            schedule dialed in. My guys laughed when I mentioned trying a new
            punctuality system – we were all skeptical. But after our first
            month using the system, our callback rate dropped 37% and we
            increased our average ticket by $118. The unexpected benefit? My
            guys are home for dinner every night now because they're not
            running late on final calls. That alone has cut my turnover
            problem in half."
            <span style="font-weight: bold; color: #23272c">
              James K., Electrical Contractor, 3-truck operation, Dallas</span>
          </span>
        </div>
        <div style="display: flex; align-items: flex-start; margin-bottom: 13px">
           <img
              src="assets/contractor4.jpg"
              alt="Contractor portrait"
              style="
                width: 56px;
                height: 56px;
                border-radius: 50%;
                margin-right: 16px;
                object-fit: cover;
                flex-shrink: 0;
              "
            />
          <span style="font-style: italic; color: #23272c">
            "As a female contractor in a male-dominated field, I'm always
            looking for legitimate advantages. I tried this system because my
            estimators were constantly running behind, and homeowners were
            complaining. Within 3 weeks, our close rate jumped from 42% to 58%
            – that's an extra $27,400 in monthly revenue. The part that
            shocked me? Our 5-star review count doubled when we started
            sending the 'on my way' texts. Now my competitors are wondering
            why we're getting all the high-end jobs."
            <span style="font-weight: bold; color: #23272c">
              Maria S., Roofing Contractor, 12 employees, Chicago, IL</span>
          </span>
        </div>
        <p style="margin-bottom: 11px">
          <span style="color: #d10000; font-weight: bold">And get this:</span>
          7 out of 10 homeowners said they'd pay 15% <em>more</em> for a
          contractor who's on time! 15%! That's free money we're leaving on
          the table.
        </p>
        <p style="font-weight: bold; margin-bottom: 12px">
          <span style="color: #14316a">Now, seriously, can you honestly</span>
          tell me you <em>don't</em> want to be the trusted contractor? You
          <em>don't</em> want to earn more? This isn't about changing your
          business; it's about being on time, building trust, and earning
          more. <span style="font-size: 1.1em">😊</span>
        </p>

        <h3 style="text-align: center; color: #14316a; font-size: 1.13em; font-weight: bold; margin-bottom: 4px; margin-top: 35px;">
          As a Contractor Who's Seen Enough Lost Profit,<br />
          Isn't It Time to Try the Fix?
        </h3>
        <div style="margin-bottom: 11px">
          Ready to ditch the late fees and finally run a tight ship?
        </div>
        <div style="margin-bottom: 10px">
          This isn't just about showing up on time. It's about mastering that
          first client meeting, building trust from the jump, and landing the
          job (and that 5-star review) more often.
        </div>
        <div style="font-weight: bold">
          <span style="color: #23272c">
            This system is so straightforward, you can grab it today and start
            seeing results tomorrow.
          </span>
        </div>
        <div class="pdf-footer">
          <a href="http://www.bycontractorsforcontractors.com/" style="color: white; text-decoration: none;">
            <span>WWW.BYCONTRACTORSFORCONTRACTORS.COM</span>
          </a>
          <a href="mailto:CONTACT@CONSUMERSTRUSTAWARD.COM">
            <span style="float: right; color: white;">CONTACT@CONSUMERSTRUSTAWARD.COM</span>
          </a>
        </div>
      </div>

      <!-- PAGE 7 -->
      <div class="page-break"></div>
      <div class="pdf-section">
        <h2 style="color: #d10000; text-align: center">WHAT YOU GET TODAY</h2>
        <p>The <strong>Insanely Great Appointment System</strong> includes:</p>
        <ul style="list-style: none; padding-left: 0; font-size: 1.08em">
          <li><span style="color: green">&#x2705;</span> <strong>The Punctuality Promise - "The On-Time Guarantee:</strong> Give them this on-time guarantee when you make the appointment and win their trust immediately</li>
          <li><span style="color: green">&#x2705;</span> <strong>Automated Text Template:</strong> Use this to confirm your appointment. Another trust builder</li>
          <li><span style="color: green">&#x2705;</span> <strong>The Trust Trigger Checklist</strong> – the 4 actions in the first 90 seconds that build maximum trust</li>
          <li><span style="color: green">&#x2705;</span> <strong>Paper Schedule System (For Non-Digital Users):</strong> Formatted as a clipboard-ready sheet. If you are 'tech savvy' it can easily be digitized.</li>
          <li><span style="color: green">&#x2705;</span> <strong>Pre-Appointment Checklist - "The 5-Point Preparation Protocol"</strong> – Use this the night before so you can sleep better knowing you are prepared for tomorrow</li>
          <li><span style="color: green">&#x2705;</span> <strong>30 Minutes Before Departure:</strong> Check these items to make sure you are prepared to arrive on time</li>
          <li><span style="color: green">&#x2705;</span> <strong>Trust-Building Script</strong> – What to say during your appointment that makes them feel they can trust you and need not get other bids. The closer <span style="font-size: 1.2em">😊</span></li>
          <li><span style="color: green">&#x2705;</span> <strong>The Trust Builder Bid Sheet</strong> – It improves communication and eliminates mis-communication. This is your golden ticket to more money and higher profits</li>
          <li><span style="color: green">&#x2705;</span> <strong>Feedback about your punctuality and communication</strong> – This earns you your 'Punctuality Trust Badge' and 5-star reviews. Why not get your review now <span style="font-size: 1.2em">😊</span></li>
          <li><span style="color: green">&#x2705;</span> <strong>One-Touch Review Generator:</strong> A simple card with a QR code given at the end of a punctual appointment that takes customers directly to a review page (optional)</li>
        </ul>
        <div class="pdf-footer">
          <a href="http://www.bycontractorsforcontractors.com/" style="color: white; text-decoration: none;">
            <span>WWW.BYCONTRACTORSFORCONTRACTORS.COM</span>
          </a>
          <a href="mailto:CONTACT@CONSUMERSTRUSTAWARD.COM">
            <span style="float: right; color: white;">CONTACT@CONSUMERSTRUSTAWARD.COM</span>
          </a>
        </div>
      </div>

      <!-- PAGE 8 -->
      <div class="page-break"></div>
      <div class="pdf-section">
        <div style="text-align: center; margin-bottom: 12px">
            <img
              src="assets/image8.jpg"
              alt="Punctuality Trust Badge Logo"
              style="width: 340px; max-width: 95%; margin-bottom: 10px"
            />
          </div>
        <p>Show up on time, consistently, for 30 days, and you'll earn the <strong>'Punctuality Trust Badge'</strong> - something over <strong>1,500</strong> of us now proudly display.</p>
        <p style="margin-bottom: 9px">Think about this:</p>
        <p style="margin-bottom: 13px">
          <strong>The 'Punctuality Trust Badge' – Your Instant Credibility Booster.</strong>
          After 30 days of running your business like a PRO with these tools
          and showing you're hitting your times, you get this badge. Slap it
          on your website, your cards, your truck – everywhere. It's a
          flashing neon sign to other contractors and every homeowner out
          there: <strong>'This is a contractor who doesn't screw around with your time.'</strong>
          That trust? That's what gets you the job.
        </p>
        <div style="display: flex; align-items: flex-start; margin-bottom: 10px">
          <img
              src="assets/contractor3.jpg"
              alt="profile"
              style="
                width: 56px;
                height: 56px;
                border-radius: 50%;
                margin-right: 16px;
                object-fit: cover;
                flex-shrink: 0;
              "
            />
          <div style="flex: 1">
            <p style="margin: 0 0 10px 0; font-style: italic">
              "I'll be straight with you guys, I used to be the poster child
              for 'contractor time.' You know the drill: showing up late,
              half-apologizing, the whole nine yards. I didn't think it was a
              huge deal, but then I started noticing jobs slipping away.
              Clients seemed hesitant, always asking about timelines upfront,
              real cautious-like.
            </p>
          </div>
        </div>
        <p style="margin: 0 0 10px 0; font-style: italic">
          <strong>This Punctuality Trust Badge?</strong> That changed everything.
        </p>
        <p style="margin: 0 0 10px 0; font-style: italic">
          The first month, I made a conscious effort to be on time, every
          single damn time. It wasn't always easy, but I stuck with the
          system. And you know what? It worked.
        </p>
        <p style="margin: 0 0 10px 0; font-style: italic">
          After 30 days, I got that badge, slapped it on my truck and my
          website. It wasn't long until clients started treating me different
          – more respect, less haggling. They actually believed what I said.
        </p>
        <p style="margin: 0 0 10px 0; font-style: italic">
          Jobs that I would've lost before? I was landing them. People were
          saying things like, 'It was a nice change to have a contractor show
          up when they said they would.' Referrals went through the roof.
        </p>
        <p style="margin: 0 0 10px 0; font-style: italic">
          Bottom line? That badge isn't just a gimmick. It's a sign that
          you're a pro, a guy who values their time and their word. And in
          this business, that's worth more than any fancy tool.
          <strong>Earning that badge was one of the best things I ever did for my business."</strong>
        </p>
        <p style="margin: 0">- Tom R., Remodeling Contractor</p>
        <div class="pdf-footer">
          <a href="http://www.bycontractorsforcontractors.com/" style="color: white; text-decoration: none;">
            <span>WWW.BYCONTRACTORSFORCONTRACTORS.COM</span>
          </a>
          <a href="mailto:CONTACT@CONSUMERSTRUSTAWARD.COM">
            <span style="float: right; color: white;">CONTACT@CONSUMERSTRUSTAWARD.COM</span>
          </a>
        </div>
      </div>

      <!-- PAGE 9 -->
      <div class="page-break"></div>
      <div class="pdf-section">
        <div style="text-align: center">
          <span style="background: #ffce54; color: #222; font-weight: 700; font-size: 1.2em; padding: 6px 18px; border-radius: 6px; display: inline-block; margin-bottom: 10px;">
            Your Chance to Be One of the Few:
          </span>
        </div>
        <h2 style="text-align: center; color: #31649b; font-size: 1.55em; margin: 0 0 16px 0;">
          Claim Your Spot to Become the Trusted Go-To
        </h2>
        <div style="display: flex; align-items: flex-start; margin-bottom: 10px">
          <img
              src="assets/contractor1.jpg"
              alt="profile"
              style="
                width: 56px;
                height: 56px;
                border-radius: 50%;
                margin-right: 16px;
                object-fit: cover;
                flex-shrink: 0;
              "
            />
          <div style="flex: 1">
            <p style="font-style: italic; margin: 0; color: #262626; text-align: center;">
              "This simple system put an extra $20K in my pocket in the first
              three months, just by getting to our appointments when we said
              we would and building that trust. Seriously."
            </p>
          </div>
        </div>
        <p>
          Alright, listen up. Look, I get it. Maybe being on time and actually
          building a solid rep around here in ${userInfo.city} isn't your top concern right now.
          You're busy, things are hectic. I'm not gonna lie, this isn't for
          everyone.
        </p>
        <p>
          But if you're sick of chasing your tail, losing out on jobs because
          folks don't trust you to show up, and you're ready to be
          <em>the</em> go-to, reliable contractor in ${userInfo.city}? Then listen close.
        </p>
        <p>
          Right now, we're opening up spots for
          <strong>just five more contractors</strong> – trying to keep a good
          mix of plumbers, sparkies, carpenters, remodelers, decks the whole
          nine yards – to join the growing crew of punctual, trusted
          professionals in ${userInfo.city}. This isn't a free
          ride, but it's the real deal.
        </p>
        <p style="font-weight: 700; color: #31649b; margin-top: 18px">Today only:</p>
        <p style="margin-bottom: 0.3em">
          <strong>First off, a handshake guarantee:</strong> Purchase and take
          the <em>Insanely Great Appointment System</em> for a 10-day spin. If
          you look at it and think, 'Nah, this isn't gonna work for my crew,'
          just holler and we'll refund your damn money. No BS, no hard
          feelings.
        </p>
        <p style="margin-bottom: 0.3em">
          <strong>But here's where it gets real interesting:</strong> Once
          you're hitting those on-time first appointments consistently and
          you've earned that 'Punctuality Trust Badge' – and believe me, over
          1,500 of us have already snagged one –
          <strong>you're getting plugged into something big</strong>. We're
          building a serious marketing push right here in ${userInfo.city} to promote the contractors who've
          earned that badge. Think of it as us shouting from the rooftops that
          you're the reliable son-of-a-gun to call.
          <strong>Homeowners in ${userInfo.city} get a clear list
          of trusted contractors, the ones who actually show up.</strong>
          It's like having your number on their speed dial for every job they
          need that you do. Short-term gigs, long-term referrals – this thing
          builds a pipeline that just keeps on giving.
        </p>
        <p style="font-size: 1.15em; text-align: center">
          <span style="color: #888; text-decoration: line-through">$295.00</span>, today $195.00
        </p>
        <p style="margin-top: 16px; text-align: center">
          <a href="https://buy.stripe.com/8x2cN5gJR1Z4faifTHes000" style="color: #31649b; font-weight: 700; text-decoration: underline;">
            CLICK HERE TO PURCHASE
          </a>
        </p>
        <div class="pdf-footer">
          <a href="http://www.bycontractorsforcontractors.com/" style="color: white; text-decoration: none;">
            <span>WWW.BYCONTRACTORSFORCONTRACTORS.COM</span>
          </a>
          <a href="mailto:CONTACT@CONSUMERSTRUSTAWARD.COM">
            <span style="float: right; color: white;">CONTACT@CONSUMERSTRUSTAWARD.COM</span>
          </a>
        </div>
      </div>
    `;
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
   * Print the report content
   */
  /**
   * Print the report content with properly positioned footers
   */
  function printReport() {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    // Get the report content and process it for printing
    let reportHTML = reportContent.innerHTML;

    // Split the content by pdf-section divs to ensure each page has its footer
    const sections = reportHTML.split('<div class="pdf-section');
    let processedHTML = "";

    sections.forEach((section, index) => {
      if (index === 0 && !section.includes("pdf-footer")) {
        // Skip if it's just the content before the first section
        return;
      }

      if (section.trim()) {
        // Reconstruct the section
        let sectionHTML = '<div class="pdf-section' + section;

        // Ensure each section has a footer if it doesn't already
        if (!sectionHTML.includes("pdf-footer")) {
          // Find where to insert the footer (before the closing div)
          const lastDivIndex = sectionHTML.lastIndexOf("</div>");
          if (lastDivIndex !== -1) {
            const footerHTML = `
                      <div class="pdf-footer">
                          <a href="http://www.bycontractorsforcontractors.com/" style="color: white; text-decoration: none;">
                              <span>WWW.BYCONTRACTORSFORCONTRACTORS.COM</span>
                          </a>
                          <a href="mailto:CONTACT@CONSUMERSTRUSTAWARD.COM">
                              <span style="float: right; color: white;">CONTACT@CONSUMERSTRUSTAWARD.COM</span>
                          </a>
                      </div>`;
            sectionHTML =
              sectionHTML.slice(0, lastDivIndex) +
              footerHTML +
              sectionHTML.slice(lastDivIndex);
          }
        }

        processedHTML += sectionHTML;
      }
    });

    // Create the print document with optimized styles
    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Punctuality Report</title>
      <style>
        /* Reset and base styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        body {
          font-family: Georgia, serif;
          color: #000;
          padding: 0;
          margin: 0;
          line-height: 1.5;
          background: #fff;
        }
        
        /* Page setup */
        @page {
          size: letter;
          margin: 0;
        }
        
        /* PDF Section - using flexbox for reliable footer positioning */
        .pdf-section {
          width: 8.5in;
          min-height: 11in;
          max-height: 11in;
          padding: 0.75in;
          padding-bottom: 1.5in; /* Extra space for footer */
          position: relative;
          page-break-after: always;
          page-break-inside: avoid;
          display: flex;
          flex-direction: column;
        }
        
        .pdf-section:last-child {
          page-break-after: auto;
        }
        
        /* Content wrapper to push footer to bottom */
        .pdf-section > *:not(.pdf-footer) {
          flex: 1 1 auto;
        }
        
        /* Footer styles - positioned at bottom of each page */
        .pdf-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: #4a80d4 !important;
          color: white !important;
          padding: 15px 0.75in;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          font-size: 11px !important;
          font-weight: bold !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        
        .pdf-footer a {
          color: white !important;
          text-decoration: none !important;
        }
        
        .pdf-footer span {
          color: white !important;
          display: inline-block !important;
        }
        
        /* Typography */
        h1, h2, h3 {
          margin-top: 18px;
          margin-bottom: 10px;
          font-weight: bold;
          line-height: 1.15;
          page-break-after: avoid;
          color: #14316a;
        }
        
        h1 {
          font-size: 2em;
        }
        
        h2 {
          font-size: 1.35em;
        }
        
        h3 {
          font-size: 1.13em;
        }
        
        p {
          margin: 0.5em 0;
          orphans: 3;
          widows: 3;
        }
        
        ul, li {
          break-inside: avoid;
          page-break-inside: avoid;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
        
        blockquote {
          margin: 1em 2em;
          font-style: italic;
          color: #23272c;
        }
        
        /* Images */
        img {
          max-width: 100%;
          height: auto;
          page-break-inside: avoid;
        }
        
        /* Links in content */
        a:not(.pdf-footer a) {
          color: #14316a;
          text-decoration: underline;
        }
        
        /* Hide page break indicators */
        .page-break {
          display: none !important;
        }
        
        /* Utility classes */
        strong {
          font-weight: bold;
        }
        
        em {
          font-style: italic;
        }
        
        /* Ensure last page footer is visible */
        @media print {
          .pdf-section {
            position: relative !important;
          }
          
          .pdf-footer {
            position: absolute !important;
            bottom: 0 !important;
          }
        }
      </style>
    </head>
    <body>
      ${processedHTML}
    </body>
    </html>
  `);

    printWindow.document.close();

    // Wait for content to load completely before printing
    printWindow.onload = function () {
      // Additional delay to ensure styles are applied
      setTimeout(() => {
        printWindow.print();

        // Close the window after printing (with delay for some browsers)
        setTimeout(() => {
          printWindow.close();
        }, 100);
      }, 250);
    };
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
      showNotification("Redirecting you to the Punctuality Revolution...");
    });

    // Print Report button
    printReportButton.addEventListener("click", function () {
      printReport();
    });
  }

  /**
   * Initialize modal functionality
   */
  function initModal() {
    // Close download modal when X is clicked
    closeModal.addEventListener("click", function () {
      downloadModal.classList.remove("show");
    });

    // Close report modal when X is clicked
    closeReportModal.addEventListener("click", function () {
      reportViewModal.classList.remove("show");
    });

    // Close modals when clicking outside the modal content
    window.addEventListener("click", function (event) {
      if (event.target === downloadModal) {
        downloadModal.classList.remove("show");
      }
      if (event.target === reportViewModal) {
        reportViewModal.classList.remove("show");
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

      // Submit data via email and show report in modal
      submitViaEmail(formData);
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
      (jobValue * appointments * (latenessPercent / 100)) / 4;

    // Get the flames elements
    const flamesContainer = document.querySelector(".flames-container");
    const flame1 = document.querySelector(".flame-1");
    const flame2 = document.querySelector(".flame-2");
    const flame3 = document.querySelector(".flame-3");

    if (!flame1 || !flame2 || !flame3) {
      return;
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
      const animationDuration = Math.max(0.5, 3 - potentialLoss / 10000);
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
