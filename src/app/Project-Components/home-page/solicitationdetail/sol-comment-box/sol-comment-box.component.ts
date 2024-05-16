import {   Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  OnChanges,
  EventEmitter,
  SimpleChanges } from "@angular/core";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { FormsService } from "../../../../Services/forms.service";
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
declare var $: any;
import { SanitizeHtmlPipe } from '../../../../sanitize-html.pipe';
// import 'quill-emoji/dist/quill-emoji.js';
import Quill from 'quill'
import 'quill-mention'

import { QuillEditorComponent } from 'ngx-quill'

@Component({
  selector: 'app-sol-comment-box',
  templateUrl: './sol-comment-box.component.html',
  styleUrls: ['./sol-comment-box.component.css']
})
export class SolCommentBoxComponent implements OnInit {

  commentService;
  commentMessage;
  replyMessage;
  modules = {};
  @Input() sectionHeader;
//   data1 = [{
// value: "Varun Kumar Reddy",
// lastName: "Muppidi",
//   },
//   {
//     value: "Daren",
//     lastName: "Muppidi",
//       }];
  content = '';
  username;
  solno;
  id;
  replyBoolean: boolean = true;
  @ViewChild(QuillEditorComponent) editor: QuillEditorComponent
  @Input() data: any[];
  @Input() routeHeader;
  commentUsers =  new Array();
  commentUservalue;
  replyTextvalue;
  commentText;
  emailUser;
  username1;
  commentUserName;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formsService: FormsService,
    private acqService: AcquisitionService,
    private toastr: ToastrService,
    private auth: AuthenticationService,
    private fb: FormBuilder,
    private ap: AcquisitionService
  ) {
    this.modules = {
      // 'emoji-shortname': true,
      // 'emoji-textarea': true,
      // 'emoji-toolbar': true,
      mention: {
        allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
        onSelect: (item, insertItem) => {
          const editor = this.editor.quillEditor as Quill
          insertItem(item)
          //////console.log(item.value);
          this.commentUsers.push(item.value);
          this.commentUservalue = item.value;
          // necessary because quill-mention triggers changes as 'api' instead of 'user'
          editor.insertText(editor.getLength() - 1, '', 'user')
        },
        source: (searchTerm, renderList) => {
          // const values = [
          //   { value: 'Mehul' },
          //   { value: 'Imneet' }
          // ]

  
          if (searchTerm.length === 0) {
            renderList(this.data, searchTerm)
          } else {
            const matches = []
  
            this.data.forEach((entry) => {
              ////////console.log(entry)
              if (entry.value.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                matches.push(entry)
              }
            })
           // //////console.log(matches);
            renderList(matches, searchTerm)
          }
        }
      },
      toolbar: { container: [ 'emoji' ] },
    }


  }

  ngOnInit() {
   // //////console.log("Solicitation Numbersasa" +this.route.snapshot.parent.params);
    ////////console.log("Solicitation Number" +this.solno);

    this.commentService = new FormGroup({
      typeSection: new FormControl(""),
      description: new FormControl(''),
      comments: new FormArray([])
    });


    this.ap.getUserprofile().subscribe(response => {
     // //////console.log(response.firstName);
      this.username = response.firstName;
      var fullName = response.email.split('@')[0].split('.');
      var firstName = fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
      var lastName = fullName[ fullName.length-1 ].charAt(0).toUpperCase() + fullName[ fullName.length-1 ].slice(1);
      this.emailUser = firstName;
      console.log(this.emailUser);
      this.username = response.firstName + " " +response.lastName;
      this.username1 = response.firstName;
      if(this.username1 == 'Not') {
        this.commentUserName= this.emailUser; 
      } else if (this.username1 != 'Not') {
        this.commentUserName= this.username; 
      }
    })
    ////////console.log(this.data);
  }
  ngOnChanges(changes: SimpleChanges) {
    this.solno = this.route.snapshot.params.sid;
    console.log("Testing Route header from comments",this.routeHeader);
    //////console.log("Solicitation Number from Comments" +this.solno);
    //////console.log(this.sectionHeader);
    this.getCommentsdata(this.sectionHeader);
  }

  onContentChanged(event) {
    this.commentMessage = event.html;
    this.onChange(this.commentService);
    this.commentText = event.text;
  }

  replyMessageevent(event) {
    this.replyMessage = event.html;
    this.onChange(this.commentService);
    this.replyTextvalue = event.text;
  }

  initComments() {
    return new FormGroup({
      replyDescription: new FormControl(''),
      commentText: new FormControl(this.commentMessage),
      commentDate: new FormControl(new Date()),
      commentUser: new FormControl(this.commentUserName),
      replyGroup: new FormArray([])
    });
  }

  initReplies() {
    return new FormGroup({
      replyText: new FormControl(this.replyMessage),
      replyDate: new FormControl(new Date()),
      replyUser: new FormControl(this.commentUserName),
    });
  }

  addComments() {
    const control = <FormArray>this.commentService.get("comments");
    control.push(this.initComments());

    var data1 = {
      //  ap_no: selectedSol.ap_no,
      ap_no: this.solno,
      users: this.commentUsers,
      textUser: this.commentUserName,
      commentText: this.commentText,
      sectionHeaders: this.sectionHeader,
      routeHeaders: this.routeHeader,
      text: "tagged you in the comment for"+" "+this.sectionHeader,
      message: "for Sol" + " " + "#" + this.solno,
      iconstyle: "fa-commenting-o",
      date: new Date(),
      type: "Comment",
      status: "Initiated",
      }
      this.ap.postAttnotifications(data1).subscribe(Response => {
        ////////console.log(Response);
        //////console.log("Commented in Solicitation");
      })
    this.commentService.get('description').setValue('');
    this.commentService.get('typeSection').setValue(this.sectionHeader);
    setTimeout(()=>{
      this.commentUsers.splice(0,this.commentUsers.length);
    },3000)
    this.onChange(this.commentService);
  }

  addReplies(i) {
   // //////console.log(i);
    const control = <FormArray>(this.commentService.get("comments").controls[i].get("replyGroup"));
    control.push(this.initReplies());
   // //////console.log("length"+control.length);
  var data1 = {
  //  ap_no: selectedSol.ap_no,
    ap_no: this.solno,
    users: this.commentUsers,
    textUser: this.commentUserName,
    commentText: this.replyTextvalue,
    sectionHeaders: this.sectionHeader,
    routeHeaders: this.routeHeader,
    text: "tagged you in the reply for"+" "+this.sectionHeader,
    message: "for Sol" + " " + "#" + this.solno,
    iconstyle: "fa-commenting-o",
    date: new Date(),
    type: "Comment",
    status: "Initiated",
  }
  this.ap.postAttnotifications(data1).subscribe(Response => {
    ////////console.log(Response);
    //////console.log("Commented in Solicitation");
  })
  ////////console.log(data);
  this.commentService.get("comments").controls[i].get("replyDescription").setValue('');
  setTimeout(()=>{
    this.commentUsers.splice(0,this.commentUsers.length);
  },3000)

    $("#prefix" + i).addClass("show");
    this.onChange(this.commentService);
    //(<HTMLInputElement>document.getElementById("collapseExample")).classList.add('show');
   // (<HTMLInputElement>document.getElementById("replyClick")).click();
    //(<HTMLInputElement>document.getElementById("replyText")).value = "";
  }
  removeComments(i) {
    const control = <FormArray>this.commentService.get("comments");
    control.removeAt(i);
    this.onChange(this.commentService)
  }
  removeReply(control, index) {
    control.removeAt(index);
    this.onChange(this.commentService)
  }

  getComments(form) {
    return form.controls.comments.controls;
  }

  setReplies(x) {
    let array = new FormArray([]);
    x.replyGroup.forEach(y => {
      array.push(
        this.fb.group({
          replyText: y.replyText,
          replyDate: y.replyDate,
          replyUser: y.replyUser,
        })
      );
    });
    return array;
  }

  getCommentsdata(x) {
    this.ap.getsoldappids(this.solno).subscribe(response => {
      //////console.log(this.solno);
      //////console.log("resposnse from comments" );
      //////console.log(response);
      this.ap.getSolicitation(response.solId).subscribe(response => {
          //////console.log(response);
         // this.data = response.commentMention;
          if(this.username1 == 'Not') {
            this.data = response.commentMention.filter(v => v.value !== this.emailUser); 
          } else if (this.username1 != 'Not') {
            this.data = response.commentMention.filter(v => v.value !== this.username); 
          }
      });
      this.ap.getAcqcomments(this.solno, x).subscribe(response => {
        this.ngOnInit();
        //////console.log(response);

        if(response[0] != undefined) {
          this.id = response[0].id
          this.commentService.get("typeSection").setValue(response.typeSection);
          let control = <FormArray>this.commentService.controls.comments;
          if (response[0].comments != undefined) {
          response[0].comments.forEach(postComments => {
            control.push(
              this.fb.group({
                replyDescription: postComments.replyDescription,
                commentText:  postComments.commentText,
                commentDate:  postComments.commentDate,
                commentUser: postComments.commentUser,
                replyGroup: this.setReplies(postComments)
              })
            );
          });
        }
      }
      });
     });
  }

  getReplies(form) {
    return form.controls.replyGroup.controls;
  }

  onChange(commentService) {
    ////////console.log(commentService.value);
    this.ap.patchComments(this.id, commentService.value).subscribe(response => {
      if (response) {
        setTimeout(() =>
          this.toastr.success("Error Occured", "Server Error", {
            timeOut: 2000
          })
        );
      } else {
        ////////console.log("Updated Successfully");
      }
    });
  }

  replyReply(i) {
  // this.replyBoolean = false;
  const control = <FormArray>this.commentService.get("comments");
   ////////console.log(i);
  // //////console.log("reply");
  // var k = i-1;
 // //////console.log("#prefix" + k);
  // var startHeader = control.length[i- 1];
  for(var k=1; k<=control.length; k++) {
      var n = k-1
      $("#prefix" + n).removeClass("show");
      $("#suffix" + n).removeClass("show");
    ////////console.log(k);
  }
  this.onChange(this.commentService)
}
}

