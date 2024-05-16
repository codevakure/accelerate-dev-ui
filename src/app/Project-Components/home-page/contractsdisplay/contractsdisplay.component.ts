
import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { AcquisitionService } from "../../../Services/acquisition.service";
import { AuthenticationService } from "../../../Services/authentication.service";
import {
  Router,
  Event,
  NavigationEnd,
  NavigationError,
  NavigationStart
} from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-contractsdisplay',
  templateUrl: './contractsdisplay.component.html',
  styleUrls: ['../Acquisitions/pmacquisitions.component.css']
})
export class ContractsdisplayComponent implements OnInit {

  getsolicitation;
  displayedColumns: string[] = [
    "sol_no",
    "description",
    "anticipatedDate",
    "status",
    "actions"
  ];
  displayAccept;
  dataSource;
  searchKey: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private authco: AuthenticationService,
    private acqco: AcquisitionService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.acqco.getContracts().subscribe((data) => {
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

  onReview(selectedSol: any) {
    this.router.navigate(["/home/contracts/", selectedSol.contract_no]);
  }

}
