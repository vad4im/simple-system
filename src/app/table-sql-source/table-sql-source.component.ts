import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {fromEvent, merge} from 'rxjs/index';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/internal/operators';
import {Cell} from '../mat-table-cells/cell';
import {ErrorDialogService} from '../core/error-handle/error-dialog/errordialog.service';
import {SqlQueryService} from './sql-query.service';
import {SqlQueryDataSource} from './sql-query.datasource';
import {TableEditDialogComponent} from "./dialog/table-edit-dialog/table-edit-dialog.component";


@Component({
  selector: 'app-table-sql-source',
  templateUrl: './table-sql-source.component.html',
  styleUrls: ['./table-sql-source.component.css']
})
export class TableSqlSourceComponent implements OnInit, AfterViewInit {

  dataSource: SqlQueryDataSource;
  public filter: any;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild('input', {static: false}) input: ElementRef;

  public fp = new MatTableDataSource;
  public paginatorDisable = false;  //???????
  public dataEditable = true;
  public displayedColumns: string[] = ['id', 'code', 'name'];
  public clls = {
    'id': {label: 'id', sorting: false, filtering: false},
    'code': {label: 'code', sorting: true, filtering: false},
    'name': {label: 'name', sorting: true, filtering: true}
  };
  public fields = {
    'id': {desc: '', datatype: 'number', dataLength: 10, dataPrecision: 10, dataScale: 0, dataDefault: null},
    'code': {desc: '', datatype: 'string', dataLength: 30, dataPrecision: null, dataScale: null, dataDefault: null},
    'name': {desc: '', datatype: 'string', dataLength: 60, dataPrecision: null, dataScale: null, dataDefault: null}
  };
  public fieldsList = '';
  public dataObject = {name: 'divisionType', primaryKey:['id'], seqName:null};
  public cells: Cell[] = [];

  constructor(private route: ActivatedRoute,
              private sqlQueryService: SqlQueryService,
              public dialog: MatDialog,
              public errorDialogService: ErrorDialogService) {
  }

  ngOnInit() {
    if (this.dataEditable) {
      this.displayedColumns.push('actionsColumn');
    }
    for (var key in this.fields){
      this.fieldsList += ',' + key ;
    }
    this.fieldsList =   this.fieldsList.substring(1);
    this.dataSource = new SqlQueryDataSource(this.sqlQueryService, this.errorDialogService);
    this.dataSource.getObjDataSql(this.dataObject.name, '', 'asc', 1, 3, this.fieldsList);
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
          this.loadObjDataSqlPage();
        })
      )
      .subscribe();
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadObjDataSqlPage();
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
    this.loadObjDataSqlPage();
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
      let currclls = {
        name: this.displayedColumns[i],
        label: this.displayedColumns[i],
        sorting: null,
        filteringType: null
      };
      if (this.fields[this.displayedColumns[i]]) {
        currclls.filteringType = this.fields[this.displayedColumns[i]].datatype;
      }
      if (this.clls[this.displayedColumns[i]]) {
        currclls.sorting = this.clls[this.displayedColumns[i]].sorting
      }
      this.cells.push(new Cell(currclls.name, currclls.label, currclls.sorting, currclls.filteringType));
    }
  }

  loadObjDataSqlPage() {
// console.log('loadObjDataSqlPage() ->');
    this.dataSource.getObjDataSql(
      this.dataObject.name,
      this.filter,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.fieldsList);
  }

  addObjDataSql(data){
    this.dataSource.addObjDataSql(
      this.dataObject,
      data
    );
  }
  editObjDataSql(data){
    this.dataSource.editObjDataSql(
      this.dataObject,
      data
    );
  }


  openAddDialog() {
    const dialogRef = this.dialog.open(TableEditDialogComponent
      , {data: {"value": {"id": "82", "code": "new_code", "name": "new name"}, "config": this.fields}});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
// console.log('TableSqlSource.component.openAddListDialog.result -> ' + JSON.stringify(result));
        this.addObjDataSql(result.sqlObj);
        // --After dialog is closed we're doing frontend updates
        // --For add we're just pushing a new row inside DataService
        // this.exampleDatabase.dataChange.value.push(this.dataService.getDialogData());
        // this.refreshTable();
      }
    });
  }


  openEditDialog(row){
    console.log('table-sql-route.component.openEditDialog rowData'+ JSON.stringify(row));
    // row.NAME = '!!!!!!!!!!!';
    const dialogRef = this.dialog.open(TableEditDialogComponent
      , {data: {"value": row, "config": this.fields}});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
// console.log('TableSqlSource.component.openAddListDialog.result -> ' + JSON.stringify(result));
         this.editObjDataSql(result.sqlObj);
        // --After dialog is closed we're doing frontend updates
        // --For add we're just pushing a new row inside DataService
        // this.exampleDatabase.dataChange.value.push(this.dataService.getDialogData());
        // this.refreshTable();
      }
    });

  }

  // openAddListDialog1(): void {
  //   const dialogRef = this.dialog.open(NgDynamicFormComponent, {
  //     width: '1000px',
  //     data: null
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result){
  //       console.log(JSON.stringify(result));
  // --const clausesList = [{orig: 'word1', transl: 'слово1'}, {orig: 'word2', transl: 'слово2'}];
  // this.addClausesList(result.value)
  //   .subscribe(data => {
  //       this.getClauses();
  //
  //     }
  //   );
  //     }
  //  });
  // }

}
