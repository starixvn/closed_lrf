import BaseDataGrid from '../BaseDataGrid';

const DefaultProps = { 
    requestParam: {},
    setRequestParam: jest.fn()
};
const SortBy = "stake";
const SortOrder = "asc";

describe('BaseDataGrid methods ', () => {
    it('componentDidMount - call setRequestParam action with PageSize: 50', () => { 
        const dataGrid = new BaseDataGrid(DefaultProps);
            
        dataGrid.componentDidMount();

        expect(DefaultProps.setRequestParam).toHaveBeenCalledWith({ PageSize: 50 });
    });

    it('onPaging(index, size) - call setRequestParam action with PageSize: 50', () => { 
        const PageIndex = 101;
        const PageSize = 199;
        const dataGrid = new BaseDataGrid(DefaultProps);
        dataGrid._getData = jest.fn();

        dataGrid.onPaging(PageIndex, PageSize);

        expect(dataGrid._getData).toHaveBeenCalledWith({ PageIndex: PageIndex, PageSize: PageSize });
    });

    it('_getData(param) - call relevent action methods', () => { 
        const param = {};
        const props = {
            toggleLoader: jest.fn(),
            getGridData: jest.fn(),
            setRequestParam: jest.fn()
        };
        const dataGrid = new BaseDataGrid(props);
        
        dataGrid._getData(param);

        expect(props.toggleLoader).toHaveBeenCalledWith(true);
        expect(props.getGridData).toHaveBeenCalledWith(undefined, param);
        expect(props.setRequestParam).toHaveBeenCalledWith(param);
    });

    it('onSort(sortBy, sortOrder) - grid was NOT sorted: call _getData() with correct param', () => { 
        const props = { requestParam: {} };
        const dataGrid = new BaseDataGrid(props);
        dataGrid._getData = jest.fn();

        dataGrid.onSort(SortBy, SortOrder);

        expect(dataGrid._getData).toHaveBeenCalledWith({SortBy: SortBy, SortOrder: SortOrder});
    });

    it('onSort(sortBy, sortOrder) - grid was sorted: call _getData() with correct param', () => { 
        const props = { requestParam: { } };
        const dataGrid = new BaseDataGrid(props);
        dataGrid._getData = jest.fn();

        dataGrid.onSort(SortBy, SortOrder);

        expect(dataGrid._getData).toHaveBeenCalledWith({SortBy: SortBy, SortOrder: SortOrder});
    });

    it('onSort(sortBy, sortOrder) - grid was sorted: call _getData() with correct param', () => { 
        const props = { requestParam: { } };
        const dataGrid = new BaseDataGrid(props);
        dataGrid._getData = jest.fn();

        dataGrid.onSort(SortBy, SortOrder);

        expect(dataGrid._getData).toHaveBeenCalledWith({SortBy: SortBy, SortOrder: SortOrder});
    });

    it('onSort(sortBy, sortOrder) - grid was sorted: call _getData() with correct param', () => { 
        const props = { requestParam: { } };
        const dataGrid = new BaseDataGrid(props);
        dataGrid._getData = jest.fn();

        dataGrid.onSort(SortBy, SortOrder);

        expect(dataGrid._getData).toHaveBeenCalledWith({SortBy: SortBy, SortOrder: SortOrder});
    });
});