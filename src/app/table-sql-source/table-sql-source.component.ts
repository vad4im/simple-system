import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {fromEvent, merge} from 'rxjs/index';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/internal/operators';
import {Cell} from '../mat-table-cells/cell';
import {ErrorDialogService} from '../core/error-handle/error-dialog/errordialog.service';
import {SqlQueryService} from './sql-query.service';
import {SqlQueryDataSource} from './sql-query.datasource';
import {TableEditDialogComponent} from './dialog/table-edit-dialog/table-edit-dialog.component';
import {isUndefined} from 'util';


@Component({
  selector: 'app-table-sql-source',
  templateUrl: './table-sql-source.component2.html',
  styleUrls: ['./table-sql-source.component.css']
})
export class TableSqlSourceComponent implements OnInit, AfterViewInit {

  public initialized = false;
  dataSource: SqlQueryDataSource;
  public filter: any;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild('input', {static: false}) input: ElementRef;

  public fp = new MatTableDataSource;

  public paginatorDisable = false;  // ???????
  public dataEditable = true;
  public displayedColumns: string[] = ['id', 'code', 'name'];
  public clls = {
    id: {label: 'id', sorting: true, filtering: false},
    code: {label: 'code', sorting: false, filtering: true},
    name: {label: 'name', sorting: false, filtering: false}
  };
  public fields = {
    id: {desc: '', datatype: 'number', dataLength: 10, dataPrecision: 10, dataScale: 0, dataDefault: null},
    code: {desc: '', datatype: 'varchar2', dataLength: 30, dataPrecision: null, dataScale: null, dataDefault: null},
    name: {desc: '', datatype: 'varchar2', dataLength: 60, dataPrecision: null, dataScale: null, dataDefault: null}
  };
  public tableName = 'division_Type';
  // public fieldsList = 'id,code,name';
  // public dataObject = {name: 'division_Type', primaryKey: ['id'], seqName: null};
  public cells: Cell[] = [];

  constructor(private route: ActivatedRoute,
              private sqlQueryService: SqlQueryService,
              public dialog: MatDialog,
              public errorDialogService: ErrorDialogService) {
  }

  ngOnInit() {
    this.dataSource = new SqlQueryDataSource(this.sqlQueryService, this.errorDialogService);
    if (this.dataEditable) { this.addDisplCols('actionsColumn'); };
    this.buildFilterSruct();
    // console.log('table-sql-source,component this.cells ->' + JSON.stringify(this.cells));
    this.dataSource.getConfig(this.tableName, this.getDisplCols(), this.clls);

    this.dataSource.loadingSubject
      .subscribe(value => {
        // console.log('table-sql-source,component  ngOnInit value:' + value + ' this.dataSource.loadingConfig.value:' + this.dataSource.loadingConfig.value + ' this.initialized:' + this.initialized);
        if (!this.dataSource.loadingConfig.value) {
          if (!value && !this.initialized) {
            //  подписаться
            this.initialized = true;
            // console.log('table-sql-source,component ngOnInit loadingConfig.subscribe  this.sort->' + this.sort);
            this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
            merge(this.sort.sortChange, this.paginator.page)
              .pipe(
                tap(() => {
                  // console.log('table-sql-source,component  ngOnInit merge !!!');
                  this.loadObjDataSqlPage();
                })
              )
              .subscribe();
          }
        }
      });

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
    // console.log('ngAfterViewInit() ->');
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    // fromEvent(this.input.nativeElement, 'keyup')
    //   .pipe(
    //     debounceTime(150),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       console.log('table-sql-source,component  ngAfterViewInit fromEvent !!!');
    //       this.paginator.pageIndex = 0;
    //       this.loadObjDataSqlPage();
    //     })
    //   )
    //   .subscribe();
    // merge(this.sort.sortChange, this.paginator.page)
    //   .pipe(
    //     tap(() => {
    //       console.log('table-sql-source,component  ngAfterViewInit merge !!!');
    //       this.loadObjDataSqlPage();
    //     })
    //   )
    //   .subscribe();
  }

  getDisplCols(){
    return this.displayedColumns;
  }
  addDisplCols(value: string){
  this.displayedColumns.push(value);
  }

