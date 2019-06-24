import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DivType} from './div-type';
import {DivTypeDataSource} from './div-type.datasource';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {DivTypeService} from './div-type.service';
import {fromEvent, merge} from 'rxjs/index';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/internal/operators';
import {Cell} from '../mat-table-cells/cell';

@Component({
  selector: 'app-div-type',
  templateUrl: './div-type.component.html',
  styleUrls: ['./div-type.component.css']
})

export class DivTypeComponent implements OnInit, AfterViewInit {

  divType: DivType;

  dataSource: DivTypeDataSource;
  public filter: any;
  public displayedColumns: string[] = ['ID', 'CODE', 'NAME'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  public fp = new MatTableDataSource;

  public clls = [ {name:'ID',label:'ID',      sorting: null,   filteringType: null}
                  ,{name:'CODE',label:'CODE', sorting: 'desc', filteringType: null}
                  ,{name:'NAME',label:'NAME', sorting: 'asc',  filteringType:'string'}]

  public cells: Cell[] =[];

  constructor(private route: ActivatedRoute,
              private coursesService: DivTypeService) {
  }

  ngOnInit() {
    this.dataSource = new DivTypeDataSource(this.coursesService);
    this.dataSource.getDivType('', 'asc', 0, 3);
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
    for ( let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].filterData) {
        this.filter = this.cells[i].getCellFilter();
        console.log(' applyFilter() !!!' + this.filter );
      }
    }
    this.loadDivTypePage();
  }

  clearFilterColumn(columnKey: string): void {
    for ( let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].name == columnKey) {
        this.cells[i].filterData.clearFilter();
      }
    }
    this.filter = null;
    this.applyFilter();
  }

  public isSortingDisabled(columnText: string): boolean
  {
    for ( let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].name == columnText) {
        return this.cells[i].isSorting;
      }
    }
    return true;
  }


  buildFilterSruct() {
    for ( let i = 0; i < this.clls.length; i++) {
      this.cells.push(new Cell(this.clls[i].name, this.clls[i].label, this.clls[i].sorting, this.clls[i].filteringType));
    }
  }

  loadDivTypePage() {
// console.log('loadDivTypePage() ->');
    this.dataSource.getDivType(
      this.filter,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }
}
