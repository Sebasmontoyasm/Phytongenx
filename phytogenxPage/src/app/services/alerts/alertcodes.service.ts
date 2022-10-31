import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertcodesService {
  constructor( private _APIRestAlerts: MatSnackBar) { }

  alertMessage(code:string,message:string) {
    if(code == '201'){
      this._APIRestAlerts.open(message,'Ok');
    }else if(code == '0'){
      message = 'The connection to the server has been lost';
      this._APIRestAlerts.open('Error Code: '+code
      +" - "+message+" - Please contact with your administrator.",'Ok');
    }else if(code == '404'){
      this._APIRestAlerts.open('Error Code: '+code
      +" - "+message,'Ok');
    }else{this._APIRestAlerts.open('Error Code: '+code
    +" - "+message+" - Please contact with your administrator.",'Ok');
    }
  }
}
