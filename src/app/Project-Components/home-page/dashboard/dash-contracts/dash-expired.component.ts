import { Component, OnInit, Input} from '@angular/core';
import { AcquisitionService } from '../../../../Services/acquisition.service';
import { AuthenticationService } from '../../../../Services/authentication.service';
import { acquisition } from '../../../../Models/acquisition.model';
import { Router } from "@angular/router";

@Component({
  selector: 'app-dash-expired',
  templateUrl: './dash-expired.component.html',
  styleUrls: ['../dash-acquisition/dash-acquisition.component.css']
})
export class DashExpiredComponent implements OnInit {
  // getacq: acquisition[];

  getacq;
   

  constructor(private authco: AuthenticationService, private acqco: AcquisitionService, private router: Router) { }

  ngOnInit() {
    this.acqco.getContracts()
    .subscribe((data) => {
      console.log(data);
      this.getacq = data;
    });

  }
  contractGenerated(contract_no) {
    console.log("clicked");
    this.router.navigate(["/home/contracts/", contract_no]);
  }

}
