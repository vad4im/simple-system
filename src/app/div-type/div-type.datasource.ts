import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {of, BehaviorSubject, Observable} from 'rxjs/index';
import {DivType} from './div-type';
import {DivTypeService} from './div-type.service';
import {catchError, finalize} from 'rxjs/operators';
import {ErrorDialogService} from "../error-handle/error-dialog/errordialog.service";
import {MatDialog, matDialogAnimations} from "@angular/material";


export class DivTypeDataSource implements DataSource<DivType> {

  constructor(private divTypesService: DivTypeService, public errorDialogService: ErrorDialogService) {
  }
  private divTypeSubject = new BehaviorSubject<DivType[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  // public dialog: MatDialog;
  // public errorDialogService: ErrorDialogService = new ErrorDialogService(this.dialog);


  getDivType(filter: string, sortDirection: string, pageIndex: number, pageSize: number) {
    this.loadingSubject.next(true);
    this.divTypesService.getDivTypes(filter, sortDirection, pageIndex, pageSize)
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
      .subscribe(divType => this.divTypeSubject.next(divType) // при next()
        // ,error => console.log('getDivType.subscribe.error' + JSON.stringify(error)) // при ошибке
        //  ,() => console.log('getDivType.subscribe.Complete.') // при завершение
      );

  }

  connect(collectionViewer: CollectionViewer): Observable<DivType[]> {
    console.log('Connecting data source');
    return this.divTypeSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    console.log('Disconnecting data source');
    this.divTypeSubject.complete();
    this.loadingSubject.complete();
  }

}

