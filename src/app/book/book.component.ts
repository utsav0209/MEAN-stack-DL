import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-book', 
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  isAdmin:boolean;
  books: any;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };
    this.http.get('/api/book', httpOptions).subscribe(data => {
      this.books = data;
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['login']);
      }
    });
  }

  getDownloadLink = function(id){
    var dstring = "http://www.downloadLink.com/" + id;
    return dstring;
  }

  upload() {
    this.router.navigate(['uploads']);
  }

  myUploads(){
    this.router.navigate(['myUploads']);
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['login']);
  }

}
