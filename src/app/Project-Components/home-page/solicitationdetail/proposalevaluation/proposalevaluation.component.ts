import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { FormsService } from '../../../../Services/forms.service';
import { AcquisitionService } from "../../../../Services/acquisition.service";
import { AuthenticationService } from "../../../../Services/authentication.service";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import 'rxjs/add/operator/switchMap';

declare var $: any;


@Component({
  selector: 'app-proposalevaluation',
  templateUrl: './proposalevaluation.component.html',
  styleUrls: ['./proposalevaluation.component.css']
})
export class ProposalevaluationComponent implements OnInit {
  
  solno;
  proposalEvaluation;
  dueDate;
 
  constructor(private route: ActivatedRoute, private router: Router, private formsService: FormsService,
    private acqService: AcquisitionService, private auth: AuthenticationService) { }

  ngOnInit() {
    this.solno = this.route.snapshot.parent.params.sid;
    console.log(this.solno);

    
}

award() {

}
}
