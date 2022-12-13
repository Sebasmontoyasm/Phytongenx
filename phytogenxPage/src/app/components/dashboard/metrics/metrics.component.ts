import { Component, OnInit, OnDestroy } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Subject, takeUntil } from 'rxjs';
import { AlertcodesService } from 'src/app/services/alerts/alertcodes.service';
import { MetricsService } from 'src/app/services/metrics/metrics.service';


@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})
export class MetricsComponent implements OnInit, OnDestroy {

  private destroy = new Subject<any>();

  pofound: any;
  poloaded: any;
  invoicesfound: any;
  invoicesloaded: any;

  view: [number, number] = [728,195];

  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme: Color = {
    name: 'circle-diagram',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AAA454', '#A10A28','#C7B42C','#AAAAAA'],
  };

  ngOnDestroy(): void {
    this.destroy.next({});
    this.destroy.complete();
  }

  ngOnInit(): void {
    this.getDefault();
  }

  PO_FoundData = [
    {
      "name": "PO found",
      "value": 0
    },
    {
      "name": "PO not found",
      "value": 0
    }
  ];

  PO_LoadedData = [
    {
      "name": "PO loaded",
      "value": 0
    },
    {
      "name": "PO not loaded",
      "value": 0
    }
  ];
  Invoices_FoundData = [
    {
      "name": "Invoices found",
      "value": 0
    },
    {
      "name": "Invoices not found",
      "value": 0
    }
  ];

  Invoices_LoadedData = [
    {
      "name": "Invoices loaded",
      "value": 0
    },
    {
      "name": "Invoices not loaded",
      "value": 0
    }
  ];

  constructor(private metricService: MetricsService,
              private alert: AlertcodesService) {
  }

  getDefault(){

    this.metricService.getCMSFound().pipe(
      takeUntil(this.destroy)
    ).subscribe(
      res=>{
        this.pofound=res;

        this.PO_FoundData = [
          {
            "name": "PO found",
            "value": this.pofound[0].PO_Found
          },
          {
            "name": "PO not found",
            "value": this.pofound[1].PO_Found
          }
        ]
      },
      error => {
        this.alert.alertMessage(error[0],error[1]);
      }
    );

    this.metricService.getCMSLoaded().pipe(
      takeUntil(this.destroy)
    ).subscribe(
      res=>{
        this.poloaded=res;

        this.PO_LoadedData = [
          {
            "name": "PO loaded",
            "value": this.poloaded[0].PO_Loaded
          },
          {
            "name": "PO not loaded",
            "value": this.poloaded[1].PO_Loaded
          }
        ]
      },
      error => {
        this.alert.alertMessage(error[0],error[1]);
      }
    );

    this.metricService.getQbFound().pipe(
      takeUntil(this.destroy)
    ).subscribe(
      res=>{
        this.invoicesfound=res;

        this.Invoices_FoundData = [
          {
            "name": "Invoices found",
            "value": this.invoicesfound[0].Invoice_Found
          },
          {
            "name": "Invoices not found",
            "value": this.invoicesfound[1].Invoice_Found
          }
        ]
      },
      error => {
        this.alert.alertMessage(error[0],error[1]);
      }
    );

    this.metricService.getQbLoaded().pipe(
      takeUntil(this.destroy)
    ).subscribe(
      res=>{
        this.invoicesloaded=res;

        this.Invoices_LoadedData = [
          {
            "name": "Invoices loaded",
            "value": this.invoicesloaded[0].Invoice_Loaded
          },
          {
            "name": "Invoice not receive",
            "value": this.invoicesloaded[2].Invoice_Loaded
          },
          {
            "name": "Invoices not loaded",
            "value": this.invoicesloaded[1].Invoice_Loaded
          },
        ]
      },
      error => {
        this.alert.alertMessage(error[0],error[1]);
      }
    );
  }

  onRefresh(){
    window.location.reload();
  }
}
