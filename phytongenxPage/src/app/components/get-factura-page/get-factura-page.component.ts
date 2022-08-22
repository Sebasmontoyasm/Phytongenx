import { Component, OnInit } from '@angular/core';
import { PedroService } from 'src/app/services/pedro.service';

@Component({
  selector: 'app-get-factura-page',
  templateUrl: './get-factura-page.component.html',
  styleUrls: ['./get-factura-page.component.css']
})
export class GetFacturaPageComponent implements OnInit {

  facturasList:any=[];
  constructor(private PedroService:PedroService) { }

  ngOnInit(): void {
    this.getPedro();
  }

  getPedro()
  {
    this.PedroService.getPedro().subscribe(
      res=>{
        this.facturasList=res;
        console.log(res);
      },
      err => console.log(err)
    );
  }
}
