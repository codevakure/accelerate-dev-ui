import { Response } from '@angular/http';
import { Event } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AcquisitionService } from "../../../../Services/acquisition.service";
import { AuthenticationService } from "../../../../Services/authentication.service";
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { saveAs } from 'file-saver';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import * as jwt_decode from "jwt-decode";
import { environment } from "../../../../../environments/environment";

@Component({
  selector: 'app-marketresearch',
  templateUrl: './marketresearch.component.html',
  styleUrls: ['./marketresearch.component.css']
})
export class MarketresearchComponent implements OnInit {

  UNITED_URL = environment.UNITED_ENV;
  FAR7105b1 = "Sources";
  FAR7105a8 = "Acquisition Streamlining";
  far10="Market Research";
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  filename;
  location;
  fname;
  getapno;
  date = new Date();
  fileToUpload: File = null;
  filetype;
  attachmentno;
  attachmentsdata;
  viewAttachment;
  token;
  userexists;
  userid;
  status;
  username;
  sourcesdesc;
  acqdesc;
  mrdata1;
  mrdata2;
  apId;
  type = "MarketResearch";
  noAttachments: boolean = false;
  yesAttachments: boolean = false;
  noDisabled: boolean = true;
  yesDisabled: boolean = true;
  compatibilityid;
  requirementsType = ['Design & Architecture', 'Evaluation Criteria','Key Personnel','Market Research', 'Statement of Work', 'Others' ];

  constructor(private _formBuilder: FormBuilder, private ap: AcquisitionService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.getapno = this.route.snapshot.parent.params.apid;
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ["", Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ["", Validators.required]
    });
    this.ap.getUserprofile().subscribe(response => {
      this.username = response.firstName;
    })
    var tokenInformation = Cookie.get('hhs-a-token');
    this.token = Cookie.get('hhs-a-token');
    var decodedValue = this.getDecodedAccessToken(tokenInformation);
    this.userid = decodedValue.pkId
    this.getAttachments();
  }


  getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }
  
  onSources(event)  {
  this.sourcesdesc = event.html;
  this.ap.patchMR(this.compatibilityid, this.sourcesdesc,this.acqdesc).subscribe(response => {});
  }

  onAcq(event) {
  this.acqdesc = event.html;
  console.log(this.acqdesc);
  this.ap.patchMR(this.compatibilityid, this.sourcesdesc, this.acqdesc).subscribe(response => {
    console.log(response);
  });
  }
  onFileSelected($event) {
    // //console.log($event);
    // //console.log($event.target.files[0]);
    // //console.log($event.path[0].files[0].name);
    this.fileToUpload = $event.target.files[0];
    this.filename = $event.path[0].files[0].name;
    
    if(this.filename != ""){
      document.getElementById('next').click();
    }
  }

  addFactors(event) {
    const newVal = event.target.value; 
    ////console.log(newVal);
    this.location = event.target.value;
  }

  uploadFile() {
    this.ap.postFile(this.fileToUpload).subscribe(response => {
      if (response) {
        console.log(response);
        this.fname = response.result.data.name;
        this.attachmentno = response.result.data.pkId;
        var data = {
          attachment_no: this.attachmentno,
          ap_no: this.getapno,
          title: this.fname,
          file_locator: "",
          file_type:this.location,
          ownerID: this.userid,
          ownerName: this.username,
          type: this.type,
          creation_date: new Date(),
        };

       this.ap.postAttnotifications(data).subscribe((response) => {
         //console.log(response);
         this.ngOnInit();
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
         }
         else if(allRadio[i].type == "text") {
           allRadio[i].value="";
         } else if(allRadio[i].type == "date") {
           allRadio[i].value="";
         } 
       }

      } else {
         //console.log(response);
        ////console.log('updated');

      }
    });
    let element: HTMLElement = document.getElementsByClassName('close')[0] as HTMLElement;
    return element.click();
  }
  getAttachments() {
    this.ap.getAttachments(this.getapno, this.type).subscribe((response) => {
      //console.log(response);
      this.attachmentsdata = response;
      this.attachmentsdata = response;
      if(this.attachmentsdata == ''){
        this.noAttachments = true;
        this.yesAttachments = false;
      } else if (this.attachmentsdata != '') {
        this.noAttachments = false;
        this.yesAttachments = true;
      }
    })
    this.ap.getApdappids(this.getapno).subscribe(response => {
      this.apId = response.apId;
      this.compatibilityid = response.compatibilityId;
      //console.log(response);
      this.ap.getApdata(response.apId).subscribe(response => {
        this.status = response.status;
        
        //console.log(response);
        //console.log(this.userid);
        this.userexists = response.pointsofContact.includes(this.userid);
        if(this.status == 'Shared' && this.userexists == false || this.status == 'Accepted' || this.status=='Initiated' || this.status=='Generated'){
          this.yesDisabled = true;
        } else {
          this.yesDisabled = false;
        }
        //console.log(this.userexists);
      });
      this.ap.getMR(this.compatibilityid).subscribe(response => {
        console.log("MRDATA",response)
        this.mrdata1 = response.description;
        this.mrdata2 = response.description1;
        //console.log(this.compatibilitydata);
      });
    });
  }
  downloadFile(x) {
    //console.log(x);

      this.ap.getFile(x).subscribe((response)=> {
        console.log(response)

      var length = response["_body"].length
      const contentDispositionHeader: string = response.headers["_headers"].get('cache-control').toString();
      const type = response.headers["_headers"].get('content-type').toString();
      //console.log(type);
       const parts: string[] = contentDispositionHeader.split(';');
      const filename = parts[1].split('=')[1];
      //console.log(filename);
      const blob = new Blob([response["_body"]], { type: type });
      var fileURL = URL.createObjectURL(blob);
      saveAs(blob, filename);
      })

  }

  deleteFile(id, index) {
    //console.log(id, index);
    this.ap.deleteAttachment(id).subscribe(response => {
      //console.log(response);
      this.attachmentsdata.splice(index,1);
    })
  }
  


}
