import Excel from '../../../lib/excel';
import { titleCellStyle, headerCellStyle, bodyCellStyle, totalCellStyle } from '../../../constants/excelStyle';
import { HeaderText, Service } from '../lib/service';

const TITLE_ROW_INDEX = 0;
const HEADER_ROW_INDEX = 1;
const DATA_ROW_INDEX = 2;

const PRODUCT_COLUMN_INDEX = 0;
const TURNOVER_COLUMN_INDEX = 1;
const CUSTOMERWL_COLUMN_INDEX = 2;
const LICENSEENETWL_COLUMN_INDEX = 3;
const AMOUNTDUE_COLUMN_INDEX = 4;
const CURRENCY_COLUMN_INDEX = 6;
const RATE_COLUMN_INDEX = 7;

const COLUMN_COUNT = 8;

export default class ReportExcel {
    constructor(gridData = {}, dataTitle, exchangeTite, baseCurrency) {
        this.worksheet = {};
        this.dataTitle = dataTitle;
        this.exchangeTite = exchangeTite;
        this.fileName = 'DetailedBillingReport';
        this.gridData = gridData;
        this.currentRowIndex = DATA_ROW_INDEX;
        this.mergeConfig = [];
        this.baseCurrency = baseCurrency;
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
        this._createCell(this.dataTitle, PRODUCT_COLUMN_INDEX, TITLE_ROW_INDEX, titleCellStyle, 's');
        this._createCell(this.exchangeTite, CURRENCY_COLUMN_INDEX, TITLE_ROW_INDEX, { ...titleCellStyle, alignment: { horizontal: "center" } }, 's');

        this.mergeConfig.push({ s: { r: TITLE_ROW_INDEX, c: 0 }, e: { r: TITLE_ROW_INDEX, c: AMOUNTDUE_COLUMN_INDEX } });
        this.mergeConfig.push({ s: { r: TITLE_ROW_INDEX, c: CURRENCY_COLUMN_INDEX }, e: { r: TITLE_ROW_INDEX, c: RATE_COLUMN_INDEX } });
    }

    _createHeader() {
        this._createCell(HeaderText['Product'], PRODUCT_COLUMN_INDEX, HEADER_ROW_INDEX, headerCellStyle, 's');
        this._createCell(HeaderText['Turnover'], TURNOVER_COLUMN_INDEX, HEADER_ROW_INDEX, headerCellStyle, 's');
        this._createCell(HeaderText['CustomerWL'], CUSTOMERWL_COLUMN_INDEX, HEADER_ROW_INDEX, headerCellStyle, 's');
        this._createCell(HeaderText['LicenseeNetWL'], LICENSEENETWL_COLUMN_INDEX, HEADER_ROW_INDEX, headerCellStyle, 's');
        this._createCell(HeaderText['AmountDue'], AMOUNTDUE_COLUMN_INDEX, HEADER_ROW_INDEX, headerCellStyle, 's');

        this._createCell(HeaderText['Currency'], CURRENCY_COLUMN_INDEX, HEADER_ROW_INDEX, headerCellStyle, 's');
        this._createCell(`${this.baseCurrency}/${HeaderText['Unit']}`, RATE_COLUMN_INDEX, HEADER_ROW_INDEX, headerCellStyle, 's');
    }

    _createSheetData() {
        this._createMainData();
        this._createExchangeData();
        this._createFooterData();
    }

    _createMainData() {
        const mainData = this.gridData.Data;

        for (let i = 0; i < mainData.length; i++) {
            const item = mainData[i];

            this._createCell(item.Product, PRODUCT_COLUMN_INDEX, this.currentRowIndex, bodyCellStyle.rowspan, 's');
            this._createCell(item.Turnover, TURNOVER_COLUMN_INDEX, this.currentRowIndex, bodyCellStyle.decimal, 'n');
            this._createCell(item.CustomerWL, CUSTOMERWL_COLUMN_INDEX, this.currentRowIndex, bodyCellStyle.decimal, 'n');
            this._createCell(item.LicenseeNetWL, LICENSEENETWL_COLUMN_INDEX, this.currentRowIndex, item.LicenseeNetWL >= 0 ? bodyCellStyle.decimal : bodyCellStyle.negativeDecimal, 'n');
            this._createCell(item.AmountDue, AMOUNTDUE_COLUMN_INDEX, this.currentRowIndex, bodyCellStyle.decimal,'n');

            this.currentRowIndex++;
        }
    }

    _createExchangeData() {
        const exchange = this.gridData.Exchange;

        const baseCurrencyList = Object.keys(exchange);
        for (let i = 0; i < baseCurrencyList.length; i++) {
            const currrency = baseCurrencyList[i];

            this._createCell(currrency, CURRENCY_COLUMN_INDEX, DATA_ROW_INDEX + i, bodyCellStyle.center, 's');
            this._createCell(exchange[currrency], RATE_COLUMN_INDEX, DATA_ROW_INDEX + i, bodyCellStyle.center, 'n');
        }
    }

    _createFooterData() {
        for (let i = 0; i < this.gridData.Summary.length; i++) {
            const item = this.gridData.Summary[i];

            this._createSummaryRow(item.Description, item.Amount);
        }
    }

    _createSummaryRow(text, value) {        
        this._createCell(text, PRODUCT_COLUMN_INDEX, this.currentRowIndex, totalCellStyle.left, 's');
        this._createCell(value, AMOUNTDUE_COLUMN_INDEX, this.currentRowIndex, totalCellStyle.decimal, 'n');
        
        this.mergeConfig.push({ s: { r: this.currentRowIndex, c: 0 }, e: { r: this.currentRowIndex, c: LICENSEENETWL_COLUMN_INDEX } });
        
        this.currentRowIndex++;
    }

    _createCell(value, colIndex, rowIndex, style, type) {
        var cellAddress = Excel.getCellAddress({ c: colIndex, r: rowIndex });
        this.worksheet[cellAddress] = { t: type, v: value, s: style };
    }

    _createExcelConfig() {        
        const columnModels = [{ wpx: 120 }, { wpx: 120 }, { wpx: 120 }, { wpx: 120 }, { wpx: 120 }, { wpx: 50 }, { wpx: 70 }, { wpx: 100 }];
        
        const cellStart = Excel.getCellAddress({ r: 0, c: 0 });
        const exchangeRow = Object.keys(this.gridData.Exchange).length + DATA_ROW_INDEX;
        const totalRow = this.currentRowIndex >= exchangeRow ? this.currentRowIndex : exchangeRow;
        const cellEnd = Excel.getCellAddress({ r: totalRow, c: COLUMN_COUNT - 1 });

        this.worksheet['!merges'] = this.mergeConfig;
        this.worksheet['!ref'] = `${cellStart}:${cellEnd}`;

        this.worksheet['!cols'] = columnModels;
    }
}