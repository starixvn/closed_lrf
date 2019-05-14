export default class NumberFormat {
    static formatDecimal(value) {
        return this.format(value, 2)
    }

    static format(value, digits = 0) {
        if (typeof value !== "number" || isNaN(value)) {
            return "";
        }

        const roundedValue = this.round(value, digits);

        return roundedValue.toFixed(digits).replace(/(\d)(?=(\d{3})+(\.|$))/g, "$1,");
    }

    static round(value, digits) {
        const sign = value < 0 ? -1 : 1;
        const absoluteValue = Math.abs(value);
        const rounded = Number(Math.round(absoluteValue + 'e' + digits) + 'e-' + digits);

        return sign * rounded;
    }
}