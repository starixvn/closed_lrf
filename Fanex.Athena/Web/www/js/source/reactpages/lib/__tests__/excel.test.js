import * as XLSX from 'xlsx-style-sparta';
import Excel from '../excel';

jest.mock('xlsx-style-sparta');

const originalDownloadFunction = Excel.download;

describe('Excel ', () => {
    beforeAll(() => {
        Excel.process();
    });
    afterAll(() => {
        jest.resetAllMocks();
    })

    describe('export', () => {
        const worksheetContent = "ws content";
        const worksheet = {};
        const filename = "filename";

        beforeAll(() => {
            XLSX.write.mockImplementation(() => worksheetContent);
            Excel.download = jest.fn();
        })

        afterAll(() => {
            XLSX.write.mockReset();
            Excel.download.mockReset();
            Excel.download = originalDownloadFunction;
        })

        it('XLSX.write should be called with correct parameter', () => {
            const option = { bookType: "xlsx", bookSST: false, type: 'binary' };
            const workbook = { SheetNames: ["filename"], Sheets: {}, Props: {} };
            workbook.Sheets["filename"] = worksheet;

            Excel.export(worksheet, filename);

            expect(XLSX.write).toHaveBeenCalledWith(workbook, option);
        })

        it('download function should be called with correct parameter', () => {
            Excel.export(worksheet, filename);

            expect(Excel.download).toHaveBeenCalledWith(worksheetContent, filename);
        })
    })

    it('getCellType - return correct result', () => {
        const value = 123;

        var result = Excel.getCellType(value);

        expect(result).toBe("n");
    })

    it('getCellAddress - XLSX.utils.encode_cell should be called with correct parameter', () => {
        const cellObject = { c: 0, r: 0 };

        Excel.getCellAddress(cellObject);

        expect(XLSX.utils.encode_cell).toHaveBeenCalledWith(cellObject);
    })

    it('sheetToArrayBuffer - return correct buffer content', () => {
        const sheetContent = "AH";
        const buffer = new ArrayBuffer(sheetContent.length);
        const expectedResult = new Uint8Array(buffer);
        expectedResult[0] = 65;
        expectedResult[1] = 72;

        const result = Excel.sheetToArrayBuffer(sheetContent);

        expect(result).toEqual(buffer);
    })

    describe('download', () => {
        const originalSheetToArrayBufferFunc = Excel.sheetToArrayBuffer;
        const originalCreateObjectUrlFunc = window.URL.createObjectURL;
        const originalDocumentBody = document.body;

        const buffer = new ArrayBuffer(1);
        const workbookOut = "Workbook Content",
            fileName = "fileName";
        const expectedFileNameDownload = `${fileName}.xlsx`;

        const expectedBlob = new Blob([buffer], {
            type: "application/octet-stream"
        });

        beforeAll(() => {
            Excel.sheetToArrayBuffer = jest.fn().mockReturnValue(buffer);
        })

        afterAll(() => {
            Excel.sheetToArrayBuffer = originalSheetToArrayBufferFunc;
        })

        afterEach(() => {
            if (global.navigator.msSaveOrOpenBlob) {
                global.navigator.msSaveOrOpenBlob = undefined;
            }
            window.URL.createObjectURL = originalCreateObjectUrlFunc;
            document.body = originalDocumentBody;
        })

        it('Using IE browser - navigator.msSaveOrOpenBlob function should be called with correct parameter', () => {
            const msSaveMock = jest.fn();
            global.navigator.msSaveOrOpenBlob = msSaveMock;

            Excel.download(workbookOut, fileName);

            expect(msSaveMock).toHaveBeenCalledWith(expectedBlob, expectedFileNameDownload);
        })

        describe('Using browser that not IE', () => {
            it('window.URL.createObjectURL should be called with correct parameter', () => {
                window.URL.createObjectURL = jest.fn();

                Excel.download(workbookOut, fileName);

                expect(window.URL.createObjectURL).toHaveBeenCalledWith(expectedBlob);
            })

            it('created "a" tag should has correct attributes', () => {
                let atag;
                const expectedHrefContent = "http://localhost/hrefContent";
                window.URL.createObjectURL = jest.fn(() => expectedHrefContent);
                document.body.appendChild = jest.fn().mockImplementationOnce((element) => {
                    atag = element;
                });
                document.body.removeChild = jest.fn();

                Excel.download(workbookOut, fileName);

                expect(atag.href).toBe(expectedHrefContent);
                expect(atag.download).toBe(expectedFileNameDownload);
            })

            it('"a" tag should fire click event', () => {
                let atag;
                window.URL.createObjectURL = jest.fn();
                document.body.appendChild = jest.fn().mockImplementationOnce((element) => {
                    element.click = jest.fn();
                    atag = element;
                });
                document.body.removeChild = jest.fn();

                Excel.download(workbookOut, fileName);

                expect(atag.click).toHaveBeenCalled();
            })

            it('appendChild and removeChild function of document.body should be called with correct parameter', () => {
                let atag;
                window.URL.createObjectURL = jest.fn();
                document.body.appendChild = jest.fn().mockImplementationOnce((element) => {
                    atag = element;
                });
                document.body.removeChild = jest.fn();

                Excel.download(workbookOut, fileName);

                expect(document.body.appendChild).toHaveBeenCalledWith(atag);
                expect(document.body.removeChild).toHaveBeenCalledWith(atag);
            })
        })
    })
})