import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from '../forms/home/home.component';
import {AboutComponent} from '../forms/about/about.component';
// import {CourseComponent} from '../course/course.component';
// import {CourseResolver} from '../course/course.resolver';
import {TableFilteringComponent} from '../table-filtering/table-filtering.component';
import {PersonListComponent} from '../person-list/person-list.component';
import {TableSqlSourceComponent} from '../table-sql-source/table-sql-source.component';
import {TableSqlCrudComponent} from "../table-sql-crud/table-sql-crud.component";

const APP_ROUTES: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'about', component: AboutComponent },
  {path: 'home', component: HomeComponent },
  // {path: 'course', component: CourseComponent, resolve: {course: CourseResolver}},
  {path: 'person-list', component: PersonListComponent},
  {path: 'TableSqlSourceComponent', component: TableSqlSourceComponent},
  {path: 'SqlCrud', component: TableSqlCrudComponent},
  {path: 'dictionary', children: [
    {path: 'sql', children: [
      {path: 'table-filtering', component: TableFilteringComponent}
    ]}
  ]}
  /*,
  {
    path: "bootstrap-sample-form",
    component: BootstrapSampleFormComponent,
    data: {
      title: "Bootstrap UI",
      href: "https://github.com/udos86/ng-dynamic-forms/blob/master/sample/app/bootstrap-sample-form/bootstrap-sample-form.model.ts",
      bgColor: "#6f5499"
    }
  },
   {path: 'devfestfl', children: [
    {path: 'sessions', children: [
      {path: 'my-ally-cli', component: ThirdComponent},
      {path: 'become-angular-tailer', component: FourthComponent},
      {path: 'material-design', component: FirstComponent},
      {path: 'what-up-web', component: SecondComponent}
    ]},
  {
    path: "lazy-loaded-form",
    loadChildren: "./lazy-loaded/lazy-loaded-form.module#LazyLoadedFormModule"
  }*/
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
