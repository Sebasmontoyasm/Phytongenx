import { Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CmsService } from 'src/app/services/cms/cms.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { CmsDetail } from 'src/app/interfaces/cms/cms-detail';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-cms-detail-page',
  templateUrl: './cms-detail-page.component.html',
  styleUrls: ['./cms-detail-page.component.css']
})

/**
 * Detalle de la CMS Data el cual
 * se accede por el hipervinculo en
 * masterdata que tiene la PO Number con el detalle
 */
export class CmsDetailPageComponent implements OnInit, OnDestroy {
  private destroy = new Subject<any>();
  id: any;
  title = 'data-table';
  displayedColumn: string[] =['ID','Date','PDFName','PONumber','SubloteCode','Test','State'];
  dataSource!: MatTableDataSource<CmsDetail>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  
  posts:any;

  /**
   * 
   * @param cmsService servicio de conexion con la base de datos CMS 
   * @param route obtención de identificador PO Number que debe crear
   * @param router Redireccionamiento a pagina principal.
   */
  constructor(private cmsService:CmsService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.getCmsDetail();
  }
  /**
   * Optimizador de suscriptores para 
   * evitar mal consumo de la APP.
   */
  ngOnDestroy(): void {
    this.destroy.next({});
    this.destroy.complete();
  }


  /**
   * Conrolador del servicio
   * detalle que busca el detalle
   * de la PO Number que fue seleccionada
   */
  getCmsDetail()
  {

    this.route.params.pipe(
      takeUntil(this.destroy)
    ).subscribe(params => {
      this.id = Object.values(params);
    });

    this.cmsService.detail(this.id[0]).subscribe(
      res=>{
        this.posts=res;
        this.dataSource = new MatTableDataSource(this.posts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => console.log("Error: "+err)
    );
  }
  /**
   * Función de busqueda de filtro
   * en el la tabla dinamacia de angular
   * material 
   * @param event cambios en el Filter Table para busqueda. 
   */
  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  /**
   * Botón de retorno a masterdata.
   */
  onReturn(){
    this.router.navigate(['/masterdata']);
  }
}
