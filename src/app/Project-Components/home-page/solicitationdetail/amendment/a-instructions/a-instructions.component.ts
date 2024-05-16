import { Component, OnInit } from '@angular/core';
import { AcquisitionService } from "../../../../../Services/acquisition.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SectionsService } from "../../../../../Services/sections.service";

declare var $: any;

@Component({
  selector: 'app-a-instructions',
  templateUrl: './a-instructions.component.html',
  styleUrls: ['./a-instructions.component.css']
})
export class AInstructionsComponent implements OnInit {

  solno;
  data;
  id;
  sectionname='instruction';
  clauseString = "";
  status;
  disable;
  response;
  hideEditor: boolean = false;
  hideDiv: boolean = false;
  hideclauses:boolean = false;

  changes=[]
  socid
  orginaldata

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private ap: AcquisitionService,
    private sections: SectionsService
  ) {}

  ngOnInit() {
    this.solno = this.route.snapshot.parent.params.sid;
  //  console.log(this.solno)
    this.getSectiondata();
  }


  onContentChanged(event) {
    if(event.html != undefined){
      this.sections.patchSections(this.id, this.sectionname, event.html)
      .subscribe(response => {
        if (response) {
          setTimeout(() =>
            this.toastr.success("Error Occured", "Server Error", {
              timeOut: 2000
            })
          );
        } else {
          //console.log("Updated Successfully");
        }
      });
    }
  
      if(event.source != 'api' &&  event.html == undefined){
        if(this.data != this.orginaldata){
          let change = `<b>INSTRUCTIONS</b> was updated. `,data4
          this.changes.push(change);
          data4={
            instructionChanges:this.changes
          }
          if( this.changes.length < 2){
            this.patchchanges(data4)
          }
          this.orginaldata = this.data
        }
     }
  





  }

  getSectiondata() {
    this.ap.getsoldappids(this.solno).subscribe(response => {
      this.ap.getAmendmentdapp(response.amendment_no).subscribe(amres => {
        this.id = amres.instructionId;
        this.socid = amres.socId;
      this.ap.getSolicitation(response.solId).subscribe(response => {
        this.status = response.status;
        this.response = response;
        this.ap.getUserprofile().subscribe(response => {
          //Code to verify the user is the Main CO
          if(this.status == 'Re-Published' ) {
            this.hideDiv = true;
          } else {
            this.hideEditor = true;
          };

          setTimeout(() => {
            this.hideclauses = true
          }, 100);
        })

      });


              
      //console.log(this.id)
      this.sections
      .getSections(this.id, this.sectionname)
      .subscribe(response => {
        console.log(response);
        this.clauseString = response.clause;
        this.data = response.description;
        this.orginaldata = response.description
        //this.data=response.description? response.description == '<div><br></div>'?'<div><h3><b>L. Instructions</b></h3></div><div><br></div>':response.description:'<div><h3><b>L. Instructions</b></h3></div><div><br></div>';
      });

      this.sections
      .getSections(this.socid, 'soc')
      .subscribe((response5) => {
        console.log('***SummaryofChangesData',response5)
        console.warn(typeof response5.instructionChanges)
        if( response5.instructionChanges == undefined){
         this.changes = [];
        }else{
          this.changes = response5.instructionChanges
        }


      });

      
    });
  });
  }

  patchchanges(data){
    console.log('***********data sent to Changes',data)
    this.sections.patchSectionsChanges(this.socid, 'soc', data).subscribe(response => {
      if (response) {
        setTimeout(() =>
          this.toastr.success("Added Change", "Server Error", {
            timeOut: 2000
          })
        );
      } else {
       // console.log("Updated Successfully");
      }
    });
  }

}


