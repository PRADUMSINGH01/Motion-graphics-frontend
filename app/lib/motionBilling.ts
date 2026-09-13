export const MOTION_CREDIT_PRICE_INR = 10;
export const STANDARD_GENERATION_CREDITS = 1;

export type MotionBillingQuote = {
  currency: "INR";
  generationCount: number;
  creditsPerGeneration: number;
  totalCredits: number;
  rateInrPerCredit: number;
  totalInr: number;
};

export function createMotionBillingQuote(generationCount = 1): MotionBillingQuote {
  const safeGenerationCount = Math.max(1, Math.floor(generationCount));
  const totalCredits = safeGenerationCount * STANDARD_GENERATION_CREDITS;

  return {
    currency: "INR",
    generationCount: safeGenerationCount,
    creditsPerGeneration: STANDARD_GENERATION_CREDITS,
    totalCredits,
    rateInrPerCredit: MOTION_CREDIT_PRICE_INR,
    totalInr: totalCredits * MOTION_CREDIT_PRICE_INR,
  };
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
