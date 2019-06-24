import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {of, BehaviorSubject, Observable} from 'rxjs/index';
import {DivType} from './div-type';
import {DivTypeService} from './div-type.service';
import {catchError, finalize} from 'rxjs/operators';


export class DivTypeDataSource implements DataSource<DivType> {

  private divTypeSubject = new BehaviorSubject<DivType[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  constructor(private divTypesService: DivTypeService) {

  }

  getDivType(filter: string,
             sortDirection: string,
             pageIndex: number,
             pageSize: number) {

    this.loadingSubject.next(true);
    this.divTypesService.getDivTypes(filter, sortDirection,
      pageIndex, pageSize).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(divType => this.divTypeSubject.next(divType));

  }

  connect(collectionViewer: CollectionViewer): Observable<DivType[]> {
    console.log('Connecting data source');
    return this.divTypeSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.divTypeSubject.complete();
    this.loadingSubject.complete();
  }

}

