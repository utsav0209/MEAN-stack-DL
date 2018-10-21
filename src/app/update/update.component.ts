import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  public message;
  public bookData;
  public book = {id : '' };
  constructor(private http: HttpClient, private router: Router,private route: ActivatedRoute) { }

  ngOnInit() {
    this.book.id = (this.route.snapshot.paramMap.get('id'));
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };

    this.http.post('/api/findonebook',this.book,httpOptions).subscribe(data => {
      this.bookData = data;
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['login']);
      }
    });
  }

  update(){
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };

    this.http.post('/api/updatebook',this.bookData,httpOptions).subscribe(resp => {
      this.router.navigate(['books']);
    }, err => {
      console.log("<---"+err+"--->");
      this.message = err.error.msg;
    });
  }


  delete(){
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };
    this.http.post('/api/deletebook',this.book,httpOptions).subscribe(resp => {
      this.router.navigate(['books']);
    }, err => {
      console.log("<---"+err+"--->");
      this.message = err.error.msg;
    });
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
