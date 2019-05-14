import * as actions from '../reportTitleAction'
import * as types from '../types'

describe('reportTitleAction ', () => {
    it('setReportTitle  - should create correct action', () => {
        const tilte = 'Title';
        
        const expectedAction = {
            type: types.SET_REPORT_TITLE,
            data: tilte
        }

        const result = actions.setReportTitle(tilte);

        expect(result).toEqual(expectedAction)
    })
})