import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSqlSourceComponent } from './table-sql-source.component';

describe('TableSqlSourceComponent', () => {
  let component: TableSqlSourceComponent;
  let fixture: ComponentFixture<TableSqlSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableSqlSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableSqlSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
