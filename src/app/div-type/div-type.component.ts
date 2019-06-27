import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DivType} from './div-type';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {fromEvent, merge} from 'rxjs/index';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/internal/operators';
import {Cell} from '../mat-table-cells/cell';
import {ErrorDialogService} from '../core/error-handle/error-dialog/errordialog.service';
import {SqlQueryService} from '../core/db-query/sql-query.service';
import {SqlQueryDataSource} from '../core/db-query/sql-query.datasource';

@Component({
  selector: 'app-div-type',
  templateUrl: './div-type.component.html',
  styleUrls: ['./div-type.component.css']
})

export class DivTypeComponent implements OnInit, AfterViewInit {

  divType: DivType;

  dataSource: SqlQueryDataSource;
  public filter: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  public fp = new MatTableDataSource;
  public paginatorDisable = false;
  public displayedColumns: string[] = ['ID', 'CODE', 'NAME'];
  public clls = [{name: 'ID', label: 'ID', sorting: null, filteringType: null},
    {name: 'CODE', label: 'CODE', sorting: 'desc', filteringType: null},
    {name: 'NAME', label: 'NAME', sorting: 'asc', filteringType: 'string'}]

  public cells: Cell[] = [];

  constructor(private route: ActivatedRoute,
              private sqlQueryService: SqlQueryService,
              public errorDialogService: ErrorDialogService) {
  }

  ngOnInit() {
    this.dataSource = new SqlQueryDataSource(this.sqlQueryService, this.errorDialogService);
    this.dataSource.getDivType('divisionType', '', 'asc', 1, 3);
    this.buildFilterSruct();

    // fp
    // this.fp.filterPredicate = (p: DivType, filtre: any) => {
    //   let result = true;
    //   const keys = Object.keys(p); // keys of the object data
    //
    //   for (const key of keys) {
    //     const searchCondition = filtre.conditions[key]; // get search filter method
    //
    //     if (searchCondition && searchCondition !== 'none') {
    //       if (filtre.methods[searchCondition](p[key], filtre.values[key]) === false) { // invoke search filter
    //         result = false; // if one of the filters method not succeed the row will be remove from the filter result
    //         break;
    //       }
    //     }
    //   }
    //   return result;
    // };
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit() ->');
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadDivTypePage();
        })
      )
      .subscribe();
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadDivTypePage();
        })
      )
      .subscribe();

  }


  applyFilter() {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].filterData) {
        this.filter = this.cells[i].getCellFilter();
        console.log(' applyFilter() !!!' + this.filter);
      }
    }
    this.loadDivTypePage();
  }

  clearFilterColumn(columnKey: string): void {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].name == columnKey) {
        this.cells[i].filterData.clearFilter();
      }
    }
    this.filter = null;
    this.applyFilter();
  }

  public isSortingDisabled(columnText: string): boolean {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].name == columnText) {
        return this.cells[i].isSorting;
      }
    }
    return true;
  }


  buildFilterSruct() {
    for (let i = 0; i < this.displayedColumns.length; i++) {
      let currclls = {name: this.displayedColumns[i], label: this.displayedColumns[i], sorting: null, filteringType: null};
      for (let j = 0; j < this.clls.length; j++) {
        if (this.clls[j].name === this.displayedColumns[i]) {
          currclls.sorting =  this.clls[j].sorting
          currclls.filteringType = this.clls[j].filteringType
        }
      }
      console.log('currclls --->' + JSON.stringify(currclls))
      this.cells.push(new Cell(currclls.name, currclls.label, currclls.sorting, currclls.filteringType));
    }
  }

  loadDivTypePage() {
// console.log('loadDivTypePage() ->');
    this.dataSource.getDivType(
      'divisionType',
      this.filter,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }
}
