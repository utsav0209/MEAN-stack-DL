import { Component, OnInit } from '@angular/core';
import { HttpClient ,  HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  bookData = {title: '', isbn: '', author: '' ,publisher: '' };
  message = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    console.log("ngOninit in upload component");
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };
    this.http.get('/api/upload', httpOptions).subscribe(data => {

    }, err => {
      
      if(err.status === 401) {
        this.router.navigate(['login']);
      }
    });
  }

  upload(){
    
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };

    this.http.post('/api/book',this.bookData,httpOptions).subscribe(resp => {
      this.router.navigate(['books']);
    }, err => {
      console.log("<---"+err+"--->");
      this.message = err.error.msg;
    });
  }
}
