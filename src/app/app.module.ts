import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './navigation/app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
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
import { CourseComponent } from './course/course.component';
import {CoursesService} from './course/courses.service';
import {HttpClient, HttpHandler, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {CourseResolver} from './course/course.resolver';
import { ShTableComponent } from './sh-table/sh-table.component';
import { IncidentComponent } from './incident/incident.component';
import { DivTypeComponent } from './div-type/div-type.component';
import {DivTypeService} from './div-type/div-type.service';
import {FilterItemDirective} from './div-type/filter-item.directive';
import { FormsModule } from '@angular/forms';
import { TableFilteringComponent } from './table-filtering/table-filtering.component';
import {ServerErrorInterceptor} from './error-handle/server-error.interceptor';
import {GlobalErrorHandler} from './error-handle/global-error-handler';
import {ErrorDialogService} from './error-handle/error-dialog/errordialog.service';
import {ErrorDialogComponent } from './error-handle/error-dialog/error-dialog.component';

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
    CourseComponent,
    ShTableComponent,
    IncidentComponent,
    DivTypeComponent,
    FilterItemDirective,
    TableFilteringComponent,
    ErrorDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [LayoutService,
              MenuTreeService,
              MessageService,
              ClaimsService,
              CoursesService,
              DivTypeService,
    ErrorDialogService,
              HttpClient,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },
              CourseResolver],
  bootstrap: [AppComponent],
  entryComponents: [ErrorDialogComponent]
})
export class AppModule { }
