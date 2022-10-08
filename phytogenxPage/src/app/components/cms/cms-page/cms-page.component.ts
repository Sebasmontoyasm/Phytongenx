import { Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CmsService} from 'src/app/services/cms/cms.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogdeletePageComponent } from '../../customs/dialogdelete-page/dialogdelete-page.component';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cms } from 'src/app/interfaces/cms/cms';
import { UserLog } from 'src/app/interfaces/user/userlog';

const COLUMNS_SCHEMA = [
  { key: 'ID', type: 'text', label: 'ID'},
  { key: 'PO_NUMBER', type: 'text', label: 'PO_NUMBER'},
  { key: 'Reason', type: 'text', pattern:"[A-Za-z0-9]", label: 'Reason'},
  { key: 'Other', type: 'text', pattern:"[A-Za-z0-9]", label: 'Other'},
  { key: 'Date_CSM_Processed', type: 'date', pattern:"[A-Za-z0-9]", label: 'Date CSM Processed'},
  { key: 'Upload_PDF', type: 'button', label: 'Cargar PDF'},
  { key: 'Action', type: 'button', label: 'Action'}
];

@Component({
  selector: 'app-cms-page',
  templateUrl: './cms-page.component.html',
  styleUrls: ['./cms-page.component.css']
})
/**
 * Pagina principal para actualización
 * de CMS que se hicieron manual o tienen un error.
 */
export class CmsPageComponent implements OnInit {

  title = 'data-table';

  dataSource!: MatTableDataSource<Cms>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  columnsSchema: any = COLUMNS_SCHEMA;
  posts:any = [];
  displayedColumn: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  
  selectedFiles?: any;
  progress: number = 0;
  currentFile?: any;
  message= '';
  fileInfos?: Observable<any>;

  reason: string = "";

  public deleteID = 0; 

  usrlog: UserLog = {
    user: 1,
    rol: "Tester",
    action: "",
    dateaction: "",
    iddata: 0,
    idpo: 0,
    idinvoce: 0,
    comments: "",    
  };
  

  constructor(private cmsService:CmsService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCms();
  }

  getCms()
  {
    this.cmsService.manually().subscribe(
      res=>{
        this.posts=res;
        this.dataSource = new MatTableDataSource(this.posts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => console.log("Error CMS View: "+err)
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
   * recolecta el PDF cargado para mandarlo al backend
   * @param event PDF file.
   */
  chooseFile(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(filterValue);
  }

  /**
   * Guarda el id del archivo que se desea eliminar.
   * @param id PO Number que se desea eliminar.
   */
  getDeleteID(id: number){
    this.deleteID = id;
  }
  /**
   * Animacion para abrir una ventana emergente
   * Para confirmar eliminación de archivo.
   * @param enterAnimationDuration animacion de ventana emergente
   * @param exitAnimationDuration cerrado de animacion
   * @parama data recolecta el id y el log con los comentarios para guardar
   */
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
      this.dialog.open(DialogdeletePageComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data:{ id: this.deleteID, userlog: this.usrlog,title:'cms'}
    });
  }

  observerReasonOpt(id: number){
    console.log("Click Option: "+id);    
  }

  onFileSelected(event:any):void{
    this.selectedFiles = event.target.files;
  }

  onUploadFile(){
      this.progress = 0;
  
      if (this.selectedFiles) {
        const file: File | null = this.selectedFiles.item(0);
  
        if (file) {
          this.currentFile = file;
  
          this.cmsService.upload(this.currentFile).subscribe({
            next: (event: any) => {
              if (event.type === HttpEventType.UploadProgress) {
                this.progress = Math.round(100 * event.loaded / event.total);
              } else if (event instanceof HttpResponse) {
                this.message = event.body.message;
                this.fileInfos = this.cmsService.getFiles();
              }
            },
            error: (err: any) => {
              console.log(err);
              this.progress = 0;
  
              if (err.error && err.error.message) {
                this.message = err.error.message;
              } else {
                this.message = 'Could not upload the file!';
              }
  
              this.currentFile = undefined;
            }
          });
        }
  
        this.selectedFiles = undefined;
      }
    }  
}



