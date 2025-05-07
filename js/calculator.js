/**
 * Core calculation logic for the Punctuality Profit Calculator
 */

// Constants used in calculations
const CONSTANTS = {
  CALLBACK_COST: 285, // Average callback cost $285
  REFERRAL_COST: 133, // Average referral cost $133
  PUNCTUALITY_CLOSE_RATE: 0.75, // 75% close rate with punctuality
  REFERRALS_PER_CUSTOMER: 2, // Average number of referrals from satisfied customers
  ANNUAL_WEEKS: 52, // Weeks in a year
  ANNUAL_DAYS: 260, // Working days in a year (5 days * 52 weeks)
  ANNUAL_HOURS: 2080, // Working hours in a year (8 hours * 260 days)
  INTEREST_RATE: 0.07, // 7% annual interest for retirement calculation
  RETIREMENT_YEARS: 20, // Years to calculate retirement savings
  FAMILY_VACATION_COST: 5000, // Average cost of a family vacation
  TRUCK_PAYMENT: 650, // Average monthly truck payment
  PREMIUM_RATE: 0.15, // 15% premium for guaranteed punctuality
};

// Class to handle all calculations
class PunctualityCalculator {
  constructor() {
    // Default values
    this.defaultValues = {
      averageJobValue: 3000,
      appointmentsPerWeek: 10,
      currentCloseRate: 50, // as percentage (50%)
      callbackRate: 50, // as percentage (50%)
      latenessPercentage: 40, // as percentage (40%)
    };

    // Actual input values (will be updated by user inputs)
    this.inputs = { ...this.defaultValues };

    // Results object to store calculated values
    this.results = {};
  }

  /**
   * Set input values from user interface
   * @param {Object} inputValues - Object containing user input values
   */
  setInputs(inputValues) {
    // Validate and update input values
    this.inputs = {
      ...this.inputs,
      ...inputValues,
    };

    // Apply input validation rules
    this.validateInputs();

    return this;
  }

  /**
   * Reset to default values
   */
  resetToDefaults() {
    this.inputs = { ...this.defaultValues };
    return this;
  }

  /**
   * Validate inputs to prevent unrealistic values
   */
  validateInputs() {
    // Ensure averageJobValue is within reasonable bounds
    if (this.inputs.averageJobValue < 500) {
      this.inputs.averageJobValue = 500;
    } else if (this.inputs.averageJobValue > 50000) {
      this.inputs.averageJobValue = 50000;
    }

    // Ensure appointmentsPerWeek is a reasonable number
    if (this.inputs.appointmentsPerWeek < 1) {
      this.inputs.appointmentsPerWeek = 1;
    } else if (this.inputs.appointmentsPerWeek > 50) {
      this.inputs.appointmentsPerWeek = 50;
    }

    // Ensure currentCloseRate is within reasonable bounds
    if (this.inputs.currentCloseRate < 30) {
      this.inputs.currentCloseRate = 30;
    } else if (this.inputs.currentCloseRate > 75) {
      this.inputs.currentCloseRate = 75;
    }

    // Ensure callbackRate is within reasonable bounds
    if (this.inputs.callbackRate < 0) {
      this.inputs.callbackRate = 0;
    } else if (this.inputs.callbackRate > 100) {
      this.inputs.callbackRate = 100;
    }

    // Ensure latenessPercentage is within reasonable bounds
    if (this.inputs.latenessPercentage < 0) {
      this.inputs.latenessPercentage = 0;
    } else if (this.inputs.latenessPercentage > 100) {
      this.inputs.latenessPercentage = 100;
    }
  }

  /**
   * Calculate potential contracts with punctuality
   * @returns {number} The number of potential contracts with good punctuality
   */
  calculatePotentialContracts() {
    return this.inputs.appointmentsPerWeek * CONSTANTS.PUNCTUALITY_CLOSE_RATE;
  }

  /**
   * Calculate actual contracts with current close rate
   * @returns {number} The number of actual contracts with current close rate
   */
  calculateActualContracts() {
    return (
      this.inputs.appointmentsPerWeek * (this.inputs.currentCloseRate / 100)
    );
  }

  /**
   * Calculate lost contracts per week due to punctuality issues
   * @returns {number} The number of lost contracts per week
   */
  calculateLostContractsPerWeek() {
    const potentialContracts = this.calculatePotentialContracts();
    const actualContracts = this.calculateActualContracts();
    return Math.max(0, potentialContracts - actualContracts);
  }

  /**
   * Calculate lost revenue per week
   * @returns {number} The lost revenue per week
   */
  calculateLostRevenuePerWeek() {
    const lostContractsPerWeek = this.calculateLostContractsPerWeek();
    return lostContractsPerWeek * this.inputs.averageJobValue;
  }

  /**
   * Calculate annual lost revenue
   * @returns {number} The annual lost revenue
   */
  calculateAnnualLostRevenue() {
    return this.calculateLostRevenuePerWeek() * CONSTANTS.ANNUAL_WEEKS;
  }

