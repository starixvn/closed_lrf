const EXCEL_TYPE = "xlsx";
const MapExcelType = {
    "number": "n", "string": "s", "boolean": "b", "object": "d"
};

let _XLSX = null;
export default class Excel {
    static process(callback){
        import(/* webpackChunkName: "xlsx-style-sparta" */ 'xlsx-style-sparta').then(XLSX => {
            _XLSX = XLSX;
            callback && callback();
        });
    }

    static export (worksheet, fileName) {
        const option = { bookType: EXCEL_TYPE, bookSST: false, type: 'binary' };
        const workbook = { SheetNames: [fileName], Sheets: {}, Props: {} };
        workbook.Sheets[fileName] = worksheet;

        var workbookOutput = _XLSX.write(workbook, option);
        this.download(workbookOutput, fileName);
    }

    static getCellType(value){
        return MapExcelType[typeof value];
    }

    static getCellAddress(cellObject) {
        return _XLSX.utils.encode_cell(cellObject);
    }

    static download(workbookOut, fileName) {
        const blob = new Blob([this.sheetToArrayBuffer(workbookOut)], {
            type: "application/octet-stream"
        });

        this.downloadFromBolb(blob, fileName);
    }

    static downloadFromBolb(blob, fileName) {
        const fileNameDownload = `${fileName}.${EXCEL_TYPE}`;

        // IE 10+
        if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, fileNameDownload);
        } else {
            const element = window.document.createElement('a');
            element.href = window.URL.createObjectURL(blob);
            element.download = fileNameDownload;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    }

    static sheetToArrayBuffer(s) {
        const buffer = new ArrayBuffer(s.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buffer;
    }
}