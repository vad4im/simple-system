import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {of, BehaviorSubject, Observable} from 'rxjs/index';
import {catchError, finalize} from 'rxjs/operators';
import {ErrorDialogService} from '../core/error-handle/error-dialog/errordialog.service';
import {SqlQueryService} from './sql-query.service';

export class SqlQueryDataSource implements DataSource<any> {

  private rowsSubject = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private sqlQueryService: SqlQueryService, public errorDialogService: ErrorDialogService) {
  }

  // public dialog: MatDialog;
  // public errorDialogService: ErrorDialogService = new ErrorDialogService(this.dialog);

  getObjDataSql(objName: string, filter: string, sortDirection: string, pageIndex: number, pageSize: number, fields) {
    this.loadingSubject.next(true);
    this.sqlQueryService.getObjDataSql(objName, filter, sortDirection, pageIndex, pageSize, fields)
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


  addObjDataSql(dataObj, data) {
    this.sqlQueryService.addObjDataSql(dataObj, data)
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

  editObjDataSql(dataObj, data) {
    this.sqlQueryService.editObjDataSql(dataObj, data)
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

