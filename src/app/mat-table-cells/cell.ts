import {FilterCol} from '../core/db-query/query-filter';

export class Cell {
  name: string;
  label: string;
  isSorting: boolean;
  sortval: string;
  filterType: string;
  filterData: FilterCol;

  constructor(name: string, label: string, sortting: boolean, filtering: boolean, fieldDesc: {}) {
    this.name = name;
    this.sortval = null;
    this.isSorting = (sortting === null) ? false : sortting;
    this.label = label;
    if (filtering){
      this.filterType = getDataType(fieldDesc);
      this.filterData = this.getFilterData(name, this.filterType);
    } else{
      this.filterType = null;
      this.filterData = null;
    }

// console.log(' name '+ name+ ' ->' + this.isSorting);

  }

  getFilterData(name: string, filterType: string): FilterCol {
    if (filterType) {
      return new FilterCol(name, filterType);
    } else {
      return null;
    }
  }


  public getCellFilter() {
    if (this.filterData.cond) {
      const queryStringParser = require('../core/db-query/query-parser/query_string_parser.js');
      return queryStringParser.toQuery({
        cell: this.name,
        type: this.filterType,
        op: this.filterData.cond,
        v1: this.filterData.value1,
        v2: this.filterData.value2
      });
    }
    return null;
  }

  public getCellFilterJson() {
    if (this.filterData.cond) {
      return {
        cell: this.name,
        type: this.filterType,
        op: this.filterData.cond,
        v1: this.filterData.value1,
        v2: this.filterData.value2
      };
    }
    return null;
  }


}

// convert oracle datatype
function getDataType(fieldDesc) {
  let result;
  try {
    result = DATA_TYPE_FUNCTION[fieldDesc.datatype](fieldDesc);
  } catch (e) {
    if (e.name == 'TypeError') {
      e.message = ('Не определен тип данных -> ' + fieldDesc.datatype + '(' + e.message + ')');
      throw e;
    } else {
      throw e;
    }
  }
  // console.log(' getSourceObj.result->' + result + 'getSourceObj.->objNmae' + objNmae);
  return result;
}

const DATA_TYPE_FUNCTION = {
  varchar2(fieldDesc) {
    if (fieldDesc.dataLength < 256) {
      return 'string';
    } else {
      throw new TypeError('fieldDesc.dataLength' + fieldDesc.dataLength);
    }
  },
  integer(fieldDesc) {
    return 'number';
  },
  number(fieldDesc) {
    return 'number';
  },
  actionsColumn(fieldDesc) {
    return 'actionsColumn';
  }
};