  /**
   * Calculate number of late appointments per week
   * @returns {number} The number of late appointments per week
   */
  calculateLateAppointments() {
    return (
      this.inputs.appointmentsPerWeek * (this.inputs.latenessPercentage / 100)
    );
  }

  /**
   * Calculate number of callbacks per week
   * @returns {number} The number of callbacks per week
   */
  calculateCallbacksPerWeek() {
    const lateAppointments = this.calculateLateAppointments();
    return lateAppointments * (this.inputs.callbackRate / 100);
  }

  /**
   * Calculate cost of callbacks per week
   * @returns {number} The cost of callbacks per week
   */
  calculateCallbackCostPerWeek() {
    const callbacksPerWeek = this.calculateCallbacksPerWeek();
    return callbacksPerWeek * CONSTANTS.CALLBACK_COST;
  }

  /**
   * Calculate annual callback cost
   * @returns {number} The annual callback cost
   */
  calculateAnnualCallbackCost() {
    return this.calculateCallbackCostPerWeek() * CONSTANTS.ANNUAL_WEEKS;
  }

  /**
   * Calculate lost referrals per week
   * @returns {number} The number of lost referrals per week
   */
  calculateLostReferralsPerWeek() {
    const lostContractsPerWeek = this.calculateLostContractsPerWeek();
    return lostContractsPerWeek * CONSTANTS.REFERRALS_PER_CUSTOMER;
  }

  /**
   * Calculate cost of lost referrals per week
   * @returns {number} The cost of lost referrals per week
   */
  calculateReferralCostPerWeek() {
    const lostReferralsPerWeek = this.calculateLostReferralsPerWeek();
    return lostReferralsPerWeek * CONSTANTS.REFERRAL_COST;
  }

  /**
   * Calculate annual referral cost
   * @returns {number} The annual referral cost
   */
  calculateAnnualReferralCost() {
    return this.calculateReferralCostPerWeek() * CONSTANTS.ANNUAL_WEEKS;
  }

  /**
   * Calculate total weekly loss
   * @returns {number} The total weekly loss
   */
  calculateWeeklyLoss() {
    const lostRevenuePerWeek = this.calculateLostRevenuePerWeek();
    const callbackCostPerWeek = this.calculateCallbackCostPerWeek();
    const referralCostPerWeek = this.calculateReferralCostPerWeek();

    return lostRevenuePerWeek + callbackCostPerWeek + referralCostPerWeek;
  }

  /**
   * Calculate total annual loss
   * @returns {number} The total annual loss
   */
  calculateAnnualLoss() {
    return this.calculateWeeklyLoss() * CONSTANTS.ANNUAL_WEEKS;
  }

  /**
   * Calculate total five-year loss
   * @returns {number} The total five-year loss
   */
  calculateFiveYearLoss() {
    return this.calculateAnnualLoss() * 5;
  }

  /**
   * Calculate hourly burn rate
   * @returns {number} The hourly burn rate
   */
  calculateHourlyBurnRate() {
    return this.calculateAnnualLoss() / CONSTANTS.ANNUAL_HOURS;
  }

  /**
   * Calculate daily burn rate
   * @returns {number} The daily burn rate
   */
  calculateDailyBurnRate() {
    return this.calculateAnnualLoss() / CONSTANTS.ANNUAL_DAYS;
  }

  /**
   * Calculate retirement value after 20 years
   * @returns {number} The retirement value
   */
  calculateRetirementValue() {
    // Compound interest formula: P(1 + r)^t
    const principal = this.calculateAnnualLoss();
    const rate = CONSTANTS.INTEREST_RATE;
    const time = CONSTANTS.RETIREMENT_YEARS;

    return principal * Math.pow(1 + rate, time);
  }

  /**
   * Calculate number of family vacations lost
   * @returns {number} The number of family vacations lost
   */
  calculateVacationsLost() {
    return Math.floor(
      this.calculateAnnualLoss() / CONSTANTS.FAMILY_VACATION_COST
    );
  }

  /**
   * Calculate number of truck payments lost
   * @returns {number} The number of truck payments lost (in months)
   */
  calculateTruckPaymentsLost() {
    return Math.floor(this.calculateAnnualLoss() / CONSTANTS.TRUCK_PAYMENT);
  }

  /**
   * Calculate tool budget lost
   * @returns {number} The tool budget lost
   */
  calculateToolBudgetLost() {
    // Assume 20% of annual loss could go to tools
    return this.calculateAnnualLoss() * 0.2;
  }

  /**
   * Calculate potential premium revenue
   * @returns {number} The potential premium revenue
   */
  calculatePremiumRevenue() {
    // Calculate annual revenue
    const weeklyContracts = this.calculateActualContracts();
    const annualContracts = weeklyContracts * CONSTANTS.ANNUAL_WEEKS;
    const annualRevenue = annualContracts * this.inputs.averageJobValue;

    // Calculate premium revenue (15% premium)
    return annualRevenue * CONSTANTS.PREMIUM_RATE;
  }

