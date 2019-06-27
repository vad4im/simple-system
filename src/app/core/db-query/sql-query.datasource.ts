import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {of, BehaviorSubject, Observable} from 'rxjs/index';
import {catchError, finalize} from 'rxjs/operators';
import {ErrorDialogService} from '../error-handle/error-dialog/errordialog.service';
import {SqlQueryService} from '../db-query/sql-query.service';


export class SqlQueryDataSource implements DataSource<any> {

  constructor(private sqlQueryService: SqlQueryService, public errorDialogService: ErrorDialogService) {
  }
  private divTypeSubject = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  // public dialog: MatDialog;
  // public errorDialogService: ErrorDialogService = new ErrorDialogService(this.dialog);


  getDivType(objName: string, filter: string, sortDirection: string, pageIndex: number, pageSize: number) {
    this.loadingSubject.next(true);
    this.sqlQueryService.getDivTypes(objName, filter, sortDirection, pageIndex, pageSize)
      .pipe(
        catchError(err => {
            // this.notifier.showError(err.error.errormsg);
            console.log('getDivType.catchError.tap 11111');
            let data = {};
            data = {
              reason: err.error.errormsg,
              status: err.status
            };
            console.log('getDivType.catchError.tap 222');
            this.errorDialogService.openDialog(data);
            console.log('getDivType.catchError.tap 333');
            return of([])
          }
        ),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(data => this.divTypeSubject.next(data) // при next()
        // ,error => console.log('getDivType.subscribe.error' + JSON.stringify(error)) // при ошибке
        //  ,() => console.log('getDivType.subscribe.Complete.') // при завершение
      );

  }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    console.log('Connecting data source');
    return this.divTypeSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    console.log('Disconnecting data source');
    this.divTypeSubject.complete();
    this.loadingSubject.complete();
  }

}

