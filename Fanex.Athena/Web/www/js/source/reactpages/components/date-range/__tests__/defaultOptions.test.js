import moment from 'moment'
import { MomentFormat } from '../constants'
import LangHelper from "../../../lib/langHelper";
import defaultOptions from '../defaultOptions'

describe('defaultOptions - ', () => {
    describe('ranges - ', () => {
        beforeAll(() => {
            LangHelper.getSingleResource = jest.fn((str) => str);
        })

        it('today is undefined - get today value in system', () => {
            const ranges = defaultOptions.ranges();
            const expectedResult = moment().format(MomentFormat.default);

            const startDate = ranges.Today.startDate.format(MomentFormat.default);
            const endDate = ranges.Today.endDate.format(MomentFormat.default);

            expect(startDate).toEqual(expectedResult);
            expect(endDate).toEqual(expectedResult);
        })

        it('today is string - parse today value to moment object - Today value should be correct', () => {
            const today = "11/24/2017";
            const ranges = defaultOptions.ranges(today);
            const expectedResult = moment(today, MomentFormat.default);

            expect(ranges.Today.startDate).toEqual(expectedResult);
            expect(ranges.Today.endDate).toEqual(expectedResult);
        })

        it('today is moment obejct - Today value should be correct', () => {
            const today = "11/24/2017";
            const todayMoment = moment(today, MomentFormat.default);
            const ranges = defaultOptions.ranges(todayMoment);

            expect(ranges.Today.startDate).toEqual(todayMoment);
            expect(ranges.Today.endDate).toEqual(todayMoment);
        })

        it('min Date is undefined - get value from today', () => {
            const today = moment("11/24/2017", MomentFormat.default);
            const ranges = defaultOptions.ranges(today);            

            const startDate = ranges.Today.startDate;
            const endDate = ranges.Today.endDate;

            expect(startDate).toEqual(today);
            expect(endDate).toEqual(today);
        })

        it('max Date is undefined - get value from today', () => {
            const today = moment("11/24/2017", MomentFormat.default);
            const ranges = defaultOptions.ranges(today);            

            const startDate = ranges.Today.startDate;
            const endDate = ranges.Today.endDate;

            expect(startDate).toEqual(today);
            expect(endDate).toEqual(today);
        })

        it('min Date is string - parse min Date value to moment object - value should be correct', () => {
            const today = "4/26/2018";
            const min = "4/25/2018";
            const ranges = defaultOptions.ranges(today, min);
            const expectedResult = moment(min, MomentFormat.default);

            expect(ranges.Currentweek.startDate).toEqual(expectedResult);
        })

        it('max Date is string - parse max Date value to moment object - value should be correct', () => {
            const today = "4/26/2018";
            const min = "4/20/2018";
            const max = "4/25/2018";
            const ranges = defaultOptions.ranges(today, min, max);
            const expectedResult = moment(max, MomentFormat.default);

            expect(ranges.Currentweek.endDate).toEqual(expectedResult);
        })

        it('min Date is moment obejct - value should be correct', () => {
            const today = "4/26/2018";
            const min = moment("4/25/2018", MomentFormat.default);
            const ranges = defaultOptions.ranges(today, min);

            expect(ranges.Currentweek.startDate).toEqual(min);
        })

        it('max Date is moment obejct - value should be correct', () => {
            const today = "4/26/2018";
            const min = "4/20/2018";
            const max = moment("4/25/2018", MomentFormat.default);
            const ranges = defaultOptions.ranges(today, min, max);

            expect(ranges.Currentweek.endDate).toEqual(max);
        })

        it('today is less than min date - no arrange', () => {
            const today = "1/6/2018";
            const min = "6/1/2018";
            const max = "6/20/2018";
            const ranges = defaultOptions.ranges(today, min, max);

            expect(ranges).toEqual({});
        })

        describe('today ranges - ', () => {
            it('today is not in range of min and max date - no "Today" arrange', () => {
                const today = "1/6/2018";
                const min = "1/1/2018";
                const max = "1/5/2018";
                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Today).toEqual(undefined);
            })

            it('today is in range of min and max date - add "Today" arrange', () => {
                const today = "1/6/2018";
                const min = "1/1/2018";
                const max = "1/7/2018";
                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Today.startDate.format("M/D/YYYY")).toEqual(today);
                expect(ranges.Today.endDate.format("M/D/YYYY")).toEqual(today);
            })
        })

        describe('yesterday ranges - ', () => {
            it('yesterday is not in range of min and max date - no "Yesterday" arrange', () => {
                const today = "1/1/2018";
                const min = "1/1/2018";
                const max = "1/20/2018";
                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Yesterday).toEqual(undefined);
            })

            it('yesterday is in range of min and max date - add "Yesterday" arrange', () => {
                const today = "1/6/2018";
                const yesterday = "1/5/2018";
                const min = "1/5/2018";
                const max = "1/7/2018";
                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Yesterday.startDate.format("M/D/YYYY")).toEqual(yesterday);
                expect(ranges.Yesterday.endDate.format("M/D/YYYY")).toEqual(yesterday);
            })
        })

        describe('currentweek ranges - ', () => {
            it('start current week day is greater than max date - no "Currentweek" arrange', () => {
                const today = "4/12/2018";
                const min = "4/1/2018";
                const max = "4/7/2018";
                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Currentweek).toEqual(undefined);
            })

            it('end current week day is less than min date - no "Currentweek" arrange', () => {
                const today = "4/12/2018";
                const min = "4/13/2018";
                const max = "4/20/2018";
                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Currentweek).toEqual(undefined);
            })

            it('current week day is in range of min and max date - add "Currentweek" arrange with start/end date is start current week/today', () => {
                const today = "4/12/2018";
                const min = "4/1/2018";
                const max = "4/20/2018";

                const startCurrentWeek = "4/8/2018";

                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Currentweek.startDate.format("M/D/YYYY")).toEqual(startCurrentWeek);
                expect(ranges.Currentweek.endDate.format("M/D/YYYY")).toEqual(today);
            })

            it('start current week day is in range of min and max date and max < today - add "Currentweek" arrange with start/end date is start current week/max', () => {
                const today = "4/12/2018";
                const min = "4/1/2018";
                const max = "4/10/2018";

                const startCurrentWeek = "4/8/2018";

                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Currentweek.startDate.format("M/D/YYYY")).toEqual(startCurrentWeek);
                expect(ranges.Currentweek.endDate.format("M/D/YYYY")).toEqual(max);
            })

            it('end current week day is in range of min and max date and min > start current week - add "Currentweek" arrange with start/end date is min/today', () => {
                const today = "4/12/2018";
                const min = "4/9/2018";
                const max = "4/20/2018";

                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Currentweek.startDate.format("M/D/YYYY")).toEqual(min);
                expect(ranges.Currentweek.endDate.format("M/D/YYYY")).toEqual(today);
            })

            it('start current week < min and today > max - add "Currentweek" arrange with start/end date is min/max', () => {
                const today = "4/12/2018";
                const min = "4/9/2018";
                const max = "4/10/2018";

                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Currentweek.startDate.format("M/D/YYYY")).toEqual(min);
                expect(ranges.Currentweek.endDate.format("M/D/YYYY")).toEqual(max);
            })
        })

        describe('lastweek ranges - ', () => {
            it('start last week day is greater than max date - no "Lastweek" arrange', () => {
                const today = "4/12/2018";
                const min = "3/1/2018";
                const max = "3/31/2018";
                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Lastweek).toEqual(undefined);
            })

            it('end last week day is less than min date - no "Lastweek" arrange', () => {
                const today = "4/12/2018";
                const min = "4/15/2018";
                const max = "4/20/2018";
                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Lastweek).toEqual(undefined);
            })

            it('last week day is in range of min and max date - add "Lastweek" arrange with start/end date is start/end last week', () => {
                const today = "4/12/2018";
                const min = "3/1/2018";
                const max = "4/20/2018";

                const startLastWeek = "4/1/2018";
                const endLastWeek = "4/7/2018";

                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Lastweek.startDate.format("M/D/YYYY")).toEqual(startLastWeek);
                expect(ranges.Lastweek.endDate.format("M/D/YYYY")).toEqual(endLastWeek);
            })

            it('start last week day is in range of min and max date and max < end last week - add "Lastweek" arrange with start/end date is start last week/max', () => {
                const today = "4/12/2018";
                const min = "4/1/2018";
                const max = "4/5/2018";

                const startLastWeek = "4/1/2018";

                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Lastweek.startDate.format("M/D/YYYY")).toEqual(startLastWeek);
                expect(ranges.Lastweek.endDate.format("M/D/YYYY")).toEqual(max);
            })

            it('end last week day is in range of min and max date and min > start last week - add "Lastweek" arrange with start/end date is min/end last week', () => {
                const today = "4/12/2018";
                const min = "4/5/2018";
                const max = "4/20/2018";

                const endLastWeek = "4/7/2018";

                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Lastweek.startDate.format("M/D/YYYY")).toEqual(min);
                expect(ranges.Lastweek.endDate.format("M/D/YYYY")).toEqual(endLastWeek);
            })

            it('start last week < min and end last week  > max - add "Lastweek" arrange with start/end date is min/max', () => {
                const today = "4/12/2018";
                const min = "4/2/2018";
                const max = "4/5/2018";

                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Lastweek.startDate.format("M/D/YYYY")).toEqual(min);
                expect(ranges.Lastweek.endDate.format("M/D/YYYY")).toEqual(max);
            })
        })

        describe('Currentmonth ranges - ', () => {
            it('start current month day is greater than max date - no "Currentmonth" arrange', () => {
                const today = "4/12/2018";
                const min = "3/1/2018";
                const max = "3/31/2018";
                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Currentmonth).toEqual(undefined);
            })

            it('end current month day is less than min date - no "Currentmonth" arrange', () => {
                const today = "4/12/2018";
                const min = "5/1/2018";
                const max = "5/31/2018";
                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Currentmonth).toEqual(undefined);
            })

            it('current month day is in range of min and max date - add "Currentmonth" arrange with start/end date is start current month/today', () => {
                const today = "4/12/2018";
                const min = "3/1/2018";
                const max = "5/31/2018";

                const startCurrentmonth = "4/1/2018";

                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Currentmonth.startDate.format("M/D/YYYY")).toEqual(startCurrentmonth);
                expect(ranges.Currentmonth.endDate.format("M/D/YYYY")).toEqual(today);
            })

            it('start current month day is in range of min and max date and max < today - add "Currentmonth" arrange with start/end date is start current month/max', () => {
                const today = "4/12/2018";
                const min = "3/1/2018";
                const max = "4/10/2018";

                const startCurrentmonth = "4/1/2018";

                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Currentmonth.startDate.format("M/D/YYYY")).toEqual(startCurrentmonth);
                expect(ranges.Currentmonth.endDate.format("M/D/YYYY")).toEqual(max);
            })

            it('end current month day is in range of min and max date and min > start current month - add "Currentmonth" arrange with start/end date is min/today', () => {
                const today = "4/12/2018";
                const min = "4/9/2018";
                const max = "5/31/2018";

                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Currentmonth.startDate.format("M/D/YYYY")).toEqual(min);
                expect(ranges.Currentmonth.endDate.format("M/D/YYYY")).toEqual(today);
            })

            it('start current month < min and today > max - add "Currentmonth" arrange with start/end date is min/max', () => {
                const today = "4/12/2018";
                const min = "4/9/2018";
                const max = "4/10/2018";

                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Currentmonth.startDate.format("M/D/YYYY")).toEqual(min);
                expect(ranges.Currentmonth.endDate.format("M/D/YYYY")).toEqual(max);
            })
        })

        describe('lastmonth ranges - ', () => {
            it('start last month day is greater than max date - no "Lastmonth" arrange', () => {
                const today = "4/12/2018";
                const min = "2/1/2018";
                const max = "2/28/2018";
                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Lastmonth).toEqual(undefined);
            })

            it('end last month day is less than min date - no "Lastmonth" arrange', () => {
                const today = "4/12/2018";
                const min = "4/15/2018";
                const max = "4/20/2018";
                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Lastmonth).toEqual(undefined);
            })

            it('last month day is in range of min and max date - add "Lastmonth" arrange with start/end date is start/end last month', () => {
                const today = "4/12/2018";
                const min = "2/1/2018";
                const max = "4/20/2018";

                const startLastmonth = "3/1/2018";
                const endLastmonth = "3/31/2018";

                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Lastmonth.startDate.format("M/D/YYYY")).toEqual(startLastmonth);
                expect(ranges.Lastmonth.endDate.format("M/D/YYYY")).toEqual(endLastmonth);
            })

            it('start last month day is in range of min and max date and max < end last month - add "Lastmonth" arrange with start/end date is start last month/max', () => {
                const today = "4/12/2018";
                const min = "3/1/2018";
                const max = "3/20/2018";

                const startLastmonth = "3/1/2018";

                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Lastmonth.startDate.format("M/D/YYYY")).toEqual(startLastmonth);
                expect(ranges.Lastmonth.endDate.format("M/D/YYYY")).toEqual(max);
            })

            it('end last month day is in range of min and max date and min > start last month - add "Lastmonth" arrange with start/end date is min/end last month', () => {
                const today = "4/12/2018";
                const min = "3/5/2018";
                const max = "4/20/2018";

                const endLastmonth = "3/31/2018";

                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Lastmonth.startDate.format("M/D/YYYY")).toEqual(min);
                expect(ranges.Lastmonth.endDate.format("M/D/YYYY")).toEqual(endLastmonth);
            })

            it('start last month < min and end last month  > max - add "Lastmonth" arrange with start/end date is min/max', () => {
                const today = "4/12/2018";
                const min = "3/2/2018";
                const max = "3/5/2018";

                const ranges = defaultOptions.ranges(today, min, max);

                expect(ranges.Lastmonth.startDate.format("M/D/YYYY")).toEqual(min);
                expect(ranges.Lastmonth.endDate.format("M/D/YYYY")).toEqual(max);
            })
        })

        describe('Sincelastmonth ranges - ', () => {
            it('limit months is less than 2 - no "Sincelastmonth" arrange', () => {
                const today = "4/12/2018";
                const min = "2/1/2018";
                const max = "2/28/2018";
                const ranges = defaultOptions.ranges(today, min, max, 1);

                expect(ranges.Sincelastmonth).toEqual(undefined);
            })

            it('start since last month day is greater than max date - no "Sincelastmonth" arrange', () => {
                const today = "4/12/2018";
                const min = "2/1/2018";
                const max = "2/28/2018";
                const ranges = defaultOptions.ranges(today, min, max, 2);

                expect(ranges.Sincelastmonth).toEqual(undefined);
            })

            it('end since last month day is less than min date - no "Sincelastmonth" arrange', () => {
                const today = "4/12/2018";
                const min = "6/1/2018";
                const max = "6/30/2018";
                const ranges = defaultOptions.ranges(today, min, max, 2);

                expect(ranges.Sincelastmonth).toEqual(undefined);
            })

            it('since last month day is in range of min and max date - add "Sincelastmonth" arrange with start/end date is start since last month/today', () => {
                const today = "4/12/2018";
                const min = "2/1/2018";
                const max = "5/31/2018";

                const startSinceLastmonth = "3/1/2018";

                const ranges = defaultOptions.ranges(today, min, max, 2);

                expect(ranges.Sincelastmonth.startDate.format("M/D/YYYY")).toEqual(startSinceLastmonth);
                expect(ranges.Sincelastmonth.endDate.format("M/D/YYYY")).toEqual(today);
            })

            it('start since last month day is in range of min and max date and max < today - add "Sincelastmonth" arrange with start/end date is start since last month/max', () => {
                const today = "4/12/2018";
                const min = "2/1/2018";
                const max = "4/10/2018";

                const startSinceLastmonth = "3/1/2018";

                const ranges = defaultOptions.ranges(today, min, max, 2);

                expect(ranges.Sincelastmonth.startDate.format("M/D/YYYY")).toEqual(startSinceLastmonth);
                expect(ranges.Sincelastmonth.endDate.format("M/D/YYYY")).toEqual(max);
            })

            it('end since last month day is in range of min and max date and min > start since last month - add "Sincelastmonth" arrange with start/end date is min/today', () => {
                const today = "4/12/2018";
                const min = "4/9/2018";
                const max = "5/31/2018";

                const ranges = defaultOptions.ranges(today, min, max, 2);

                expect(ranges.Sincelastmonth.startDate.format("M/D/YYYY")).toEqual(min);
                expect(ranges.Sincelastmonth.endDate.format("M/D/YYYY")).toEqual(today);
            })

            it('start since last month < min and today > max - add "Sincelastmonth" arrange with start/end date is min/max', () => {
                const today = "4/12/2018";
                const min = "4/9/2018";
                const max = "4/10/2018";

                const ranges = defaultOptions.ranges(today, min, max, 2);

                expect(ranges.Sincelastmonth.startDate.format("M/D/YYYY")).toEqual(min);
                expect(ranges.Sincelastmonth.endDate.format("M/D/YYYY")).toEqual(max);
            })
        })
    })
})