import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PedroService {
  // Ojo se debe cambiar
  url='http://localhost:3000/pedro';
  constructor(private http: HttpClient) { }

  getPedro(){
    return this.http.get(this.url);
  }

  getPedroId(id:string){
    return this.http.get(this.url+'/'+id);
  }

  addPedro(pedro:any){
    return this.http.post(this.url,pedro);
  }

  deletePedro(id:string){
    return this.http.delete(this.url+'/'+id);
  }

  modificarPedro(id:string, pedro:any){
    return this.http.put(this.url+"/"+id,pedro);
  }

}

export interface Pedro{
  
}
