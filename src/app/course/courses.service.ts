import {Injectable} from '@angular/core';
// import {HttpClient, HttpParams} from '@angular/common/http';
import {Course} from './course';
import {map} from 'rxjs/operators';
import {Lesson} from './lesson';
import {Observable } from 'rxjs/index';
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable()
export class CoursesService {
  private clausesUrl = 'http://localhost:3000';  // URL to web api
  constructor(private http:HttpClient) {

  }

  findCourseById(courseId: number = 1): Observable<Course> {
    return this.http.get<Course>(`${this.clausesUrl}/api/courses/${courseId}`);
  }

  findAllCourses(): Observable<Course[]> {
    return this.http.get(this.clausesUrl + '/api/courses')
      .pipe(
        map(res => res['payload'])
      );
  }

  findAllCourseLessons(courseId:number): Observable<Lesson[]> {
    return this.http.get('/api/lessons', {
      params: new HttpParams()
        .set('courseId', courseId.toString())
        .set('pageNumber', "0")
        .set('pageSize', "1000")
    }).pipe(
      map(res =>  res["payload"])
    );
  }

  findLessons(
    courseId:number, filter = '', sortOrder = 'asc',
    pageNumber = 0, pageSize = 3):  Observable<Lesson[]> {
    return this.http.get(this.clausesUrl + '/api/lessons', {
      params: new HttpParams()
        .set('courseId', courseId.toString())
        .set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    }).pipe(
      map(res =>  res["payload"])
    );


  }

}
