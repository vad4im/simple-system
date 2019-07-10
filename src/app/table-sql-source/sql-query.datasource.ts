import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {of, BehaviorSubject, Observable} from 'rxjs/index';
import {forkJoin} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {ErrorDialogService} from '../core/error-handle/error-dialog/errordialog.service';
import {SqlQueryService} from './sql-query.service';

export class SqlQueryDataSource implements DataSource<any> {

  public rowsConfig = {};
  private rowsSubject = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private loadingConfig = new BehaviorSubject<boolean>(false);

  constructor(private sqlQueryService: SqlQueryService, public errorDialogService: ErrorDialogService) {
  }

  getConfig(objName: string) {

    return forkJoin([this.sqlQueryService.getConfDataSql(objName),
      this.sqlQueryService.getObjDescSql(objName)]
    ).pipe(
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
      finalize(() => this.loadingConfig.next(false))
    )
      .subscribe(results => {
        // results[0] дата из getConfDataSql
        // results[1] дата из getObjDescSql
        // this.b = results[0];
        // this.a = results[1];
        this.rowsConfig = this.buildConfig(results[0], results[1]);
        // console.log('getConfig ----1--->' + JSON.stringify(this.rowsConfig));
        // console.log('JSON.stringify(this.rowsConfig.dataObject) ->>' + JSON.stringify(this.rowsConfig))
        return this.getObjDataSql('', '', 1, 3)
      });
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
    return {fieldList: fList.substring(1), fields: flds, dataObject: obj};
  }


  getObjDataSql(filter: string, sortDirection: string, pageIndex: number, pageSize: number) {
    this.loadingSubject.next(true);
    this.sqlQueryService.getObjDataSql(this.rowsConfig.dataObject.name, filter, sortDirection, pageIndex, pageSize, this.rowsConfig.fieldList)
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

