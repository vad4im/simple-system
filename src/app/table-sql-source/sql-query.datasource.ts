import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {of, BehaviorSubject, Observable} from 'rxjs/index';
import {forkJoin} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {ErrorDialogService} from '../core/error-handle/error-dialog/errordialog.service';
import {SqlQueryService} from './sql-query.service';
import {Cell} from '../mat-table-cells/cell';

export class SqlQueryDataSource implements DataSource<any> {

  public rowsConfig = {};
  public cells: Cell[] = [];
  // {fieldList: string   // 'val1,val2,val3'
  //  fields: flds,       // {name:{desc: '', datatype: 'string', dataLength: 60, dataPrecision: null, dataScale: null, dataDefault: null}}
  //  dataObject: obj     // {name: 'division_Type', primaryKey: ['id'], seqName: null}
  // }
  public loadingConfig = new BehaviorSubject<boolean>(false);
  public loadingConf$ = this.loadingConfig.asObservable();
  public loadingSubject = new BehaviorSubject<boolean>(false);
  public loadingSubject$ = this.loadingSubject.asObservable();
  private rowsSubject = new BehaviorSubject<any[]>([]);

  // private subscriptions: Subscription[] = [];
  // on init    this.subscriptions.push(langSub);
  // ngOnDestroy() {
  //   this.subscriptions
  //     .forEach(s => s.unsubscribe());
  // }

  constructor(private sqlQueryService: SqlQueryService, public errorDialogService: ErrorDialogService) {
  }

  getFieldsConfig() {
    return this.rowsConfig.fields;
  }

  buildConfig(confdata, objData) {
    let fList = '';
    let flds = {};
    let obj = {}
    if (objData.length = 1) {
      obj = {name: objData[0].name, primaryKey: [objData[0].primaryKey], seqName: objData[0].seqName};
    } else {
      let pk = [];
      for (let i = 0; i < objData.length; i++) {
        pk.push(objData.primaryKey);
      }
      obj = {name: objData[0].name, primaryKey: pk, seqName: null};
    }
    for (let i = 0; i < confdata.length; i++) {
      fList += ',' + confdata[i].name;
      flds[confdata[i].name] = confdata[i];
    }
    // console.log('sql_query.datasource buildConfig fieldList-> ' + fList.substring(1));
    // console.log('sql_query.datasource buildConfig fields-> ' + JSON.stringify(flds));
    // console.log('sql_query.datasource buildConfig dataObject-> ' + JSON.stringify(obj));
    return {fieldList: fList.substring(1), fields: flds, dataObject: obj};
  }

  buildCellsSruct(displayedColumns, clls) {
    // console.log('sql_query.datasource buildCellsSruct this.rowsConfig.fields ->' + JSON.stringify(this.rowsConfig.fields));
    for (let i = 0; i < displayedColumns.length; i++) {
      let currclls = {
        name: displayedColumns[i],
        label: displayedColumns[i],
        sorting: null,
        filtering: null
      };
      if (clls[displayedColumns[i]]) {
        currclls.sorting = clls[displayedColumns[i]].sorting;
        currclls.filtering = clls[displayedColumns[i]].filtering;
      }
      this.cells.push(new Cell(
        currclls.name,
        currclls.label,
        currclls.sorting,
        currclls.filtering,
        this.rowsConfig.fields[displayedColumns[i]]));
    }
  }

  clearCellFilterColumns(columnKey: string) {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].name === columnKey) {
        this.cells[i].filterData.clearFilter();
      }
    }
  }

  getFilterFromCells(): any {
    let filterData;
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].filterData) {
        filterData = this.cells[i].getCellFilter();
      }
    }
    return filterData;
  }


  getConfig(objName: string, displayedColumns, clls) {
    this.loadingConfig.next(true);
    forkJoin([this.sqlQueryService.getConfDataSql(objName),
      this.sqlQueryService.getObjDescSql(objName)])
      .subscribe(results => {
          this.rowsConfig = this.buildConfig(results[0], results[1]);
          this.buildCellsSruct(displayedColumns, clls);
console.log('sql-query.datasource this.cells ->' + JSON.stringify(this.cells));
          // console.log('getConfig ----1--->' + JSON.stringify(this.rowsConfig));
          // console.log('JSON.stringify(this.rowsConfig.dataObject) ->>' + JSON.stringify(this.rowsConfig))
          this.loadingConfig.next(false);
          this.getObjDataSql('', '', 0, 3);
        }
      )
  }

  getObjDataSql(filter: [], sortDirection: string, pageIndex: number, pageSize: number) {
    console.log('sql-query.datasource.getObjDataSql  filter->' + JSON.stringify(this.getFilterFromCells()));
    this.loadingSubject.next(true);
    // this.sqlQueryService.getObjDataSql(this.rowsConfig.dataObject.name, filter, sortDirection, pageIndex, pageSize, this.rowsConfig.fieldList)
    this.sqlQueryService.getObjDataSqlAsPut(this.rowsConfig.dataObject.name, this.getFilterFromCells(), sortDirection, pageIndex, pageSize, this.rowsConfig.fieldList)
      .pipe(
        catchError(err => {
            // this.notifier.showError(err.error.errormsg);
            let data = {};
            data = {
              reason: err.error.errormsg,
              status: err.status
            };
            this.errorDialogService.openDialog(data);
            return of([])
          }
        ),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(data => this.rowsSubject.next(data) // при next()
        // ,error => console.log('getObjDataSql.subscribe.error' + JSON.stringify(error)) // при ошибке
        //  ,() => console.log('getObjDataSql.subscribe.Complete.') // при завершение
      );
  }


  addObjDataSql(data) {
    this.sqlQueryService.addObjDataSql(this.rowsConfig.dataObject, data)
      .pipe(
        catchError(err => {
            let data = {};
            data = {
              reason: err.error.errormsg,
              status: err.status
            };
            this.errorDialogService.openDialog(data);
            return of([])
          }
        ),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(
        data => {
          let result = {};
          result = {
            reason: JSON.stringify(data),
            status: 1
          };
          this.errorDialogService.openDialog(result);
        }
      );
  }

  editObjDataSql(data) {
    this.sqlQueryService.editObjDataSql(this.rowsConfig.dataObject, data)
      .pipe(
        catchError(err => {
            let data = {};
            data = {
              reason: err.error.errormsg,
              status: err.status
            };
            this.errorDialogService.openDialog(data);
            return of([])
          }
        ),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(
        data => {
          let result = {};
          result = {
            reason: JSON.stringify(data),
            status: 1
          };
          this.errorDialogService.openDialog(result);
        }
      );
  }

  delObjDataSql(id) {
    this.sqlQueryService.delObjDataSql(this.rowsConfig.dataObject.name, this.rowsConfig.dataObject.primaryKey, id)
      .pipe(
        catchError(err => {
            let data = {};
            data = {
              reason: err.error.errormsg,
              status: err.status
            };
            this.errorDialogService.openDialog(data);
            return of([])
          }
        ),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(
        data => {
          let result = {};
          result = {
            reason: JSON.stringify(data),
            status: 1
          };
          this.errorDialogService.openDialog(result);
        }
      );
  }


  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    console.log('Connecting data source');
    return this.rowsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    console.log('Disconnecting data source');
    this.rowsSubject.complete();
    this.loadingSubject.complete();
  }
}

