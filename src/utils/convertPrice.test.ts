import { describe, it, expect } from 'vitest'
import { convertPrice } from './convertPrice'

describe('convertPrice', () => {
    it('converts price in EUR/mWh without VAT to c/kWh with VAT', () => {
        const result = convertPrice(420);

        // 420 * 0.1 * 1.255 = 52.71
        expect(result).toBeCloseTo(52.71);
    });

    it('handles negative prices', () => {
        const result = convertPrice(-10);

        // -10 * 0.1 * 1.255 = -1.255.
        // VAT doesn't really make sense here but doesn't really matter either
        expect(result).toBeCloseTo(-1.255);
    });

    it('handles when price is zero', () => {
        const result = convertPrice(0);

        expect(result).toBeCloseTo(0);
    })
});