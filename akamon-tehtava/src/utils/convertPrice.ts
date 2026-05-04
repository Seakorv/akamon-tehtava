const VAT_MULTIPLIER = 1.255;

/**
 * Converts the price from EUR/mWh without VAT to snt/kWh with VAT
 * @param priceEURMWH the price in EUR/mWh without VAT
 * @returns the price in snt/kWh with VAT added
 */
export const convertPrice = (priceEURMWH: number) => {
  return priceEURMWH * 0.1 * VAT_MULTIPLIER
};