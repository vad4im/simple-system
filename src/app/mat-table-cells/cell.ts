import {FilterCol} from '../query-filter/query-filter';

export class Cell {
  name: string;
  label: string;
  isSorting: boolean;
  sortval: string;
  filterType: string;
  filterData: FilterCol;
  constructor(name: string, label: string, sortVal: string, filterType: string) {
    this.name = name;
    this.sortval = sortVal;
    this.isSorting = (sortVal === null);
    this.label = label;
    this.filterType = filterType;
// console.log(' name '+ name+ ' ->' + this.isSorting);
    this.filterData = this.getFilterData(name, filterType);
  }

  getFilterData(name: string, filterType: string ): FilterCol {
    if (filterType) {
      return new FilterCol(name, filterType);
    } else {
      return null;
    }
  }


  public getCellFilter() {
    if (this.filterData.cond){
      const queryStringParser = require('../query-parser/query_string_parser.js');
      return queryStringParser.toQuery({'cell': this.name ,
              "type": this.filterType,
              "op"  : this.filterData.cond,
              "v1"  : this.filterData.value1,
              "v2"  : this.filterData.value2});
    }
    return null;
  }

}
