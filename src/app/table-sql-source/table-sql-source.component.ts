import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {fromEvent, merge} from 'rxjs/index';
import {tap} from 'rxjs/internal/operators';
import {Cell} from '../mat-table-cells/cell';
import {ErrorDialogService} from '../core/error-handle/error-dialog/errordialog.service';
import {SqlQueryService} from './sql-query.service';
import {SqlQueryDataSource} from './sql-query.datasource';
import {TableEditDialogComponent} from './dialog/table-edit-dialog/table-edit-dialog.component';

@Component({
  selector: 'app-table-sql-source',
  templateUrl: './table-sql-source.component2.html',
  styleUrls: ['./table-sql-source.component.css']
})
export class TableSqlSourceComponent implements OnInit{


  public initialized = false;
  dataSource: SqlQueryDataSource;
  public filter: any;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild('input', {static: false}) input: ElementRef;

  public paginatorDisable = false;  // ???????

  public dataEditable = true;
  public tableName = 'division_Type';
  public clls = [
     {cell: 'id', label: 'id', sorting: true, filtering: true},
     {cell: 'code', label: 'code', sorting: true, filtering: true},
     {cell: 'name', label: 'name', sorting: false, filtering: false}
  ];

  public displayedColumns: string[] = ['id', 'code', 'name'];
  // public fields = {
  //   id: {desc: '', datatype: 'number', dataLength: 10, dataPrecision: 10, dataScale: 0, dataDefault: null},
  //   code: {desc: '', datatype: 'varchar2', dataLength: 30, dataPrecision: null, dataScale: null, dataDefault: null},
  //   name: {desc: '', datatype: 'varchar2', dataLength: 60, dataPrecision: null, dataScale: null, dataDefault: null}
  // };
  // public fieldsList = 'id,code,name';
  // public dataObject = {name: 'division_Type', primaryKey: ['id'], seqName: null};

  constructor(private route: ActivatedRoute,
              private sqlQueryService: SqlQueryService,
              public dialog: MatDialog,
              public errorDialogService: ErrorDialogService) {
  }

  ngOnInit() {
    this.dataSource = new SqlQueryDataSource(this.sqlQueryService, this.errorDialogService);
    if (this.dataEditable) { this.addDisplCols('actionsColumn'); };

    this.dataSource.getConfig(this.tableName, this.clls);

    this.dataSource.loadingSubject
      .subscribe(value => {
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
  }


  getDisplCols(){
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    return this.displayedColumns;
  }
  addDisplCols(value: string, label: string, sorting: boolean, filtering: boolean){
  this.clls.push({"cell": value, "label": label, "sorting": sorting, "filtering": filtering});
  }


  // call from html
  applyFilter() {
    this.loadObjDataSqlPage();
  }

  // call from html
  clearFilterColumn(columnKey: string): void {
    this.dataSource.clearCellFilterColumns(columnKey);
    this.applyFilter();
  }
  getSortCond(): string {
    if (!this.sort.active || this.sort.direction === '') {
      return '';
    }
    return ((this.sort.direction === 'asc') ? '-' : '+' ) + this.sort.active;
  }

  loadObjDataSqlPage() {
    this.dataSource.getObjDataSql(
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
      }
    });
  }


  openEditDialog(row) {
    console.log('table-sql-route.component.openEditDialog rowData' + JSON.stringify(row));
    const dialogRef = this.dialog.open(TableEditDialogComponent
      , {data: {value: row, config: this.dataSource.getFieldsConfig()}});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.editObjDataSql(result.sqlObj);
      }
    });

  }

  openDeleteDialog(row) {
    console.log('table-sql-route.component.openDeleteDialog rowData' + JSON.stringify(row));
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


}
