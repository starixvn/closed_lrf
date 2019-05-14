import NumberFormat from '../../../lib/numberFormat'
import moment from 'moment'
import Excel from '../../../lib/excel'
import LangHelper from '../../../lib/langHelper'
import { titleCellStyle, headerCellStyle, bodyCellStyle, totalCellStyle, grandTotalCellStyle } from '../../../constants/excelStyle'
import service from '../lib/service'
import { SettingConst } from '../constants/settingConst'

const TITLE_ROW_INDEX = 0;
const HEADER_ROW_INDEX = 1;
const DATA_ROW_INDEX = 2;

const INDEX_COLUMN_INDEX = 0;
const REPORTBY_COLUMN_INDEX = 1;
const GROUPBY_COLUMN_INDEX = 2;
const BETCOUNT_COLUMN_INDEX = 3;
const TURNOVER_COLUMN_INDEX = 4;
const CUSTOMERCOMM_COLUMN_INDEX = 5;
const LICENSEEWL_COLUMN_INDEX = 6;
const LICENSEECOMM_COLUMN_INDEX = 7;
const LICENSEENETWL_COLUMN_INDEX = 8;
const MARGIN_COLUMN_INDEX = 9;

const COLUMN_COUNT = 10;

const MAIN_SECTION_STYLE = "mainSectionStyle";
const TOTAL_SECTION_STYLE = "totalSectionStyle";
const GRAND_TOTAL_SECTION_STYLE = "grandTotalSectionStyle";

const fields = {
    Index: "Index",
    ReportBy: "ReportBy",
    GroupBy: "GroupBy",
    BetCount: "BetCount",
    Turnover: "Turnover",
    CustomerComm: "CustomerComm",
    LicenseeWL: "LicenseeWinLoss",
    LicenseeComm: "LicenseeComm",
    LicenseeNetWL: "LicenseeNetWinLoss",
    Margin: "Margin"
}

const columnConfigs = [
    {
        field: "#",
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [GRAND_TOTAL_SECTION_STYLE]: grandTotalCellStyle.number
    },
    {
        field: fields.ReportBy,
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [GRAND_TOTAL_SECTION_STYLE]: grandTotalCellStyle.number
    },
    {
        field: fields.GroupBy,
        [MAIN_SECTION_STYLE]: bodyCellStyle.rowspan,
        [GRAND_TOTAL_SECTION_STYLE]: grandTotalCellStyle.number
    },
    {
        field: fields.BetCount,
        [MAIN_SECTION_STYLE]: bodyCellStyle.number,
        [GRAND_TOTAL_SECTION_STYLE]: grandTotalCellStyle.number
    },
    {
        field: fields.Turnover,
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [GRAND_TOTAL_SECTION_STYLE]: grandTotalCellStyle.decimal
    },
    {
        field: fields.CustomerComm,
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [GRAND_TOTAL_SECTION_STYLE]: grandTotalCellStyle.decimal
    },
    {
        field: fields.LicenseeWL,
        [MAIN_SECTION_STYLE]: { positive: bodyCellStyle.decimal, negative: bodyCellStyle.negativeDecimal },
        [GRAND_TOTAL_SECTION_STYLE]: { positive: grandTotalCellStyle.decimal, negative: grandTotalCellStyle.negativeDecimal }
    },
    {
        field: fields.LicenseeComm,
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [GRAND_TOTAL_SECTION_STYLE]: grandTotalCellStyle.decimal
    },
    {
        field: fields.LicenseeNetWL,
        [MAIN_SECTION_STYLE]: { positive: bodyCellStyle.decimal, negative: bodyCellStyle.negativeDecimal },
        [GRAND_TOTAL_SECTION_STYLE]: { positive: grandTotalCellStyle.decimal, negative: grandTotalCellStyle.negativeDecimal }
    },
    {
        field: fields.Margin,
        [MAIN_SECTION_STYLE]: bodyCellStyle.percent,
        [GRAND_TOTAL_SECTION_STYLE]: grandTotalCellStyle.percent
    }
]

export default class ReportExcel {
    constructor(gridData = {}, title, reportBy, groupBy, baseCurrency) {
        this.worksheet = {};
        this.title = title;
        this.fileName = "WinLossByTimeZone";
        this.gridData = gridData;
        this.reportBy = reportBy;
        this.groupBy = groupBy;
        this.baseCurrency = baseCurrency;
        this.currentRowIndex = DATA_ROW_INDEX;
        this.mergeConfig = [];
    }

    export (onFinished) {
        if (!this.gridData.Data || !this.gridData.Data.length) {
            onFinished && onFinished();
            return;
        }

        Excel.process(() => { 
            this._createTitle();
            this._createHeader();
            this._createSheetData();
            this._createExcelConfig();

            Excel.export(this.worksheet, this.fileName);
            onFinished && onFinished();
        });
    }

