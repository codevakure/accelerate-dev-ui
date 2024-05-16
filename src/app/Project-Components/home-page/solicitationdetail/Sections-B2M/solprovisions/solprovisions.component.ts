import { Component, OnInit, OnChanges } from '@angular/core';
import { AcquisitionService } from "../../../../../Services/acquisition.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SectionsService } from "../../../../../Services/sections.service";

@Component({
  selector: 'app-solprovisions',
  templateUrl: './solprovisions.component.html',
  styleUrls: ['./solprovisions.component.css']
})
export class SolprovisionsComponent implements OnInit {

  solno;
  status;
  sol_id;
  data;
  id;
  id2;
  //sectionname='provisions';
  sectionname='contract-clause';
  clauseString;
  hideEditor: boolean = false;
  hideDiv: boolean = false;
  disabled;
  response;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private ap: AcquisitionService,
    private sections: SectionsService
  ) { }

  

  ngOnInit() {
    this.solno = this.route.snapshot.parent.params.sid;
    console.log(this.solno)
    this.getSectiondata();
  }

  onContentChanged(event) {
    //  console.log(event.html);
      this.sections.patchSections(this.id2, 'packaging', event.html).subscribe(response => {
        console.log('patch made')
        if (response) {
          setTimeout(() =>
            this.toastr.success("Error Occured", "Server Error", {
              timeOut: 2000
            })
          );
        } else {
          //console.log("Updated Successfully");
        }
      },error =>{
        console.log(error)
      });
    }
  
  
    getSectiondata() {
      this.ap.getsoldappids(this.solno).subscribe(response => {
        this.id = response.contractClauseId;
        this.id2=response.packagingId;

        this.ap.getSolicitation(response.solId).subscribe(response => {
          this.status = response.status;
          this.response = response;
          this.ap.getUserprofile().subscribe(response => {
            //Code to verify the user is the Main CO
            if(this.status == 'Published' || this.response.pointsofContact[0].includes(response.pkId)) {
              this.hideDiv = true;
            } else {
              this.hideEditor = true;
            };
            setTimeout(() => {
             // this.hideclauses = true
            }, 100);
          })
  
        });
  
  
        this.sections.getSections(this.id, this.sectionname).subscribe(response => {
            this.clauseString = response.clause;
        });

        this.sections.getSections(this.id2, 'packaging').subscribe(response => {
          this.data = response.description;
      });
      });
    }
  
  }
  
