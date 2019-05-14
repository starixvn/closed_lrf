import NumberFormat from '../../../lib/numberFormat'
import moment from 'moment'
import Excel from '../../../lib/excel'
import LangHelper from '../../../lib/langHelper'
import { titleCellStyle, headerCellStyle, bodyCellStyle, totalCellStyle, grandTotalCellStyle } from '../../../constants/excelStyle'
import { HeaderText, Service } from '../lib/service'

const TITLE_ROW_INDEX = 0;
const HEADER_ROW_INDEX = 1;
const DATA_ROW_INDEX = 2;

const INDEX_COLUMN_INDEX = 0;
const DATE_COLUMN_INDEX = 1;
const SYSTEMID_COLUMN_INDEX = 2;
const EXTERNALID_COLUMN_INDEX = 3;
const PRODUCT_COLUMN_INDEX = 4;
const BETCOUNT_COLUMN_INDEX = 5;
const TURNOVER_COLUMN_INDEX = 6;
const VALIDBETAMOUNT_COLUMN_INDEX = 7;
const CUSTOMERWL_COLUMN_INDEX = 8;

const COLUMN_COUNT = 9;

const MAIN_SECTION_STYLE = "mainSectionStyle";
const TOTAL_SECTION_STYLE = "totalSectionStyle";
const GRAND_TOTAL_SECTION_STYLE = "grandTotalSectionStyle";

const fields = {
    Index: "Index",
    Date: "Date",
    SystemId: "SystemId",
    ExternalId: "ExternalId",
    Product: "Product",
    BetCount: "BetCount",
    Turnover: "Turnover",
    ValidBetAmount: "ValidBetAmount",
    CustomerWL: "CustomerWL"
}

const columnConfigs = [
    {
        field: "#",
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [GRAND_TOTAL_SECTION_STYLE]: grandTotalCellStyle.number
    },
    {
        field: fields.Date,
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [GRAND_TOTAL_SECTION_STYLE]: grandTotalCellStyle.default
    },
    {
        field: fields.SystemId,
        [MAIN_SECTION_STYLE]: bodyCellStyle.rowspan,
        [GRAND_TOTAL_SECTION_STYLE]: grandTotalCellStyle.number
    },
    {
        field: fields.ExternalId,
        [MAIN_SECTION_STYLE]: bodyCellStyle.rowspan,
        [GRAND_TOTAL_SECTION_STYLE]: grandTotalCellStyle.number
    },
    {
        field: fields.Product,
        [MAIN_SECTION_STYLE]: bodyCellStyle.rowspan,
        [GRAND_TOTAL_SECTION_STYLE]: grandTotalCellStyle.default
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
        field: fields.ValidBetAmount,
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [GRAND_TOTAL_SECTION_STYLE]: grandTotalCellStyle.decimal
    },
    {
        field: fields.CustomerWL,
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [GRAND_TOTAL_SECTION_STYLE]: grandTotalCellStyle.decimal
    }
]

export default class ReportExcel {
    constructor(gridData = {}, title, baseCurrency) {
        this.worksheet = {};
        this.title = title;
        this.fileName = "CasinoTurnoverReport";
        this.gridData = gridData;
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
        const keys = Object.keys(HeaderText);
        for (let i = 0; i < keys.length; i++) {
            const address = Excel.getCellAddress({ c: i, r: HEADER_ROW_INDEX });
            const header = HeaderText[keys[i]];
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
            item.Date = moment(item.Date).format("MM/DD/YYYY");
            var cellAddress = Excel.getCellAddress({ c: INDEX_COLUMN_INDEX, r: this.currentRowIndex });
            this.worksheet[cellAddress] = { t: "s", v: item.Index, s: bodyCellStyle.center };
            this._createRowByColumnIndex(item, MAIN_SECTION_STYLE, DATE_COLUMN_INDEX, CUSTOMERWL_COLUMN_INDEX);
            if (item.RowSpan > 1) {
                for(let column = 0; column <= 3; column++) {
                    this.mergeConfig.push({ s: { r: this.currentRowIndex, c: column }, e: { r: this.currentRowIndex + item.RowSpan - 1, c: column } });
                }
            }
            this.currentRowIndex++;
        }
    }

    _createFooterData() {
        this.mergeConfig.push({ s: { r: this.currentRowIndex, c: 0 }, e: { r: this.currentRowIndex, c: PRODUCT_COLUMN_INDEX } });
        const totalData = this.gridData.Total;

        var cellAddress = Excel.getCellAddress({ c: INDEX_COLUMN_INDEX, r: this.currentRowIndex });
        this.worksheet[cellAddress] = { t: "s", v: LangHelper.getSingleResource("Totalin") + " " + this.baseCurrency, s: grandTotalCellStyle.center };
        this._createRowByColumnIndex(totalData, GRAND_TOTAL_SECTION_STYLE, BETCOUNT_COLUMN_INDEX, CUSTOMERWL_COLUMN_INDEX);
    }

    _createExcelConfig() {        
        const columnModels = [{ wpx: 50 }, { wpx: 100 }, 
            { wpx: 120 }, { wpx: 120 }, { wpx: 180 }, { wpx: 120 }, { wpx: 150 }, 
            { wpx: 150 }, { wpx: 150 }];
        
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
        const field = columnConfig.field;

        const cellAddress = Excel.getCellAddress({ c: columnIndex, r: this.currentRowIndex });
        const type = Excel.getCellType(item[columnConfig.field]);
        let value = item[field] !== null ? item[field] : "";

        let style = columnConfig[sectionStyle];
        
        return { cellAddress, type, value, style };
    }
}