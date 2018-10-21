import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-my-uploads',
  templateUrl: './my-uploads.component.html',
  styleUrls: ['./my-uploads.component.css']
})
export class MyUploadsComponent implements OnInit {
  
  books:any;
  
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };
    this.http.get('/api/booksofuser', httpOptions).subscribe(data => {
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

  update(bookid){
    this.router.navigate(['update',bookid]);
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['login']);
  }
}
