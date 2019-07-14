export class ValLab {
  value: string;
  label: string;

  constructor(val: string, lab: string) {
    this.value = val;
    this.label = lab;
  }
}

export class ConditionList extends ValLab {
  type: string[];

  constructor(val: string, lab: string, arr: string[]) {
    super(val, lab);
    this.type = arr;
  }
}

export class Filter {
  colName: string;
  cond: string;
  value1: any;
  value2: any;

  constructor(name: string) {
    this.colName = name;
    this.cond = null;
    this.value1 = null;
    this.value2 = null;
  }

  clearFilter() {
console.log('query-filter.clearFilter of ' + this.colName);
    this.value1 = null;
    this.value2 = null;
    this.cond = null;
  }
}

export class FilterCol extends Filter {
  constructor(name: string, filterType: string) {
    super(name);
    this.headerName = name;
    this.filterName = name;
    this.condList = this.getConditionList(filterType);
  }

  headerName: string;
  filterName: string;
  filter: Filter;
  condList: ValLab[];

  const
  CONDITIONS_LIST: ConditionList[] = [
    new ConditionList('empty', 'Empty', ['string', 'number']),
    new ConditionList('notEmpty', 'Not empty', ['string', 'number']),
    new ConditionList('equal', 'Equal', ['string', 'number']),
    new ConditionList('notEqual', 'Not equal', ['string', 'number']),
    new ConditionList('lt', 'Lower', ['number']),                               // Lower than	?age__lt=10
    new ConditionList('gt', 'Greater', ['number']),                            // Greater than	?age__gt=15
    new ConditionList('lte', 'Lower and equal', ['number']),	                    // Lower than and equal	?age__lte=25
    new ConditionList('gte', 'Greater and equal', ['number']),                	  // Greater than and equal	?age__gte=20
    new ConditionList('like', 'Like', ['string']),                // 	Like with case sensitive	?name__like=smith
    new ConditionList('notLike', 'Not Like', ['string']),       // 	Opposite of like with case sensitive	?name__notLike=smith
    new ConditionList('between', 'Between', ['number']),        // Find value which between 2 given values	?date__between=2015-06-18,2017-05-31
    new ConditionList('notBetween', 'Not Between', ['number'])   // 	Find value which is not between 2 given values	?date__notBetween=2015-06-18,2017-05-31
  ];

  getConditionList(filterType: string): ValLab[] {
    let result: ValLab[] = [];
    for (let i = 0; i < this.CONDITIONS_LIST.length; i++) {
      if (this.CONDITIONS_LIST[i].type.includes(filterType)) {
        result.push(new ValLab(this.CONDITIONS_LIST[i].value, this.CONDITIONS_LIST[i].label));
      }
    }
    return result;
  }

}

