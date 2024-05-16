import { Component, OnInit, ViewChild } from "@angular/core";
import { AcquisitionService } from "../../../Services/acquisition.service";
import { AuthenticationService } from "../../../Services/authentication.service";
import { Router } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of, timer } from 'rxjs';
declare var $: any;


@Component({
  selector: 'app-pmsol',
  templateUrl: './pmsol.component.html',
  styleUrls: ['../Acquisitions/pmacquisitions.component.css']
})
export class PmsolComponent implements OnInit {
  getsolicitation;
  displayedColumns: string[] = [
    "sol_no",
    "description",
    "poc",
    "date",
    "status",
    "actions"
  ];
  dataSource;
  searchKey: string;
  username;
  userid;
  role;
  hideco: boolean = false;
  hidepm: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private authco: AuthenticationService,
    private acqco: AcquisitionService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.acqco.getUserprofile().subscribe(response => {
      this.username = response.firstName;
      if(response.roles[0].roleName == "Contracting Officer (CO)") {
        this.role = "Contracting Officer"
        this.hideco = true;
      } else if (response.roles[0].roleName == "Program Manager (PM)") {
        this.role = "Program Officer"
        this.hidepm = true;
      }
    })
    this.acqco.getSolicitations().subscribe((data) => {
      this.getsolicitation = data;
      console.log(this.getsolicitation);
      this.dataSource = new MatTableDataSource(this.getsolicitation);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onResume(selectedSol: any) {
   // document.getElementById("closeModalSolicitation").click();
    console.log(selectedSol);
    // this.router.navigate(['/pacd', selectedSol.form_id]);
       // this.spinner.show();
 
        // setTimeout(() => {
        //     this.spinner.hide();
            this.router.navigate(['/home/sol', selectedSol.sol_no]);
        // }, 10000);

  }
  onSubmit(selectedSol: any) {
    
    console.log(selectedSol.sol_no);
  }

  sendEmailPm(element) {
    var email = element.rEmail;
    var subject = "Regarding"+" "+element.ap_no+" "+element.projectTitle;
    var emailBody = 'Hi '+element.rName;
    document.location.href = "mailto:"+email+"?subject="+subject+"&body="+emailBody;
  }

  sendEmailCo(element) {
    var email = element.coEmail;
    var subject = "Regarding"+" "+element.ap_no+" "+element.projectTitle;
    var emailBody = 'Hi '+element.coName;
    document.location.href = "mailto:"+email+"?subject="+subject+"&body="+emailBody;
  }

}

