import NumberFormat from '../numberFormat';

describe('NumberFormat ', () => {
    describe('format', () => {
        function assertFormat({ value, digits, expected }) {
            it(`value=${value}, digits=${digits} - return ${expected}`, () => {
                const result = NumberFormat.format(value, digits);

                expect(result).toBe(expected);
            })
        }

        const testCases = [
            { value: NaN, digits: undefined, expected: "" },
            { value: 2000, digits: undefined, expected: "2,000" },
            { value: 2000, digits: 1, expected: "2,000.0" },
            { value: 2000.5555, digits: 3, expected: "2,000.556" },
            { value: -2000.5555, digits: 3, expected: "-2,000.556" },
            { value: 200, digits: 3, expected: "200.000" },
            { value: 1.0155, digits: 3, expected: "1.016" },
            { value: -1.0155, digits: 3, expected: "-1.016" },
            { value: 0, digits: 3, expected: "0.000" },
            { value: undefined, digits: 3, expected: "" },
            { value: "Abc", digits: 3, expected: "" }
        ]

        testCases.forEach(assertFormat);
    })

    describe('formatDecimal', () => {
        function assertFormat({ value, expected }) {
            it(`value=${value} - return ${expected}`, () => {
                const result = NumberFormat.formatDecimal(value);

                expect(result).toBe(expected);
            })
        }

        const testCases = [
            { value: 2000.23, expected: "2,000.23" },
            { value: -2000, expected: "-2,000.00" },
            { value: 2000.345, expected: "2,000.35" },
            { value: 0, expected: "0.00" },
            { value: 1.0155, expected: "1.02" },
            { value: -1.0155, expected: "-1.02" },
            { value: 2, expected: "2.00" },
            { value: -2, expected: "-2.00" },
            { value: 999999999999999, expected: "999,999,999,999,999.00" },
            { value: -999999999999999, expected: "-999,999,999,999,999.00" }
        ]

        testCases.forEach(assertFormat);
    })
})