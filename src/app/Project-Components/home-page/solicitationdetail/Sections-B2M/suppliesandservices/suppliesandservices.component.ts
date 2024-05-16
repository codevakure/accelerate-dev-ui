import { Component, OnInit } from '@angular/core';
import { AcquisitionService } from "../../../../../Services/acquisition.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SectionsService } from "../../../../../Services/sections.service";

declare var $: any;

@Component({
  selector: 'app-suppliesandservices',
  templateUrl: './suppliesandservices.component.html',
  styleUrls: ['./suppliesandservices.component.css']
})
export class SuppliesandservicesComponent implements OnInit {

  solno;
  data;
  id;
  sectionname='supply';
  hideEditor: boolean = false;
  hideDiv: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private ap: AcquisitionService,
    private sections: SectionsService
  ) {}
  status;
  disabled;
  response;
  ngOnInit() {
    this.solno = this.route.snapshot.parent.params.sid;
    //console.log(this.solno)
    this.getSectiondata();
    


  }


  onContentChanged(event) {
  //  console.log(event.html);
    this.sections.patchSections(this.id, this.sectionname, event.html).subscribe(response => {
      if (response) {
        setTimeout(() =>
          this.toastr.success("Error Occured", "Server Error", {
            timeOut: 2000
          })
        );
      } else {
      //  console.log("Updated Successfully");
      }
    });
  }


  getSectiondata() {
    this.ap.getsoldappids(this.solno).subscribe(response => {
      console.log(response, "Supplies and services");
    //  this.ap.getAmendmentdapp(response.amendment_no).subscribe(amresp =>{
        this.id = response.supplyId;
        this.ap.getSolicitation(response.solId).subscribe(response => {
          this.status = response.status;
          this.response = response;
  
            this.ap.getUserprofile().subscribe(response => {
              //Code to verify the user is the Main CO
              if(this.status == 'Published' || this.status == 'Amendment' || this.status == 'Re-Published' ) {
                this.hideDiv = true;
              } else {
                this.hideEditor = true;
              }  
            })
          
  
        });
  
  
        console.log($(".projectsub").html())
       // console.log(this.id)
        this.sections.getSections(this.id, this.sectionname).subscribe(response => {
          this.data = response.description;
        //  this.data=response.description? response.description == '<div><br></div>' || ''?'<div><h3><b>B. Supplies and Services</b></h3></div><div><br></div>':response.description:'<div><h3><b>B. Supplies and Services</b></h3></div><div><br></div>';
        });
      })

   // });
  }

}