  /**
   * Calculate current annual revenue
   * @returns {number} The current annual revenue
   */
  calculateCurrentRevenue() {
    const weeklyContracts = this.calculateActualContracts();
    const annualContracts = weeklyContracts * CONSTANTS.ANNUAL_WEEKS;
    return annualContracts * this.inputs.averageJobValue;
  }

  /**
   * Calculate potential annual revenue with punctuality
   * @returns {number} The potential annual revenue
   */
  calculatePotentialRevenue() {
    const weeklyContracts = this.calculatePotentialContracts();
    const annualContracts = weeklyContracts * CONSTANTS.ANNUAL_WEEKS;

    // Add premium revenue
    const baseRevenue = annualContracts * this.inputs.averageJobValue;
    const premiumRevenue = baseRevenue * CONSTANTS.PREMIUM_RATE;

    return baseRevenue + premiumRevenue;
  }

  /**
   * Calculate percentage increase in revenue with punctuality
   * @returns {number} The percentage increase
   */
  calculateRevenuePercentIncrease() {
    const currentRevenue = this.calculateCurrentRevenue();
    const potentialRevenue = this.calculatePotentialRevenue();

    return ((potentialRevenue - currentRevenue) / currentRevenue) * 100;
  }

  /**
   * Perform all calculations and return results
   * @returns {Object} Object containing all calculation results
   */
  calculate() {
    // Base calculations
    const lostRevenuePerWeek = this.calculateLostRevenuePerWeek();
    const callbackCostPerWeek = this.calculateCallbackCostPerWeek();
    const referralCostPerWeek = this.calculateReferralCostPerWeek();

    // Total costs
    const weeklyLoss = this.calculateWeeklyLoss();
    const annualLoss = this.calculateAnnualLoss();
    const fiveYearLoss = this.calculateFiveYearLoss();

    // Additional metrics
    const hourlyBurnRate = this.calculateHourlyBurnRate();
    const dailyBurnRate = this.calculateDailyBurnRate();
    const retirementValue = this.calculateRetirementValue();
    const vacationsLost = this.calculateVacationsLost();
    const truckPaymentsLost = this.calculateTruckPaymentsLost();
    const toolBudgetLost = this.calculateToolBudgetLost();

    // Revenue comparisons
    const currentRevenue = this.calculateCurrentRevenue();
    const potentialRevenue = this.calculatePotentialRevenue();
    const revenuePercentIncrease = this.calculateRevenuePercentIncrease();
    const premiumRevenue = this.calculatePremiumRevenue();

    // Annual costs breakdown
    const annualLostRevenue = this.calculateAnnualLostRevenue();
    const annualCallbackCost = this.calculateAnnualCallbackCost();
    const annualReferralCost = this.calculateAnnualReferralCost();

    // Store results
    this.results = {
      // Weekly values
      lostRevenuePerWeek,
      callbackCostPerWeek,
      referralCostPerWeek,
      weeklyLoss,

      // Annual and long-term values
      annualLoss,
      fiveYearLoss,
      annualLostRevenue,
      annualCallbackCost,
      annualReferralCost,

      // Burn rates
      hourlyBurnRate,
      dailyBurnRate,

      // Additional metrics
      retirementValue,
      vacationsLost,
      truckPaymentsLost,
      toolBudgetLost,

      // Revenue comparisons
      currentRevenue,
      potentialRevenue,
      revenuePercentIncrease,
      premiumRevenue,

      // Chart data
      lossBreakdown: [
        {
          label: "Lost Contracts",
          value: annualLostRevenue,
          color: "#ef4444", // red
        },
        {
          label: "Callback Costs",
          value: annualCallbackCost,
          color: "#f97316", // orange
        },
        {
          label: "Lost Referrals",
          value: annualReferralCost,
          color: "#8b5cf6", // purple
        },
      ],
    };

    return this.results;
  }

  /**
   * Save calculations to local storage
   */
  saveResults() {
    try {
      localStorage.setItem("punctualityInputs", JSON.stringify(this.inputs));
      localStorage.setItem("punctualityResults", JSON.stringify(this.results));
      return true;
    } catch (error) {
      console.error("Error saving results:", error);
      return false;
    }
  }

  /**
   * Load calculations from local storage
   */
  loadResults() {
    try {
      const savedInputs = localStorage.getItem("punctualityInputs");
      const savedResults = localStorage.getItem("punctualityResults");

      if (savedInputs) {
        this.inputs = JSON.parse(savedInputs);
      }

      if (savedResults) {
        this.results = JSON.parse(savedResults);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error loading results:", error);
      return false;
    }
  }
}

// Export the calculator instance
const calculator = new PunctualityCalculator();
