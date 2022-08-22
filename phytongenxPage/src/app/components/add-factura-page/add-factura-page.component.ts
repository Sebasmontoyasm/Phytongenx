import { Component, OnInit } from '@angular/core';
import { PedroService } from '../../services/pedro.service';
@Component({
  selector: 'app-add-factura-page',
  templateUrl: './add-factura-page.component.html',
  styleUrls: ['./add-factura-page.component.css']
})
export class AddFacturaPageComponent implements OnInit {

  constructor(private PedroService:PedroService) { }

  ngOnInit(): void {
  }

  mostrarInformacion(){
    this.PedroService.getPedro().subscribe(
      res=>{
        console.log(res)
      },
      err => console.log(err)
    );
  }

}