  // filters
  // call from html
  applyFilter() {
// console.log('table-sql-source,component applyFilter() ');
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].filterData) {
        this.filter = this.cells[i].getCellFilter();
// console.log(' applyFilter() this.cells[i]->' + JSON.stringify(this.cells[i].name) + 'this.filter->' + this.filter);
      }
    }
// this.filter =  this.dataSource.getFilterFromCells();
// console.log('table-sql-source,component applyFilter()  this.dataSource.getFilterFromCells()->' + this.dataSource.getFilterFromCells());
// console.log('table-sql-source,component applyFilter()  this.filter->' + this.filter);
    this.loadObjDataSqlPage();
// console.log('about cells --------------');
// console.log('table-sql-source,component applyFilter() this.cells -> ' + JSON.stringify(this.cells));
// console.log('about cells --------------');
// console.log('table-sql-source,component applyFilter() this.dataSource.cells -> ' + JSON.stringify(this.dataSource.cells));
  }

  // call from html
  clearFilterColumn(columnKey: string): void {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].name == columnKey) {
        this.cells[i].filterData.clearFilter();
      }
    }
    this.filter = null;
    this.dataSource.clearCellFilterColumns(columnKey);
    this.applyFilter();
  }

  buildFilterSruct() {
    // console.log('this.fields  ->' + JSON.stringify(this.fields));
    // console.log('this.dataSource.rowsConfig.fields  ->' + JSON.stringify(this.dataSource.getFieldsConfig()));
    for (let i = 0; i < this.getDisplCols().length; i++) {
      const currclls = {
        name: this.getDisplCols()[i],
        label: this.getDisplCols()[i],
        sorting: null,
        filtering: null
      };
// console.log('table-sql-source.component buildFilterSruct this.getDisplCols()[i] ' + this.getDisplCols()[i]);
// console.log('table-sql-source.component buildFilterSruct this.fields[this.getDisplCols()[i]] ' + JSON.stringify(this.fields[this.getDisplCols()[i]]));
      if (this.clls[this.getDisplCols()[i]]) {
        currclls.sorting = this.clls[this.getDisplCols()[i]].sorting;
        currclls.filtering = this.clls[this.getDisplCols()[i]].filtering;
      }
      this.cells.push(new Cell(
        currclls.name,
        currclls.label,
        currclls.sorting,
        currclls.filtering,
        this.fields[this.getDisplCols()[i]]
      ));
    }
  }

  getSortCond(): string {
    if (!this.sort.active || this.sort.direction === '') {
      return '';
    }
    return ((this.sort.direction === 'asc') ? '-' : '+' ) + this.sort.active;
  }

  loadObjDataSqlPage() {
    this.dataSource.getObjDataSql(
      this.filter,
      this.getSortCond(),
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }

  addObjDataSql(data) {
    this.dataSource.addObjDataSql(
      data
    );
  }

  editObjDataSql(data) {
    this.dataSource.editObjDataSql(
      data
    );
  }

  delObjDataSql(rowId) {
    this.dataSource.delObjDataSql(rowId);
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(TableEditDialogComponent
      , {
        data: {
          value: {id: '82', code: 'new_code', name: 'new name'},
          config: this.dataSource.getFieldsConfig()
        }
      });
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


  openEditDialog(row) {
    console.log('table-sql-route.component.openEditDialog rowData' + JSON.stringify(row));
    // row.NAME = '!!!!!!!!!!!';
    const dialogRef = this.dialog.open(TableEditDialogComponent
      , {data: {value: row, config: this.dataSource.getFieldsConfig()}});
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

  openDeleteDialog(row) {
    console.log('table-sql-route.component.openDeleteDialog rowData' + JSON.stringify(row));
    // row.NAME = '!!!!!!!!!!!';
    const dialogRef = this.dialog.open(TableEditDialogComponent
      , {data: {value: row, config: this.dataSource.getFieldsConfig()}});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
// console.log('TableSqlSource.component.openAddListDialog.result -> ' + JSON.stringify(result));
        this.delObjDataSql(row.id);
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
