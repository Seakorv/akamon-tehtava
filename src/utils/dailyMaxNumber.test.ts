import { describe, it, expect } from 'vitest';
import { getDailyMax } from './dailyMaxNumber';
import type { SpotPrice } from '../App'

const testData: SpotPrice[] = [
    {
        maxPriceWithoutVat: 10.49,
        minPriceWithoutVat: 3.11,
        meanPriceWithoutVat: 10.49,
        period: { start: "2026-05-05T10:32:16+00:00"}
    },
    {
        maxPriceWithoutVat: 100.49,
        minPriceWithoutVat: 234.11,
        meanPriceWithoutVat: 47.49,
        period: { start: "2026-05-06T10:32:16+00:00"}
    },
    {
        maxPriceWithoutVat: 2.49,
        minPriceWithoutVat: 1.11,
        meanPriceWithoutVat: 1.49,
        period: { start: "2026-05-04T10:32:16+00:00"}
    }
];

describe("getDailyMax", () => {
    it("returns the highest price without VAT in EUR/mWh", () => {
        const result = getDailyMax(testData);

        expect(result.dailyMaxNumber).toBe(100.49);
    });

    it("handles empty array properly (returns null)", () => {
        const result = getDailyMax([]);

        expect(result.dailyMaxNumber).toBeNull();
    });

    it("handles single item arrays", () => {
        const oneItem: SpotPrice[] = [testData[2]];
        const result = getDailyMax(oneItem);

        expect(result.dailyMaxNumber).toBe(2.49);
    });
});