/**
 * Enhanced PDF Report Generator - Updated report-generator.js
 * Generates PDF matching the exact template design without preview modal
 */

/**
 * Generate a PDF report based on user data and calculator results
 */
function generatePDFReport() {
  // Check if html2pdf is available
  if (typeof html2pdf === "undefined") {
    console.log("html2pdf not found. Loading...");
    loadHtml2PdfAndGenerate();
    return;
  }

  generatePunctualityPDF();
}

/**
 * Load html2pdf library and then generate PDF
 */
function loadHtml2PdfAndGenerate() {
  const script = document.createElement("script");
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
  script.onload = function () {
    console.log("html2pdf loaded successfully");
    generatePunctualityPDF();
  };
  script.onerror = function () {
    console.error("Failed to load html2pdf");
    showNotification("Error loading PDF generator. Please try again.");
  };
  document.head.appendChild(script);
}

/**
 * Generate the complete punctuality PDF report
 */
function generatePunctualityPDF() {
  console.log("Starting PDF generation...");

  // Get user information
  const savedContactInfo = localStorage.getItem("userContactInfo");
  let userInfo = {
    name: "Valued Contractor",
    businessName: "Your Company",
    city: "your city",
  };

  if (savedContactInfo) {
    const contactInfo = JSON.parse(savedContactInfo);
    userInfo.name = contactInfo.name || "Valued Contractor";
    userInfo.businessName =
      contactInfo.businessName !== "Not provided"
        ? contactInfo.businessName
        : "Your Company";
    userInfo.city = contactInfo.city || "your city";
  }

  // Get calculation results
  const results = calculator.results;

  if (!results || !results.annualLoss) {
    showNotification(
      "Please complete the calculator first before generating a report."
    );
    return;
  }

  // Show loading indicator
  const loadingEl = createLoadingIndicator();
  document.body.appendChild(loadingEl);

  // Create the complete HTML report
  const reportHTML = createCompleteReportHTML(userInfo, results);

  // Create a temporary container
  const container = document.createElement("div");
  container.innerHTML = reportHTML;
  container.style.cssText = `
    width: 8.5in;
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #000000;
    background: white;
  `;

  // Temporarily add to body (off-screen)
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  document.body.appendChild(container);

  // Wait for content to render
  setTimeout(() => {
    // Enhanced PDF options
    const opt = {
      margin: 0,
      filename: `Punctuality_Report_${userInfo.businessName.replace(
        /\s+/g,
        "_"
      )}_${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: {
        unit: "in",
        format: "letter",
        orientation: "portrait",
      },
      pagebreak: { mode: "avoid-all", before: ".report-page" },
    };

    // Generate PDF
    html2pdf()
      .set(opt)
      .from(container)
      .save()
      .then(() => {
        console.log("PDF generated successfully");
        document.body.removeChild(container);
        document.body.removeChild(loadingEl);
        showNotification("Your punctuality report has been downloaded!");
      })
      .catch((error) => {
        console.error("PDF generation failed:", error);
        document.body.removeChild(container);
        document.body.removeChild(loadingEl);
        showNotification("Error generating PDF. Please try again.");
      });
  }, 1000);
}

/**
 * Create the complete HTML report with all 9 pages matching the template exactly
 */
function createCompleteReportHTML(userInfo, results) {
  // Format the financial values
  const annualLoss = Math.round(results.annualLoss).toLocaleString();
  const monthlyLoss = Math.round(results.annualLoss / 12).toLocaleString();
  const dailyLoss = Math.round(results.dailyBurnRate).toLocaleString();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        ${getReportCSS()}
      </style>
    </head>
    <body>
      <div class="report-container">
        
        <!-- Page 1: Cover Page -->
        <div class="report-page page-1">
          <div class="page-content">
            <div class="header-box">
              <h1 class="main-title">Fixing The Trust Problem:</h1>
              <h2 class="subtitle">The Contractor's No-BS Fix for the Tardiness Trap</h2>
              <div class="tagline">STOP LEAVING MONEY ON THE TABLE</div>
            </div>

            <div class="content-section">
              <p>Hi ${userInfo.name}, it's great to meet you.</p>
              <p>Here is your Confidential Financial report from the "How Much Is Being Late Costing You?" calculator.</p>
              
              <h3 class="section-title">THE REAL COST OF BEING LATE</h3>
              <p>Based on your calculator results, here's what punctuality problems are actually costing ${
                userInfo.businessName
              }:</p>
              
              <h4 class="highlight-title">YOUR FINANCIAL BLEEDING:</h4>
              <ul class="cost-list">
                <li>$${annualLoss} walking out your door EVERY YEAR</li>
                <li>That's $${monthlyLoss} lost EVERY MONTH</li>
                <li>$${dailyLoss} slipping away EVERY DAY you don't fix this</li>
              </ul>
              
              <p>This isn't theoretical. This is cash that should be in YOUR pocket, based on YOUR numbers.</p>
              
              <div class="bottom-section">
                <p>Ready to turn that lost cash into real profits, not by changing <em>what</em> you do, but by simply showing up on time and winning over those clients from the start?</p>
                <p class="cta-text">Continue reading to see how this fix can improve your profit and reputation!</p>
              </div>
            </div>
          </div>
          <div class="page-footer">
            <div class="footer-left">WWW.BYCONTRACTORSFORCONTRACTORS.COM</div>
            <div class="footer-right">CONTACT@CONSUMERSTRUSTAWARD.COM</div>
          </div>
        </div>

        <!-- Page 2: Stop the Leaks -->
        <div class="report-page page-2">
          <div class="page-content">
            <h2 class="page-title">Stop the Leaks: The Real Damage of Being Late</h2>
            
            <div class="content-section">
              <p>Alright, listen up, you guys. Let's talk about something that's probably costing you more than you even realize: <strong>being late</strong>.</p>
              
              <p>Yeah, I know, traffic's a bitch, jobs run over, stuff happens. But think of it like this: every minute your crew's not where they're supposed to be, when they're supposed to be, it's like you've got a damn leak in your bucket, and that leak's your hard-earned cash just dripping away.</p>
              
              <p>We're not just talking about a pissed-off homeowner tapping their foot. We're talking about <strong>real damage to your bottom line</strong>, damage that can sink your business faster than a poorly poured foundation. Think about it. You show up late for an estimate? Half the time, that potential client's already sour, maybe even called someone else. That's a job you didn't even get a swing at, gone.</p>
              
              <p><strong>And even when you <em>do</em> get the job after a late start?</strong> You think they've forgotten? Nope. They're watching you closer, quicker to complain, and way more likely to nickel and dime you on every little thing. That erodes your profit margin faster than acid on concrete.</p>
              
              <p>Then there's the domino effect. Late starts push everything else back. You're rushing, your guys are stressed, mistakes happen. And what do mistakes cost? Time, materials, callbacks – more leaks in that damn bucket.</p>
              
              <p>So, yeah, being late isn't just a slap on the wrist. <strong>It's a silent killer of your profits, your reputation, and your peace of mind.</strong> It's time we stopped those leaks for good.</p>
            </div>
          </div>
          <div class="page-footer">
            <div class="footer-left">WWW.BYCONTRACTORSFORCONTRACTORS.COM</div>
            <div class="footer-right">CONTACT@CONSUMERSTRUSTAWARD.COM</div>
          </div>
        </div>

        <!-- Page 3: Poor Reviews -->
        <div class="report-page page-3">
          <div class="page-content">
            <p class="intro-text"><strong>Be honest,</strong> do any of these <u>sample</u> poor reviews (there are thousands of them) describe your experience?</p>
            
            <div class="reviews-container">
              <div class="review-item">
                <div class="stars">★☆☆☆☆</div>
                <p class="review-text">"Absolutely unprofessional! The contractor was scheduled between 9am-11am. By noon, no one had shown up and no call. I wasted my entire morning waiting. Don't bother with this company if you value your time."</p>
              </div>
              
              <div class="review-item">
                <div class="stars">★☆☆☆☆</div>
                <p class="review-text">"Extremely disappointed with the lack of punctuality. They confirmed 2pm, and it's now 3:30pm with no sign of them. I had to leave work early for this. Looking for a more reliable contractor."</p>
              </div>
              
              <div class="review-item">
                <div class="stars">★☆☆☆☆</div>
                <p class="review-text">"This contractor was a no-show for our initial consultation. No call, no email, nothing. If they can't even be on time for a simple appointment, I have zero confidence in their ability to manage a project."</p>
              </div>
              
              <div class="review-item">
                <div class="stars">★☆☆☆☆</div>
                <p class="review-text">"Waited around for over three hours. When I finally called, they acted like it was no big deal and said they were 'running a bit behind.' A 'bit behind' is not three hours! My entire afternoon is now shot."</p>
              </div>
            </div>
            
            <div class="warning-section">
              <p class="warning-text">And I really hope this wasn't you. This was posted on a community form in your area:</p>
              <div class="community-post">
                <p>Hi all,</p>
                <p>I wanted to warn everyone about the contractor that I tried to use for a small bathroom remodel, Ver.. Tile - Taylor Anthony Tr..... Below is a copy of the complaint I filed with the Better Business Bureau ~...........</p>
              </div>
            </div>
          </div>
          <div class="page-footer">
            <div class="footer-left">WWW.BYCONTRACTORSFORCONTRACTORS.COM</div>
            <div class="footer-right">CONTACT@CONSUMERSTRUSTAWARD.COM</div>
          </div>
        </div>

        <!-- Page 4: From Late to On-Time -->
        <div class="report-page page-4">
          <div class="page-content">
            <h2 class="page-title">From Late & Losing to On-Time & Winning: How We Fixed This Mess</h2>
            
            <div class="content-section">
              <p>Okay, so we've all been there, right? Late, scrambling, losing money and sleep over this damn lateness problem. But here's the thing: <strong>we're contractors. We're problem-solvers.</strong> We don't just whine about a busted pipe; we fix it. And that's exactly what we did with this appointment mess.</p>
              
              <p><strong>A bunch of us got together</strong> – guys who were sick of the same old BS – and we hammered out a system. Not some fancy software that costs more than a new truck, but a real, practical way to get to our appointments on time, get our crews where they need to be, when they need to be there, without all the headaches.</p>
              
              <p>And <strong>a way to establish INSTANT trust with our first appointment</strong>, and leave that appointment with an agreement and a 5-Star review.</p>
              
              <div class="results-box">
                <h3 class="results-title">WHAT HAPPENS WHEN YOU FIX THIS <span class="green-text">ONE</span> THING</h3>
                <ul class="results-list">
                  <li>✓ Average annual revenue increase: <strong>$37,500</strong></li>
                  <li>✓ Average increase in referrals: <strong>32%</strong></li>
                  <li>✓ Average reduction in negative reviews: <strong>91%</strong></li>
                  <li>✓ Average increase in pricing: <strong>17%</strong></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="page-footer">
            <div class="footer-left">WWW.BYCONTRACTORSFORCONTRACTORS.COM</div>
            <div class="footer-right">CONTACT@CONSUMERSTRUSTAWARD.COM</div>
          </div>
        </div>

        <!-- Page 5: Positive Reviews -->
        <div class="report-page page-5">
          <div class="page-content">
            <h2 class="special-title">By simply <span class="green-text">FIXING</span> this <span class="green-text">ONE</span> thing.....</h2>
            
            <div class="positive-reviews">
              <div class="positive-review">
                <p>"Finally, a contractor who shows up when they say they will! Not only were they on time, but they called ahead to confirm. The work was excellent, but I was most impressed by their professionalism and respect for my schedule."</p>
              </div>
              
              <div class="positive-review">
                <p>"I've hired 5 different contractors this year, and this is the only one who was actually punctual. I'll gladly pay their higher rates for the peace of mind and reliability. Already recommended to three neighbors."</p>
              </div>
            </div>
            
            <p class="conclusion-text">This isn't rocket science, but it's about getting the basics nailed down so tight that lateness just isn't an option anymore. It's about taking control of our time, our reputation, and our damn businesses. And guess what? <strong>It works.</strong></p>
            
            <div class="section-divider"></div>
            
            <h3 class="section-title-green">See the Payoff:</h3>
            <h3 class="section-subtitle">Real Contractors Building Trust (and Bank Accounts) with This System</h3>
            
            <div class="income-converter">
              <p>Converting your <span class="red-text">[$${dailyLoss}]</span> into <span class="green-text">[$${dailyLoss}]</span> more income</p>
            </div>
            
            <div class="testimonials">
              <div class="testimonial">
                <p class="quote">"After implementing the <strong>"Insanely Great Appointment System"</strong>, our appointment reliability improved from 72% to 98%. Customer callbacks increased 43% and we've documented a 17% revenue increase in just 90 days."</p>
                <p class="attribution">John Martinez, Electrical Contractor – Riverside, CA</p>
              </div>
              
              <div class="testimonial">
                <p class="quote">"We were leaving money on the table with every late appointment. The Revolution changed everything - we now have the highest punctuality rating in our market and it's become our main competitive advantage."</p>
                <p class="attribution">Sarah Wilson, Painting Contractor – Atlanta, GA</p>
              </div>
              
              <div class="testimonial">
                <p class="quote">"I've been in business 17 years. I thought I knew everything about running jobs. When another contractor told me about this punctuality system, I laughed it off. What could I possibly learn about showing up to appointments? Six months later, my close rate is up 21%, callbacks are down 64%, and I've added $11,200 in monthly revenue. I'm not laughing anymore."</p>
                <p class="attribution">— Mike D., Plumbing & Heating, Boston</p>
              </div>
              
              <div class="testimonial">
                <p class="quote">"Since implementing the <strong>"Insanely Great Appointment System"</strong>, we've seen immediate impacts on our bottom line. Customers notice the difference, and our team appreciates the positive feedback from the customers."</p>
                <p class="attribution">-Larry D, Remodeling, Heber</p>
              </div>
            </div>
          </div>
          <div class="page-footer">
            <div class="footer-left">WWW.BYCONTRACTORSFORCONTRACTORS.COM</div>
            <div class="footer-right">CONTACT@CONSUMERSTRUSTAWARD.COM</div>
          </div>
        </div>

        <!-- Page 6: More Success Stories -->
        <div class="report-page page-6">
          <div class="page-content">
            <div class="testimonial-page">
              <div class="testimonial-with-image">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNFMEUwRTAiLz4KPHBhdGggZD0iTTQwIDQwQzQ0LjQxODMgNDAgNDggMzYuNDE4MyA0OCAzMkM0OCAyNy41ODE3IDQ0LjQxODMgMjQgNDAgMjRDMzUuNTgxNyAyNCAzMiAyNy41ODE3IDMyIDMyQzMyIDM2LjQxODMgMzUuNTgxNyA0MCA0MCA0MFoiIGZpbGw9IiM5OTk5OTkiLz4KPHBhdGggZD0iTTI0IDU2QzI0IDUxLjU4MTcgMjcuNTgxNyA0OCAzMiA0OEg0OEM1Mi40MTgzIDQ4IDU2IDUxLjU4MTcgNTYgNTZWNjBIMjRWNTZaIiBmaWxsPSIjOTk5OTk5Ii8+Cjwvc3ZnPg==" alt="Contractor" class="testimonial-avatar">
                <div class="testimonial-content">
                  <p class="quote">"I've been running service calls for 13 years and thought I had my schedule dialed in. My guys laughed when I mentioned trying a new punctuality system – we were all skeptical. But after our first month using the system, our callback rate dropped 37% and we increased our average ticket by $118. The unexpected benefit? My guys are home for dinner every night now because they're not running late on final calls. That alone has cut my turnover problem in half."</p>
                  <p class="attribution">James K., Electrical Contractor, 3-truck operation, Dallas</p>
                </div>
              </div>
              
              <div class="testimonial-with-image">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNGRkU0RTEiLz4KPHBhdGggZD0iTTQwIDQwQzQ0LjQxODMgNDAgNDggMzYuNDE4MyA0OCAzMkM0OCAyNy41ODE3IDQ0LjQxODMgMjQgNDAgMjRDMzUuNTgxNyAyNCAzMiAyNy41ODE3IDMyIDMyQzMyIDM2LjQxODMgMzUuNTgxNyA0MCA0MCA0MFoiIGZpbGw9IiNGRkFCOTEiLz4KPHBhdGggZD0iTTI0IDU2QzI0IDUxLjU4MTcgMjcuNTgxNyA0OCA0OEM1Mi40MTgzIDQ4IDU2IDUxLjU4MTcgNTYgNTZWNjBIMjRWNTZaIiBmaWxsPSIjRkZBQjkxIi8+Cjwvc3ZnPg==" alt="Contractor" class="testimonial-avatar">
                <div class="testimonial-content">
                  <p class="quote">"As a female contractor in a male-dominated field, I'm always looking for legitimate advantages. I tried this system because my estimators were constantly running behind, and homeowners were complaining. Within 3 weeks, our close rate jumped from 42% to 58% – that's an extra $27,400 in monthly revenue. The part that shocked me? Our 5-star review count doubled when we started sending the 'on my way' texts. Now my competitors are wondering why we're getting all the high-end jobs."</p>
                  <p class="attribution">Maria S., Roofing Contractor, 12 employees, Chicago, IL</p>
                </div>
              </div>
              
              <div class="highlight-box">
                <p>And get this: <strong>7 out of 10 homeowners said they'd pay 15% more</strong> for a contractor who's on time! 15%! That's free money we're leaving on the table.</p>
              </div>
              
              <p class="question-text">Now, seriously, can you honestly tell me you <em>don't</em> want to be the trusted contractor? You <em>don't</em> want to earn more? This isn't about changing your business; it's about being on time, building trust, and earning more.</p>
              
              <div class="section-header">
                <h3>As a Contractor Who's Seen Enough Lost Profit,<br>Isn't It Time to Try the Fix?</h3>
              </div>
              
              <p>Ready to ditch the late fees and finally run a tight ship?</p>
              
              <p>This isn't just about showing up on time. It's about mastering that first client meeting, building trust from the jump, and landing the job (and that 5-star review) more often.</p>
              
              <p><strong>This system is so straightforward, you can grab it today and start seeing results tomorrow.</strong></p>
            </div>
          </div>
          <div class="page-footer">
            <div class="footer-left">WWW.BYCONTRACTORSFORCONTRACTORS.COM</div>
            <div class="footer-right">CONTACT@CONSUMERSTRUSTAWARD.COM</div>
          </div>
        </div>

        <!-- Page 7: What You Get -->
        <div class="report-page page-7">
          <div class="page-content">
            <h2 class="what-you-get-title">WHAT YOU GET TODAY</h2>
            
            <p class="intro-text">The Insanely Great Appointment System includes:</p>
            
            <ul class="features-list">
              <li>✓ <strong>The Punctuality Promise</strong> - "The On-Time Guarantee: Give them this on-time guarantee when you make the appointment and win their trust immediately</li>
              
              <li>✓ <strong>Automated Text Template:</strong> Use this to confirm your appointment. Another trust builder</li>
              
              <li>✓ <strong>The Trust Trigger Checklist</strong> – the 4 actions in the first 90 seconds that build maximum trust</li>
              
              <li>✓ <strong>Paper Schedule System (For Non-Digital Users):</strong> Formatted as a clipboard-ready sheet. If you are 'tech savvy' it can easily be digitized.</li>
              
              <li>✓ <strong>Pre-Appointment Checklist</strong> - "The 5-Point Preparation Protocol" – Use this the night before so you can sleep better knowing you are prepared for tomorrow</li>
              
              <li>✓ <strong>30 Minutes Before Departure:</strong> Check these items to make sure you are prepared to arrive on time</li>
              
              <li>✓ <strong>Trust-Building Script</strong> – What to say during your appointment that makes them feel they can trust you and need not get other bids. The closer</li>
              
              <li>✓ <strong>The Trust Builder Bid Sheet</strong> – It improves communication and eliminates mis-communication. This is your golden ticket to more money and higher profits</li>
              
              <li>✓ <strong>Feedback about your punctuality and communication</strong> – This earns you your 'Punctuality Trust Badge' and 5-star reviews. Why not get your review now</li>
              
              <li>✓ <strong>One-Touch Review Generator:</strong> A simple card with a QR code given at the end of a punctual appointment that takes customers directly to a review page (optional)</li>
            </ul>
          </div>
          <div class="page-footer">
            <div class="footer-left">WWW.BYCONTRACTORSFORCONTRACTORS.COM</div>
            <div class="footer-right">CONTACT@CONSUMERSTRUSTAWARD.COM</div>
          </div>
        </div>

        <!-- Page 8: Trust Badge -->
        <div class="report-page page-8">
          <div class="page-content">
            <div class="badge-section">
              <div class="badge-container">
                <div class="badge-image">
                  <div class="badge-placeholder">
                    <h3 style="color: #2255a4; font-size: 24px; margin: 0;">PUNCTUAL</h3>
                    <p style="color: #ffcc00; font-size: 14px; margin: 5px 0;">PUNCTUALITY GUARANTEED</p>
                    <p style="color: #2255a4; font-size: 18px; margin: 0;">TRUST BADGE</p>
                  </div>
                </div>
              </div>
              
              <p class="badge-text">Show up on time, consistently, for 30 days, and you'll earn the <strong>'Punctuality Trust Badge'</strong> - something over <strong>1,500</strong> of us now proudly display.</p>
              
              <p class="think-about">Think about this:</p>
              
              <p><strong>The 'Punctuality Trust Badge' – Your Instant Credibility Booster.</strong> After 30 days of running your business like a PRO with these tools and showing you're hitting your times, you get this badge. Slap it on your website, your cards, your truck – everywhere. It's a flashing neon sign to other contractors and every homeowner out there: <strong>'This is a contractor who doesn't screw around with your time.'</strong> That trust? That's what gets you the job.</p>
              
              <div class="testimonial-section">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNFMEUwRTAiLz4KPHBhdGggZD0iTTQwIDQwQzQ0LjQxODMgNDAgNDggMzYuNDE4MyA0OCAzMkM0OCAyNy41ODE3IDQ0LjQxODMgMjQgNDAgMjRDMzUuNTgxNyAyNCAzMiAyNy41ODE3IDMyIDMyQzMyIDM2LjQxODMgMzUuNTgxNyA0MCA0MCA0MFoiIGZpbGw9IiM5OTk5OTkiLz4KPHBhdGggZD0iTTI0IDU2QzI0IDUxLjU4MTcgMjcuNTgxNyA0OCA0OEM1Mi40MTgzIDQ4IDU2IDUxLjU4MTcgNTYgNTZWNjBIMjRWNTZaIiBmaWxsPSIjOTk5OTk5Ii8+Cjwvc3ZnPg==" alt="Tom R." class="testimonial-image">
                
                <div class="testimonial-text">
                  <p class="quote">"I'll be straight with you guys, I used to be the poster child for 'contractor time.' You know the drill: showing up late, half-apologizing, the whole nine yards. I didn't think it was a huge deal, but then I started noticing jobs slipping away. Clients seemed hesitant, always asking about timelines upfront, real cautious-like.</p>
                  
                  <p class="quote">This Punctuality Trust Badge? That changed everything.</p>
                  
                  <p class="quote">The first month, I made a conscious effort to be on time, every single damn time. It wasn't always easy, but I stuck with the system. And you know what? It worked.</p>
                  
                  <p class="quote">After 30 days, I got that badge, slapped it on my truck and my website. It wasn't long until clients started treating me different - more respect, less haggling. They actually believed what I said.</p>
                  
                  <p class="quote">Jobs that I would've lost before? I was landing them. People were saying things like, 'It was a nice change to have a contractor show up when they said they would.' Referrals went through the roof.</p>
                  
                  <p class="quote">Bottom line? That badge isn't just a gimmick. It's a sign that you're a pro, a guy who values their time and their word. And in this business, that's worth more than any fancy tool. <strong>Earning that badge was one of the best things I ever did for my business.</strong>"</p>
                  
                  <p class="attribution">- Tom R., Remodeling Contractor</p>
                </div>
              </div>
            </div>
          </div>
          <div class="page-footer">
            <div class="footer-left">WWW.BYCONTRACTORSFORCONTRACTORS.COM</div>
            <div class="footer-right">CONTACT@CONSUMERSTRUSTAWARD.COM</div>
          </div>
        </div>

        <!-- Page 9: Final CTA -->
        <div class="report-page page-9">
          <div class="page-content">
            <div class="final-cta">
              <h2 class="cta-title">Your Chance to Be One of the Few:</h2>
              <h3 class="cta-subtitle">Claim Your Spot to Become the Trusted Go-To</h3>
              
              <div class="testimonial-highlight">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNFMEUwRTAiLz4KPHBhdGggZD0iTTQwIDQwQzQ0LjQxODMgNDAgNDggMzYuNDE4MyA0OCAzMkM0OCAyNy41ODE3IDQ0LjQxODMgMjQgNDAgMjRDMzUuNTgxNyAyNCAzMiAyNy41ODE3IDMyIDMyQzMyIDM2LjQxODMgMzUuNTgxNyA0MCA0MCA0MFoiIGZpbGw9IiM5OTk5OTkiLz4KPHBhdGggZD0iTTI0IDU2QzI0IDUxLjU4MTcgMjcuNTgxNyA0OCA0OEM1Mi40MTgzIDQ4IDU2IDUxLjU4MTcgNTYgNTZWNjBIMjRWNTZaIiBmaWxsPSIjOTk5OTk5Ii8+Cjwvc3ZnPg==" alt="Success Story" class="small-avatar">
                <p class="highlight-quote">"This simple system put an extra $20K in my pocket in the first three months, just by getting to our appointments when we said we would and building that trust. Seriously."</p>
              </div>
              
              <p>Alright, listen up. Look, I get it. Maybe being on time and actually building a solid rep around here in ${
                userInfo.city
              } isn't your top concern right now. You're busy, things are hectic. I'm not gonna lie, this isn't for everyone.</p>
              
              <p>But if you're sick of chasing your tail, losing out on jobs because folks don't trust you to show up, and you're ready to be the go-to, reliable contractor in ${
                userInfo.city
              }? Then listen close.</p>
              
              <p>Right now, we're opening up spots for just five more contractors – trying to keep a good mix of plumbers, sparkies, carpenters, remodelers, decks the whole nine yards – to join the growing crew of punctual, trusted professionals in ${
                userInfo.city
              }. This isn't a free ride, but it's the real deal.</p>
              
              <div class="offer-section">
                <h4>Today only:</h4>
                
                <p><strong>First off, a handshake guarantee:</strong> Purchase and take the Insanely Great Appointment System for a 10-day spin. If you look at it and think, 'Nah, this isn't gonna work for my crew,' just holler and we'll refund your damn money. No BS, no hard feelings.</p>
                
                <p><strong>But here's where it gets real interesting:</strong> Once you're hitting those on-time first appointments consistently and you've earned that 'Punctuality Trust Badge' – and believe me, over 1,500 of us have already snagged one – <strong>you're getting plugged into something big</strong>. We're building a serious marketing push right here in ${
                  userInfo.city
                } to promote the contractors who've earned that badge. Think of it as us shouting from the rooftops that <em>you're</em> the reliable son-of-a-gun to call. Homeowners in ${
    userInfo.city
  } get a clear list of trusted contractors, the ones who actually show up. It's like having your number on their speed dial for every job they need <strong>that you do</strong>. Short-term gigs, long-term referrals – this thing builds a pipeline that just keeps on giving.</p>
              </div>
              
              <div class="price-section">
                <p class="price-display">
                  <span class="original-price">$295.00</span>, today <span class="sale-price">$195.00</span>
                </p>
                
                <div class="cta-button-container">
                  <div class="cta-button">CLICK HERE TO PURCHASE</div>
                </div>
              </div>
            </div>
          </div>
          <div class="page-footer">
            <div class="footer-left">WWW.BYCONTRACTORSFORCONTRACTORS.COM</div>
            <div class="footer-right">CONTACT@CONSUMERSTRUSTAWARD.COM</div>
          </div>
        </div>

      </div>
    </body>
    </html>
  `;
}

/**
 * Get the CSS styles for the PDF report
 */
function getReportCSS() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Arial:wght@400;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #000000;
      background-color: white;
    }

    .report-container {
      width: 8.5in;
      margin: 0 auto;
      background-color: white;
    }

    .report-page {
      width: 8.5in;
      height: 11in;
      padding: 0.75in;
      position: relative;
      background-color: white;
      page-break-after: always;
      display: flex;
      flex-direction: column;
    }

    .report-page:last-child {
      page-break-after: auto;
    }

    .page-content {
      flex-grow: 1;
      padding-bottom: 60px;
    }

    .page-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #2255a4;
      padding: 10px 0.75in;
      display: flex;
      justify-content: space-between;
      color: white;
      font-size: 11px;
      font-weight: bold;
    }

    .footer-left, .footer-right {
      text-transform: uppercase;
    }

    /* Page 1 Styles */
    .header-box {
      background-color: #ffcc00;
      padding: 20px;
      text-align: center;
      margin-bottom: 30px;
      border-radius: 5px;
    }

    .main-title {
      color: #102d58;
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .subtitle {
      color: #2255a4;
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .tagline {
      font-size: 18px;
      font-weight: bold;
      color: #000;
      letter-spacing: 1px;
    }

    .section-title {
      color: #2255a4;
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      margin: 30px 0 20px;
    }

    .highlight-title {
      margin-top: 20px;
      font-weight: bold;
      font-size: 18px;
      color: #cc0000;
    }

    .cost-list {
      list-style: none;
      margin: 20px 0;
      padding-left: 20px;
    }

    .cost-list li {
      margin-bottom: 10px;
      color: #cc0000;
      font-weight: bold;
      position: relative;
    }

    .cost-list li:before {
      content: "•";
      position: absolute;
      left: -20px;
      color: #cc0000;
    }

    .cta-text {
      color: #cc0000;
      font-weight: bold;
      text-align: center;
      margin: 25px 0;
      font-size: 16px;
    }

    /* Page 2 Styles */
    .page-title {
      color: #2255a4;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 30px;
    }

    .content-section p {
      margin-bottom: 15px;
      text-align: justify;
    }

    /* Page 3 Styles */
    .intro-text {
      font-size: 16px;
      margin-bottom: 20px;
    }

    .reviews-container {
      margin: 20px 0;
    }

    .review-item {
      background-color: #f8f8f8;
      padding: 15px;
      margin-bottom: 15px;
      border-left: 4px solid #ffcc00;
      border-radius: 4px;
    }

    .stars {
      color: #ffcc00;
      font-size: 18px;
      margin-bottom: 10px;
    }

    .review-text {
      font-style: italic;
      color: #333;
    }

    .warning-section {
      margin-top: 30px;
    }

    .warning-text {
      font-weight: bold;
      margin-bottom: 10px;
    }

    .community-post {
      background-color: #f8f8f8;
      padding: 15px;
      border-radius: 4px;
      font-style: italic;
    }

    /* Page 4 Styles */
    .results-box {
      background-color: #f0f7f0;
      padding: 25px;
      border-radius: 8px;
      margin: 30px 0;
      border: 2px solid #16a34a;
    }

    .results-title {
      color: #2255a4;
      text-align: center;
      margin-bottom: 20px;
      font-size: 20px;
      font-weight: bold;
    }

    .green-text {
      color: #16a34a;
      font-weight: bold;
    }

    .results-list {
      list-style: none;
    }

    .results-list li {
      margin-bottom: 12px;
      font-size: 16px;
      color: #16a34a;
      font-weight: 600;
    }

    /* Page 5 Styles */
    .special-title {
      text-align: center;
      color: #2255a4;
      margin-bottom: 30px;
      font-size: 24px;
    }

    .positive-review {
      background-color: #f0f7f0;
      padding: 20px;
      margin-bottom: 15px;
      border-left: 4px solid #16a34a;
      border-radius: 4px;
      font-style: italic;
    }

    .conclusion-text {
      margin: 20px 0;
      text-align: center;
    }

    .section-divider {
      height: 2px;
      background-color: #e0e0e0;
      margin: 30px 0;
    }

    .section-title-green {
      color: #16a34a;
      font-size: 22px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 10px;
    }

    .section-subtitle {
      color: #2255a4;
      font-size: 18px;
      text-align: center;
      margin-bottom: 20px;
    }

    .income-converter {
      text-align: center;
      font-size: 18px;
      margin: 20px 0;
      font-weight: bold;
    }

    .red-text {
      color: #cc0000;
    }

    .testimonials {
      margin-top: 30px;
    }

    .testimonial {
      margin-bottom: 25px;
      padding: 15px;
      background-color: #f8f8f8;
      border-radius: 4px;
    }

    .quote {
      font-style: italic;
      margin-bottom: 10px;
    }

    .attribution {
      text-align: right;
      font-weight: bold;
      color: #555;
    }

    /* Page 6-8 Styles */
    .testimonial-with-image {
      display: flex;
      margin-bottom: 30px;
      align-items: flex-start;
    }

    .testimonial-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-right: 20px;
      flex-shrink: 0;
    }

    .testimonial-content {
      flex-grow: 1;
    }

    .highlight-box {
      background-color: #fff3cd;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
      border: 2px solid #ffcc00;
    }

    .question-text {
      font-size: 16px;
      margin: 20px 0;
      text-align: center;
    }

    .section-header {
      text-align: center;
      margin: 30px 0;
    }

    .section-header h3 {
      color: #2255a4;
      font-size: 20px;
    }

    /* Page 7 Styles */
    .what-you-get-title {
      color: #2255a4;
      font-size: 28px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 20px;
      background-color: #f0f7f0;
      padding: 15px;
      border-radius: 8px;
    }

    .features-list {
      list-style: none;
      margin: 20px 0;
    }

    .features-list li {
      margin-bottom: 15px;
      padding-left: 25px;
      position: relative;
      line-height: 1.8;
    }

    /* Page 8 Styles */
    .badge-section {
      text-align: center;
    }

    .badge-container {
      margin: 30px 0;
    }

    .badge-placeholder {
      width: 200px;
      height: 200px;
      background-color: #f0f7ff;
      border: 3px solid #2255a4;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
    }

    .badge-text {
      font-size: 16px;
      margin: 20px 0;
    }

    .think-about {
      font-weight: bold;
      margin: 20px 0;
    }

    .testimonial-section {
      margin-top: 30px;
      background-color: #f8f8f8;
      padding: 20px;
      border-radius: 8px;
    }

    .testimonial-image {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-bottom: 15px;
    }

    /* Page 9 Styles */
    .final-cta {
      padding: 20px;
    }

    .cta-title {
      color: #ffcc00;
      background-color: #2255a4;
      padding: 15px;
      text-align: center;
      font-size: 24px;
      margin-bottom: 10px;
    }

    .cta-subtitle {
      color: #2255a4;
      text-align: center;
      font-size: 20px;
      margin-bottom: 30px;
    }

    .testimonial-highlight {
      display: flex;
      align-items: center;
      background-color: #f0f7f0;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      border: 2px solid #16a34a;
    }

    .small-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 15px;
    }

    .highlight-quote {
      font-style: italic;
      font-weight: bold;
      font-size: 18px;
    }

    .offer-section {
      background-color: #f8f8f8;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }

    .offer-section h4 {
      color: #2255a4;
      font-size: 20px;
      margin-bottom: 15px;
    }

    .price-section {
      text-align: center;
      margin: 30px 0;
    }

    .price-display {
      font-size: 24px;
      margin-bottom: 20px;
    }

    .original-price {
      text-decoration: line-through;
      color: #888;
    }

    .sale-price {
      color: #16a34a;
      font-weight: bold;
      font-size: 28px;
    }

    .cta-button-container {
      text-align: center;
    }

    .cta-button {
      display: inline-block;
      background-color: #16a34a;
      color: white;
      padding: 15px 40px;
      font-size: 18px;
      font-weight: bold;
      border-radius: 8px;
      text-decoration: none;
      cursor: pointer;
    }

    @media print {
      .report-page {
        page-break-after: always;
        margin: 0;
        padding: 0.75in;
      }
      
      .report-page:last-child {
        page-break-after: auto;
      }
    }
  `;
}

/**
 * Create a loading indicator
 */
function createLoadingIndicator() {
  const loading = document.createElement("div");
  loading.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    color: white;
    font-size: 18px;
    font-weight: bold;
  `;
  loading.innerHTML = `
    <div style="text-align: center;">
      <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; animation: spin 2s linear infinite; margin-bottom: 20px; margin-left: auto; margin-right: auto;"></div>
      <div>Generating your complete report...</div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  return loading;
}

/**
 * Show a notification message
 */
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;

  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #16a34a;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    z-index: 10000;
    transform: translateY(100px);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.transform = "translateY(0)";
    notification.style.opacity = "1";
  }, 100);

  setTimeout(() => {
    notification.style.transform = "translateY(100px)";
    notification.style.opacity = "0";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 500);
  }, 4000);
}
