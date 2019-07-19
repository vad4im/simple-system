import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {of, BehaviorSubject, Observable} from 'rxjs/index';
import {forkJoin} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {ErrorDialogService} from '../core/error-handle/error-dialog/errordialog.service';
import {SqlQueryService} from './sql-query.service';
import {Cell, SourceObjConf, SourceRowConf, ViewCell} from '../mat-table-cells/cell';

export class SqlQueryDataSource implements DataSource<any> {

  // private subscriptions: Subscription[] = [];
  // on init    this.subscriptions.push(langSub);
  // ngOnDestroy() {
  //   this.subscriptions
  //     .forEach(s => s.unsubscribe());
  // }

  constructor(private sqlQueryService: SqlQueryService, public errorDialogService: ErrorDialogService) {
  }

  private fieldList: string;   // 'val1,val2,val3'
  private fields: SourceRowConf[];
  //  {
  //   id: {desc: '', datatype: 'number', dataLength: 10, dataPrecision: 10, dataScale: 0, dataDefault: null},
  //   code: {desc: '', datatype: 'varchar2', dataLength: 30, dataPrecision: null, dataScale: null, dataDefault: null},
  //   name: {desc: '', datatype: 'varchar2', dataLength: 60, dataPrecision: null, dataScale: null, dataDefault: null}
  // };
  private dataObject: SourceObjConf;
  // {name: 'division_Type', primaryKey: ['id'], seqName: null}



  public cells: Cell[] = [];
  // [ {cell: 'id', label: 'id', sorting: true, filtering: true},
  //   {cell: 'code', label: 'code', sorting: true, filtering: true},
  //   {cell: 'name', label: 'name', sorting: false, filtering: false}];
  public actionColumnName = 'actionsColumn';

  public loadingConfig = new BehaviorSubject<boolean>(false);
  public loadingConf$ = this.loadingConfig.asObservable();
  public loadingSubject = new BehaviorSubject<boolean>(false);
  public loadingSubject$ = this.loadingSubject.asObservable();
  private rowsSubject = new BehaviorSubject<any[]>([]);

  getFieldsConfig() {
    return this.fields;
  }

  buildConfig(confdata: SourceRowConf[], objData) {
    this.fields = confdata;
    this.fieldList = confdata.map(data => data.name).join(',');
// console.log('sql_query.datasource buildConfig confdata-> ' + JSON.stringify(confdata));
// console.log('sql_query.datasource buildConfig fieldList-> ' + JSON.stringify(this.fieldList));
    this.dataObject = new SourceObjConf(
      objData[0].name,
      objData.map(data => data.primaryKey),
      objData[0].seqName
    );
  }

  buildCellsSruct(clls, dataEditable: boolean) {
    let cell: ViewCell[];
    if ((!clls) || (clls.length === 0)) {
      cell = this.fieldList.split(',').map(name => new ViewCell(name, name, false, false));
    } else {
      cell = clls;
    }
// console.log('ql-query.datasource.buildCellsSruct cell.length:' + cell.length);
// console.log('ql-query.datasource.buildCellsSruct this.fields.length:' + this.fields.length);
    for (let i = 0; i < cell.length; i++) {
      for (let j = 0; j < this.fields.length; j++) {
        if (this.fields[j].name === cell[i].name) {
// console.log('ql-query.datasource.buildCellsSruct i:' + i + ' j:'+j+' cell[i].name:' + cell[i].name + ' this.fields[j].name:' + this.fields[j].name);
          this.cells.push (new Cell(
            cell[i].name,
            cell[i].label,
            cell[i].sorting,
            cell[i].filtering,
            this.fields[j]
          ));
        }
      }
    }
    if (dataEditable) {
      this.cells.push (new Cell(
        this.actionColumnName,
        this.actionColumnName,
        null,
        null,
        null
      ));
    }
  }

  clearCellFilterColumns(columnKey: string) {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].name == columnKey) {
        this.cells[i].filterData.clearFilter();
      }
    }
  }

  getFilterFromCells(): any {
    const filterData = [];
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].filterData && this.cells[i].filterData.cond ) {
        filterData.push(this.cells[i].getCellFilter());
      }
    }
    return filterData;
  }

  getFilterFromCellsAsJson(): any {
    const filterData = [];
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].filterData && this.cells[i].filterData.cond ) {
        filterData.push(this.cells[i].getCellFilterJson());
      }
    }
    return filterData;
  }


  getConfig(objName, clls, dataEditable) {
    this.loadingConfig.next(true);
    forkJoin([this.sqlQueryService.getConfDataSql(objName),
      this.sqlQueryService.getObjDescSql(objName)])
      .subscribe(results => {
          this.buildConfig(results[0], results[1]);
          this.buildCellsSruct(clls, dataEditable);
// console.log('sql-query.datasource this.cells ->' + JSON.stringify(this.cells));
          this.loadingConfig.next(false);
          this.getObjDataSql('', 0, 3);
// console.log('sql-query.datasource.getConfig  this.fields->' + JSON.stringify(this.fields));
// console.log('sql-query.datasource.getConfig  this.fieldList->' + JSON.stringify(this.fieldList));
// console.log('sql-query.datasource.getConfig  this.dataObject->' + JSON.stringify(this.dataObject));
// console.log('sql-query.datasource.getConfig  this.cells->' + JSON.stringify(this.cells));
        }
      );
  }

  getObjDataSql(sortDirection: string, pageIndex: number, pageSize: number) {
// console.log('sql-query.datasource.getObjDataSql  filter->' + JSON.stringify(this.getFilterFromCellsAsJson()));
    this.loadingSubject.next(true);
    // this.sqlQueryService.getObjDataSql(this.dataObject.name, filter, sortDirection, pageIndex, pageSize, this.fieldList)
    this.sqlQueryService.getObjDataSqlAsPut(this.dataObject.name, this.getFilterFromCellsAsJson(), sortDirection, pageIndex, pageSize, this.fieldList)
      .pipe(
        catchError(err => {
            // this.notifier.showError(err.error.errormsg);
            let data = {};
            data = {
              reason: err.error.errormsg,
              status: err.status
            };
            this.errorDialogService.openDialog(data);
            return of([]);
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
    this.sqlQueryService.addObjDataSql(this.dataObject, data)
      .pipe(
        catchError(err => {
            let data = {};
            data = {
              reason: err.error.errormsg,
              status: err.status
            };
            this.errorDialogService.openDialog(data);
            return of([]);
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
    this.sqlQueryService.editObjDataSql(this.dataObject, data)
      .pipe(
        catchError(err => {
            let data = {};
            data = {
              reason: err.error.errormsg,
              status: err.status
            };
            this.errorDialogService.openDialog(data);
            return of([]);
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
    this.sqlQueryService.delObjDataSql(this.dataObject.name, this.dataObject.primaryKey, id)
      .pipe(
        catchError(err => {
            let data = {};
            data = {
              reason: err.error.errormsg,
              status: err.status
            };
            this.errorDialogService.openDialog(data);
            return of([]);
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

