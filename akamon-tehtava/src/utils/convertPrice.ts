const VAT_MULTIPLIER = 1.255;

/**
 * Converts the price from EUR/mWh without VAT to c/kWh with VAT
 * @param priceEURMWH the price in EUR/mWh without VAT
 * @returns the price in c/kWh with VAT added
 */
export const convertPrice = (priceEURMWH: number) => {
  return priceEURMWH * 0.1 * VAT_MULTIPLIER
};
