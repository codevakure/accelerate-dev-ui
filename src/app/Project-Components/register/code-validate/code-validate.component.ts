import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../Services/authentication.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-code-validate',
  templateUrl: './code-validate.component.html',
  styleUrls: ['./code-validate.component.css']
})
export class CodeValidateComponent implements OnInit {


  confirmCode: boolean = false;
  codeWasConfirmed: boolean = false;
  error: string = "";

  constructor(private fb: FormBuilder, 
    private router: Router, private auth: AuthenticationService) { }

  ngOnInit() {
  }

  code = new FormControl('', [Validators.required]);

  codeForm: FormGroup = this.fb.group({
    code: this.code,
  })


  validateAuthCode(form: NgForm) {
    const code = form.value.code;
    
    this.auth.confirmAuthCode(code).subscribe(
      (data) => {
        //this._router.navigateByUrl('/');
        this.codeWasConfirmed = true;
        this.confirmCode = false;
      },
      (err) => {
        console.log(err);
        this.error = "Confirm Authorization Error has occurred";
      });
  }
}