    _createTitle() {
        this.mergeConfig.push({ s: { r: TITLE_ROW_INDEX, c: 0 }, e: { r: TITLE_ROW_INDEX, c: COLUMN_COUNT - 1 } });
        const address = Excel.getCellAddress({ c: 0, r: TITLE_ROW_INDEX });
        this.worksheet[address] = { t: "s", v: this.title, s: titleCellStyle }
    }

    _createHeader() {
        const headerText = service.getHeaderText(this.reportBy, this.groupBy);
        const keys = Object.keys(headerText);
        for (let i = 0; i < keys.length; i++) {
            const address = Excel.getCellAddress({ c: i, r: HEADER_ROW_INDEX });
            const header = headerText[keys[i]];
            this.worksheet[address] = { t: "s", v: header, s: headerCellStyle }
        }
    }

    _createSheetData() {
        this._createMainData();
        this._createFooterData();
    }

    _createMainData() {
        const mainData = this.gridData.Data;

        for (let i = 0; i < mainData.length; i++) {
            const item = mainData[i];
            var cellAddress = Excel.getCellAddress({ c: INDEX_COLUMN_INDEX, r: this.currentRowIndex });
            this.worksheet[cellAddress] = { t: "s", v: (i + 1), s: bodyCellStyle.center };
            this._createRowByColumnIndex(item, MAIN_SECTION_STYLE, REPORTBY_COLUMN_INDEX, MARGIN_COLUMN_INDEX);
            this.currentRowIndex++;
        }
    }

    _createFooterData() {
        this.mergeConfig.push({ s: { r: this.currentRowIndex, c: 0 }, e: { r: this.currentRowIndex, c: GROUPBY_COLUMN_INDEX } });
        const totalData = this.gridData.Total;

        var cellAddress = Excel.getCellAddress({ c: INDEX_COLUMN_INDEX, r: this.currentRowIndex });
        this.worksheet[cellAddress] = { t: "s", v: LangHelper.getSingleResource("Totalin") + " " + this.baseCurrency, s: grandTotalCellStyle.center };
        this._createRowByColumnIndex(totalData, GRAND_TOTAL_SECTION_STYLE, BETCOUNT_COLUMN_INDEX, MARGIN_COLUMN_INDEX);
    }

    _createExcelConfig() {        
        const columnModels = [{ wpx: 50 }, { wpx: 100, hidden: this.reportBy === SettingConst.ReportBySummary }, 
            { wpx: 200 }, { wpx: 120 }, { wpx: 180 }, { wpx: 120 }, { wpx: 150 }, 
            { wpx: 150 }, { wpx: 150 }, { wpx: 150 }, { wpx: 150 }];
        
        const cellStart = Excel.getCellAddress({ r: 0, c: 0 });
        const cellEnd = Excel.getCellAddress({ r: this.currentRowIndex, c: COLUMN_COUNT - 1 });

        this.worksheet["!merges"] = this.mergeConfig;
        this.worksheet["!ref"] = `${cellStart}:${cellEnd}`;

        this.worksheet['!cols'] = columnModels;
    }

    _createRowByColumnIndex(item, sectionStyle, startIndex, endIndex) {
        for (let i = startIndex; i <= endIndex; i++) {
            const { cellAddress, type, value, style } = this._getCellObject(item, sectionStyle, i);
            this.worksheet[cellAddress] = { t: type, v: value, s: style };
        }
    }

    _getCellObject(item, sectionStyle, columnIndex) {
        const columnConfig = columnConfigs[columnIndex];
        if (columnIndex === GROUPBY_COLUMN_INDEX)
        {
            columnConfig[MAIN_SECTION_STYLE] = this.groupBy === SettingConst.GroupByProduct ? bodyCellStyle.rowspan : bodyCellStyle.center;
        }

        const field = columnConfig.field;

        const cellAddress = Excel.getCellAddress({ c: columnIndex, r: this.currentRowIndex });
        const type = Excel.getCellType(item[columnConfig.field]);
        let value = item[field] !== null ? item[field] : "";

        let style = columnConfig[sectionStyle];
        if (columnIndex === LICENSEEWL_COLUMN_INDEX || columnIndex === LICENSEENETWL_COLUMN_INDEX) {
            style = value < 0 ? style.negative : style.positive;
        }
        else if (columnIndex === REPORTBY_COLUMN_INDEX)
        {
            value = moment(value).format(this.reportBy === SettingConst.ReportByDaily ? "MM/DD/YYYY" : "MM/YYYY");
        }
        else if (columnIndex === MARGIN_COLUMN_INDEX)
        {
            value /= 100; // percentage
        }

        return { cellAddress, type, value, style };
    }
}