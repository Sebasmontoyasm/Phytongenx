import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogdelete-page',
  templateUrl: './dialogdelete-page.component.html',
  styleUrls: ['./dialogdelete-page.component.css']
})
export class DialogdeletePageComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogdeletePageComponent>) { }

  ngOnInit(): void {
  }

}
