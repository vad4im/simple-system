// https://stackblitz.com/edit/angular-material2-issue-gqmbva?file=app%2Fapp.component.ts
import { Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { SelectionModel} from '@angular/cdk/collections';
/*
const conf = {
  table: {
    pageStt: {
      pageSizeOptions: [1, 3, 9],
      showFirstLastButtons: false,
      pageSize: 6,
    },
    checkColumn: {
      name: 'check',
      multiselect: false
    },
    cells: ['id', 'orig', 'origTr', 'transl', 'translTr'],
    sort: {
      active: 'id', direction: 'desc'
    },
    sellVisible: ['id', 'orig', 'origTr', 'transl', 'translTr']
  }}
*/

@Component({
  selector: 'app-simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.css']
})

export class SimpleTableComponent implements OnInit, AfterViewInit  {
  @Input() parentSettings;
  @Input() state;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<any>();

  selection: SelectionModel<any>;

  @Output()choiseRequest = new EventEmitter<any>();

  choiseRequestEmit(row) {
    this.choiseRequest.emit(
      {
        isSelect: this.selection.isSelected(row),
        slctd: this.selection.selected,
        row: row
      }
    );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  selectionToggle(row) {
    this.selection.toggle(row);
    this.choiseRequestEmit(row);
    // console.log('Simple-Table_component row 1 Selected id: ' + row._id + ' selected ' +
    // this.selection.isSelected(row) + ' multiSelection count ' + this.selection.selected.length );
    // console.log(' Child !!choise event!! isSelect - ' + this.selection.isSelected(row));
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.selection.isMultipleSelection()) {
      this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
      this.choiseRequestEmit(null);

    }
    // console.log('Simple-Table_component header Selected count: ' +
    // this.selection.selected.length + 'MPS' + this.selection.isMultipleSelection() );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
    this.selection = new SelectionModel<any>(this.parentSettings.checkColumn.multiselect, []);
    this.dataSource.data = this.state;
    this.dataSource.sort = this.sort;
  }
}
