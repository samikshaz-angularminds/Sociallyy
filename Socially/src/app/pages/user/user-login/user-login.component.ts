import { Component, inject, OnInit } from '@angular/core';
import { IUserLogin } from '../../../core/models/user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/apiServices/api.service';
import { apiConstant } from '../../../core/constants/apiConstants';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/userService/user.service';
import { tokenConstant } from '../../../core/constants/token';
import { DecodeTokenService } from '../../../core/services/decodeToken/decode-token.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent implements OnInit {

  loginObj !: IUserLogin
  fb = inject(FormBuilder)
  loginForm !: FormGroup
  apiService = inject(ApiService)
  router = inject(Router)
  userService = inject(UserService)
  decodingService = inject(DecodeTokenService)
  isPassword = true


  ngOnInit(): void {
    this.getLoginForm()
  }

  getLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.apiService.post(apiConstant.API_HOST_URL + apiConstant.USER_LOGIN, this.loginForm.value).subscribe({
        next: (res: any) => {

          if(res){
            this.userService.saveToken(res.token)
            this.userService.setUser(res.user)
            this.router.navigate(['/user/home'])
          }
          else{
            alert('Need correct details')
          }


        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  togglePassword() {
    // console.log(type);
    this.isPassword = !this.isPassword
  }

}
