import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSqlCrudComponent } from './table-sql-crud.component';

describe('TableSqlCrudComponent', () => {
  let component: TableSqlCrudComponent;
  let fixture: ComponentFixture<TableSqlCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableSqlCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableSqlCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
