import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './navigation/app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './core/material/material.module';
import { ToolbarComponent } from './navigation/toolbar/toolbar.component';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import {LayoutService} from './services/layout-service';
import { AboutComponent } from './forms/about/about.component';
import { HomeComponent } from './forms/home/home.component';
import { MenuTreeComponent } from './navigation/menu-tree/menu-tree.component';
import {MenuTreeService} from './navigation/menu-tree.service';
import { ClaimsComponent } from './claims/claims.component';
import {MessageService} from './services/message.service';
import {ClaimsService} from './services/claims-service';
import { SimpleTableComponent } from './simple-table/simple-table.component';
// import { CourseComponent } from './course/course.component';
// import {CoursesService} from './course/courses.service';
import {HttpClient, HttpHandler, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
// import {CourseResolver} from './course/course.resolver';
import { ShTableComponent } from './sh-table/sh-table.component';
import { IncidentComponent } from './incident/incident.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableFilteringComponent } from './table-filtering/table-filtering.component';
import {ServerErrorInterceptor} from './core/error-handle/server-error.interceptor';
import {GlobalErrorHandler} from './core/error-handle/global-error-handler';
import {ErrorDialogService} from './core/error-handle/error-dialog/errordialog.service';
import {ErrorDialogComponent } from './core/error-handle/error-dialog/error-dialog.component';
import {SqlQueryService} from './table-sql-source/sql-query.service';
import { PersonListComponent } from './person-list/person-list.component';
import { TableSqlSourceComponent } from './table-sql-source/table-sql-source.component';
import { TableSqlCrudComponent } from './table-sql-crud/table-sql-crud.component';
import {DataService} from './table-sql-crud/services/data.service';
import { DeleteDialogComponent } from './table-sql-crud/dialogs/delete-dialog/delete-dialog.component';
import { AddDialogComponent } from './table-sql-crud/dialogs/add-dialog/add-dialog.component';
import { EditDialogComponent } from './table-sql-crud/dialogs/edit-dialog/edit-dialog.component';
import { NgDynamicFormComponent } from './core/ng-dynamic-form/ng-dynamic-form.component';
import { DynamicFormsCoreModule } from '@ng-dynamic-forms/core';
import { DynamicFormsMaterialUIModule } from '@ng-dynamic-forms/ui-material';
import { TableEditDialogComponent } from './table-sql-source/dialog/table-edit-dialog/table-edit-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    SidenavComponent,
    AboutComponent,
    HomeComponent,
    MenuTreeComponent,
    ClaimsComponent,
    SimpleTableComponent,
    // CourseComponent,
    ShTableComponent,
    IncidentComponent,
    TableFilteringComponent,
    ErrorDialogComponent,
    PersonListComponent,
    TableSqlSourceComponent,
    TableSqlCrudComponent,
    DeleteDialogComponent,
    AddDialogComponent,
    EditDialogComponent,
    NgDynamicFormComponent,
    TableEditDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicFormsCoreModule,
    DynamicFormsMaterialUIModule

  ],
  providers: [LayoutService,
              MenuTreeService,
              MessageService,
              ClaimsService,
              // CoursesService,
    DataService,
    SqlQueryService,
    ErrorDialogService,
              HttpClient,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true }
    ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorDialogComponent,
    DeleteDialogComponent,
    EditDialogComponent,
    AddDialogComponent,
    NgDynamicFormComponent,
    TableEditDialogComponent]
})

export class AppModule { }
