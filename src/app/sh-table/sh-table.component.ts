import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, OnInit, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, startWith, tap, delay} from 'rxjs/operators';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {fromEvent, merge} from 'rxjs/index';

@Component({
  selector: 'app-sh-table',
  templateUrl: './sh-table.component.html',
  styleUrls: ['./sh-table.component.css']
})
export class ShTableComponent implements OnInit, AfterViewInit  {
  @Input() parentSettings;
  @Input() state;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild('input', {static: false}) input: ElementRef;

  @Output()choiseRequest = new EventEmitter<any>();

  dataSource = new MatTableDataSource<any>();

  constructor() { }

  ngOnInit() {
    this.dataSource.data = this.state;
    this.dataSource.sort = this.sort;
  }
  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    fromEvent(this.input.nativeElement,'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.choiseRequestEmit();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.choiseRequestEmit())
      )
      .subscribe();

  }
  choiseRequestEmit() {
    this.choiseRequest.emit();
  }
}
