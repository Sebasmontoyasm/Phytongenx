import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QbService {

  url='http://localhost:3000/api/qb/';

  constructor(private http: HttpClient){ }
    
  performace(){
    return this.http.get(this.url+"performance"); 
  }
  
  detail(id: string){
    return this.http.get(this.url+"detail/"+id); 
  }
}
