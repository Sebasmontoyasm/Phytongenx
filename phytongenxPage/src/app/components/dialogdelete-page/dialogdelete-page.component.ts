import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MasterDataService } from 'src/app/services/masterdata.service';


@Component({
  selector: 'app-dialogdelete-page',
  templateUrl: './dialogdelete-page.component.html',
  styleUrls: ['./dialogdelete-page.component.css']
})
export class DialogdeletePageComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {id: number},
   public dialogRef: MatDialogRef<DialogdeletePageComponent>,
   private mdService:MasterDataService
   ) {
   }

  ngOnInit(): void {
  }

  deleteService() {
    this.mdService.deleteDataID(this.data.id).subscribe(
      res=>{
        console.log(res);
      },
      err => console.log("Error: "+err.errorMessage)
    );

    //this.mdService.addData(this.data.id).subscribe(
     // res=>{
      //7  console.log(res);
     // },
    //  err => console.log("Error: "+err.errorMessage)
    //);
  }

}
