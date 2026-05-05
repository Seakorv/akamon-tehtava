import { describe, it, expect } from 'vitest';
import { getDailyMin } from './dailyMinNumber';
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

const testDataNegative: SpotPrice[] = [
    {
        maxPriceWithoutVat: 10.49,
        minPriceWithoutVat: -3.11,
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
    },
    {
        maxPriceWithoutVat: 0,
        minPriceWithoutVat: 0,
        meanPriceWithoutVat: 0,
        period: { start: "2026-05-02T10:32:16+00:00"}
    }
];

describe("getDailyMin", () => {
    it("returns the smallest price without VAT in EUR/mWh", () => {
        const result = getDailyMin(testData);

        expect(result.dailyMinNumber).toBe(1.11);
    });

    it("handles empty array properly (returns null)", () => {
        const result = getDailyMin([]);

        expect(result.dailyMinNumber).toBeNull();
    });

    it("handles single item arrays", () => {
        const oneItem: SpotPrice[] = [testData[0]];
        const result = getDailyMin(oneItem);

        expect(result.dailyMinNumber).toBe(3.11);
    });

    it("handles negative numbers", () => {
        const result = getDailyMin(testDataNegative);

        expect(result.dailyMinNumber).toBe(-3.11);
    });
});