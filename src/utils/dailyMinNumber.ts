import type { SpotPrice } from "../App";

/**
 * Using reduce function to find the min daily (quarter hour) price from the dailyPrices.
 * Reduce first compares array's current item's (quarterPrice) minPrice with current candidate to be a min value.
 * then if it is, it sends the quarterPrice to the next iteration's min and so on. If not, the max value stays the same.
 * Also checking if dailyPrices even exist by checking its lenght. If not, returning null
 * @param dailyPrices array of one day's hourly prices
 * @returns daily max quarter hour price without VAT in EUR/mWh
 */
export const getDailyMin = (dailyPrices: SpotPrice[]) => {
    const dailyMinObject = dailyPrices.length
        ? dailyPrices.reduce((min, quarterPrice) =>
        quarterPrice.minPriceWithoutVat < min.minPriceWithoutVat
            ? quarterPrice
            : min
        )
        : null;

    const dailyMinNumber = dailyMinObject?.minPriceWithoutVat ?? null;

    return { dailyMinNumber };
}
