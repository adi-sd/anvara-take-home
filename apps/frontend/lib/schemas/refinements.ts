// Ensures that if both startDate and endDate are provided, endDate must be after startDate
export const dateRefinement = <T extends { startDate?: Date; endDate?: Date }>(
  data: Partial<T>
) => {
  if (data.startDate && data.endDate) {
    return data.endDate > data.startDate;
  }
  return true;
};

// Ensures that if expiresAt is provided, it must be a future date
export const validBasePriceRefinement = <T extends { basePrice?: number }>(data: Partial<T>) => {
  if (data.basePrice !== undefined) {
    return data.basePrice > 0;
  }
  return true;
};

// Ensures that if cpmFloor is provided, it must be a positive number and less than or equal to basePrice
export const validCpmPriceRefinement = <T extends { basePrice?: number; cpmFloor?: number }>(
  data: Partial<T>
) => {
  if (data.cpmFloor !== undefined && data.cpmFloor <= 0) {
    return false;
  }
  if (data.cpmFloor !== undefined && data.basePrice !== undefined) {
    return data.cpmFloor <= data.basePrice;
  }
  return true;
};
