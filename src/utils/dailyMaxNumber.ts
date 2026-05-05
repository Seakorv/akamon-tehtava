import type { SpotPrice } from "../App";

/**
 * Using reduce function to find the max daily (quarter hour) price from the dailyPrices.
 * Reduce first compares array's current item's (quarterPrice) maxPrice with current candidate to be a max value.
 * then if it is, it sends the quarterPrice to the next iteration's max and so on. If not, the max value stays the same.
 * Also checking if dailyPrices even exist by checking its lenght. If not, returning null
 * @param dailyPrices array of one day's hourly prices
 * @returns daily max quarter hour price without VAT in EUR/mWh
 */
export const getDailyMax = (dailyPrices: SpotPrice[]) => {
    const dailyMaxObject = dailyPrices.length
        ? dailyPrices.reduce((max, quarterPrice) =>
            quarterPrice.maxPriceWithoutVat > max.maxPriceWithoutVat 
            ? quarterPrice 
            : max
        )
        : null;

    /**
     * Converting the object to a number
     */
    const dailyMaxNumber = dailyMaxObject?.maxPriceWithoutVat ?? null;

    return { dailyMaxNumber };
}