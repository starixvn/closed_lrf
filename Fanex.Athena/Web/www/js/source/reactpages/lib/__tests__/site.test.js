import moment from 'moment'
import Site from '../site'

describe('Site ', () => {
    it('getXsrfToken - return correct value', () => {
        const expectedToken = "xxx_yyy";
        const input = document.createElement("input");
        input.type="hidden";
        input.name = "__RequestVerificationToken";
        input.value = expectedToken;
        document.body.appendChild(input);

        let token = Site.getXsrfToken();
        document.body.removeChild(input);

        expect(token).toBe(expectedToken);
    })

    it('getXsrfToken - XsrfToken is not null - return XsrfToken', () => {
        const expectedToken = "xxx_yyy";
        const input = document.createElement("input");
        input.type="hidden";
        input.name = "__RequestVerificationToken";
        input.value = expectedToken;
        document.body.appendChild(input);

        let token = Site.getXsrfToken();
        document.body.removeChild(input);

        let token2 = Site.getXsrfToken();
        expect(token2).toBe(token);
    })

    it('resolveClientUrl - return correct value', () => {
        const expectedResult = "/api/Action";

        const result = Site.resolveClientUrl("api/Action");

        expect(result).toBe(expectedResult);
    })

    describe('convertDateToString', () => {
        it('type of date param is string - return date', () => {
            const date = "10/01/2017";

            const result = Site.convertDateToString(date);

            expect(result).toBe(date);
        })

        it('type of date param is moment object - return formatted date', () => {
            const dateString = "10/01/2017";
            const date = moment(dateString, "MM/DD/YYYY");

            const result = Site.convertDateToString(date);

            expect(result).toBe(dateString);
        })
    })

    describe("asNull", () => {
        it("text is null - return itself", () => {
            const text = null;
            const result = Site.asNull(text);

            expect(result).toBe(text);
        })

        it("text is empty - return null", () => {
            const text = "";
            const result = Site.asNull(text);

            expect(result).toBe(null);
        })

        it("text is white space - return null", () => {
            const text = " ";
            const result = Site.asNull(text);

            expect(result).toBe(null);
        })

        it("text has value - return itself with trimming", () => {
            const text = "value ";
            const expectedResult = "value";

            const result = Site.asNull(text);

            expect(result).toBe(expectedResult);
        })
    })
})