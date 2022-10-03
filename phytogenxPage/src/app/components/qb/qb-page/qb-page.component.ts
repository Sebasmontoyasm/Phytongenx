import { Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { QbService } from 'src/app/services/qb/qb.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { Qb } from 'src/app/interfaces/qb/qb';

@Component({
  selector: 'app-qb-page',
  templateUrl: './qb-page.component.html',
  styleUrls: ['./qb-page.component.css']
})
export class QbPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
   
  }
}
