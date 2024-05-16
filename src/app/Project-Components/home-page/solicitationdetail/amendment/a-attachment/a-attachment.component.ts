import { Event } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AcquisitionService } from "../../../../../Services/acquisition.service";
import { AuthenticationService } from "../../../../../Services/authentication.service";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { Cookie } from 'ng2-cookies/ng2-cookies';
import * as jwt_decode from "jwt-decode";
import { SectionsService } from "../../../../../Services/sections.service";

@Component({
  selector: 'app-a-attachment',
  templateUrl: "../../../apdetail/attachments/attachments.component.html",
  styleUrls: ['./a-attachment.component.css']
})
export class AAttachmentComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  filename;
  location;
  fname;
  getapno;
  date = new Date();
  fileToUpload: File = null;
  filetype;
  attachmentsdata;
  requirementsType = [
    "Design & Architecture",
    "Evaluation Criteria",
    "Key Personnel",
    "Market Research",
    "Statement of Work",
    "Others"
  ];
  changes=[]
  solno;
  data;
  id;
  socid
  sectionname = "delivery";
  clauseString = "";
  type = "Attachments"
  attachmentno;
  username;
  userid;
  yesDisabled: boolean = false;
  noAttachments: boolean = false;
  yesAttachments: boolean = false;
  status;
  userexists;
  userpkid;
  enable;
  role;

  constructor(
    private _formBuilder: FormBuilder,
    private ap: AcquisitionService,
    private route: ActivatedRoute,
    private sections :SectionsService
  ) {}

  ngOnInit() {
    this.solno = this.route.snapshot.parent.params.sid;
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ["", Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ["", Validators.required]
    });
    this.ap.getUserprofile().subscribe(response => {
      this.username = response.firstName;
      this.userpkid = response.pkId;
      this.role = response.roles[0].roleName;
      if(this.role == 'Program Manager (PM)'){
        this.yesDisabled = true;
      } else {
        this.yesDisabled = false;
      }
      console.log("Role from user profile",response);
    })
    var tokenInformation = Cookie.get('hhs-a-token');
    var decodedValue = this.getDecodedAccessToken(tokenInformation);
    this.userid = decodedValue.pkId
    this.getSectiondata();
  //Script to pull the CO on the SOL
    this.ap.getfullsol(this.solno).subscribe(res =>{ 
     
      
      let SOL_CO = res.SOL.pointsofContact[1]; 
      console.log(SOL_CO, this.userpkid);
      this.enable= SOL_CO == this.userpkid? true:false
      console.log(this.enable)
    })

}


  getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }

  onFileSelected($event) {
    this.fileToUpload = $event.target.files[0];
    this.filename = $event.path[0].files[0].name;

    if (this.filename != "") {
      document.getElementById("next").click();
    }
  }

  addFactors(event) {
    const newVal = event.target.value;
    //console.log(newVal);
    this.location = event.target.value;
  }

  uploadFile() {
    console.log(this.fileToUpload);

    this.ap.postFile(this.fileToUpload).subscribe(response1 => {
      if (response1) {
        //console.log(response.data);
        this.ap.getsoldappids(this.solno).subscribe(response => {
          this.fname = response1.result.data.name;
          this.attachmentno = response1.result.data.pkId;
          this.id = response.ap_no;
          //console.log(this.id);
          var data = {
            attachment_no: this.attachmentno,
            ap_no: this.id,
            file_name: this.fname,
            file_locator: "",
            file_type:this.location,
            ownerID: this.userid,
            ownerName: this.username,
            type: this.type,
            creation_date: new Date(),
          };
          //Add Change Data to Summary of Changes
          let c = `<b>${this.fname.toUpperCase()}</b> was added.`
          this.changes.push(c)
          var changedata={
            attachmentsChanges:this.changes
          }
          this.patchchanges(changedata);

         this.ap.postAttnotifications(data).subscribe((response) => {
           console.log(response);
           this.ngOnInit();
         });




        });





        this.ngOnInit();
        var allRadio = document.getElementsByTagName("input");
        var select = document.getElementsByTagName("select");

        for (var i = 0; i < select.length; i++) {
          select[i].selectedIndex = 0;
          this.filename = "";
        }
        for (var i = 0; i < allRadio.length; i++) {
          if (allRadio[i].type == "radio") {
            allRadio[i].checked = false;
          } else if (allRadio[i].type == "text") {
            allRadio[i].value = "";
          } else if (allRadio[i].type == "date") {
            allRadio[i].value = "";
          }
        }
      } else {
        console.log(response1);
        //console.log('updated');
      }
    });
    let element: HTMLElement = document.getElementsByClassName(
      "close"
    )[0] as HTMLElement;
    return element.click();
  }

  getSectiondata() {
    this.ap.getsoldappids(this.solno).subscribe(response => {
      this.id = response.ap_no;
      console.log(this.id);

       this.ap.getAmendmentdapp(response.amendment_no).subscribe(amendata=>{
         this.socid=amendata.socId
         this.sections
      .getSections(this.socid, 'soc')
      .subscribe((response5) => {
        console.log('***SummaryofChangesData',response5)
        if( response5.attachmentsChanges == undefined){
         this.changes = [];
        }else{
          this.changes = response5.attachmentsChanges
        }


      });
       })
      //console.log(this.id);
      this.ap.getAttachments(this.id, this.type).subscribe(response => {
        //console.log(response);
        this.attachmentsdata = response;
        if(this.attachmentsdata == ''){
          this.noAttachments = true;
          this.yesAttachments = false;
        } else if (this.attachmentsdata != '') {
          this.noAttachments = false;
          this.yesAttachments = true;
        }
        console.log(this.attachmentsdata);
      });

      

      // this.ap.getApdappids(this.getapno).subscribe(response => {
      //   this.ap.getApdata(response.apId).subscribe(response => {
      //     this.status = response.status;
      //     this.userexists = response.pointsofContact.includes(this.userid);
      //     if(this.status == 'Initiated' && this.role == 'Program Manager (PM)' || this.status == 'Published' || this.status=='Generated'){
      //       this.yesDisabled = false;
      //     } else {
      //       this.yesDisabled = true;
      //     }
      //   });
      // });
    });
   // console.log(this.id);
  }

  downloadFile(x) {
    //console.log(x);
    this.ap.getFile(x).subscribe((response) => {
      //console.log(response);
      var binaryData = [];

      // binaryData.push(response);
      var length = response["_body"].length
      var buffer = new Uint8Array(response["_body"].length);
      for (var i=0; i<response["_body"].length; i++) {
        buffer[i] = response["_body"].charCodeAt(i);
       // //console.log(buffer)
      }
       
      const contentDispositionHeader: string = response.headers["_headers"].get('cache-control').toString();
      const type = response.headers["_headers"].get('content-type').toString();
      //console.log(type);
       const parts: string[] = contentDispositionHeader.split(';');
      const filename = parts[1].split('=')[1];
      //console.log(filename);
      const blob = new Blob([response["_body"]], { type: type });
      var fileURL = URL.createObjectURL(blob);
      //console.log(fileURL);
      saveAs(blob, filename);
    })
  }

  deleteFile(id, index) {
//
    this.ap.deleteAttachment(id).subscribe(response => {

      let c = `<b>${ this.attachmentsdata[index].file_name.toUpperCase()}</b> was deleted.`
          this.changes.push(c)
          var changedata={
            attachmentsChanges:this.changes
          }
          this.patchchanges(changedata);

      this.attachmentsdata.splice(index,1);
    })
  }
  // downloadFiles(data) {
  //   const blob = new Blob([data], { type: 'text' });
  //   const url= window.URL.createObjectURL(blob);
  //   window.open(url);
  // }

  patchchanges(data){
    console.log('***********data sent to Changes',data)
    this.sections.patchSectionsChanges(this.socid, 'soc', data).subscribe(response => {
      if (response) {
        // setTimeout(() =>
        //   this.toastr.success("Added Change", "Server Error", {
        //     timeOut: 2000
        //   })
        // );
      } else {
       // console.log("Updated Successfully");
      }
    });
  }
}
