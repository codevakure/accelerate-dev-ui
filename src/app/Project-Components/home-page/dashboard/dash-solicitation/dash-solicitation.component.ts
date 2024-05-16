import { Component, OnInit, Input } from '@angular/core';
import { AcquisitionService } from '../../../../Services/acquisition.service';
import { AuthenticationService } from '../../../../Services/authentication.service';
import { acquisition } from '../../../../Models/acquisition.model';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dash-solicitation',
  templateUrl: './dash-solicitation.component.html',
  styleUrls: ['../dash-acquisition/dash-acquisition.component.css']
})
export class DashSolicitationComponent implements OnInit {
  
  getsol;
  role = "";
  disable: boolean = false;
  
  constructor(private auth: AuthenticationService, private acqco: AcquisitionService,  private router: Router, private toastr: ToastrService) { }

  ngOnInit() {

    // this.auth.getAttributes().subscribe((data) => {
    //   this.role = data[20].Value;
    // });
    
    this.acqco.getUserprofile().subscribe(response => {
      //console.log(response.firstName);
      if(response.roles[0].roleName == "Contracting Officer (CO)") {
        this.role = "Contracting Officer"
      } else if (response.roles[0].roleName == "Program Manager (PM)") {
        this.role = "Program Officer"
      }
    })
    this.acqco.getSolicitations()
      .subscribe((data) => {
        this.getsol = data;
        console.log(this.getsol);
        //console.log(this.getsol); 
      })

      
  }

  onResume(selectedSol: any) {
    // console.log(selectedSol.sol_no);
    this.router.navigate(['/home/sol', selectedSol.sol_no]);
  }
}