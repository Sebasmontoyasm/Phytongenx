import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  url='http://localhost:3000/api/data/';

  

  constructor(private http: HttpClient) { }

  getMasterData(){
    return this.http.get(this.url);
  }

  deleteDataID(id: number): Observable<any>  {
    return this.http.get(this.url+"delete/"+id);
  }

  dataDeleteBackup(id: number){
    return this.http.get(this.url+"data_delete/"+id);
  }
  
}

