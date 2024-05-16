import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../Services/authentication.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  confirmCode: boolean = false;
  codeWasConfirmed: boolean = false;
  error: string = "";

  constructor(private fb: FormBuilder,
    private router: Router, private auth: AuthenticationService) { }

  ngOnInit() {
  }

  register(form: NgForm) {
    const username = form.value.email;
    const password = form.value.password;

    this.auth.register(username, password).subscribe(
      (data) => {
        console.log(data);
        this.confirmCode = true;
        this.router.navigate(['/validate']);
      },
      (err) => {
        console.log(err);
        this.error = "Registration Error has occurred";
      }
    );
  }


}
