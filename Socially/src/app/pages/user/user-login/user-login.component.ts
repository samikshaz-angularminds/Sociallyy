import { Component, inject, OnInit } from '@angular/core';
import { IUserLogin } from '../../../core/models/user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/apiServices/api.service';
import { apiConstant } from '../../../core/constants/apiConstants';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { tokenConstant } from '../../../core/constants/token';
import { DecodeTokenService } from '../../../core/services/decodeTokenService/decode-token.service';
import { UserService } from '../../../core/services/userService/user.service';

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
  decodeTokenService = inject(DecodeTokenService)
  userService = inject(UserService);
  isPassword = true
  loginError = ''

  loginObject = {
    username: '',
    email: '',
    password: ''
  }


  ngOnInit(): void {
    this.getLoginForm()
  }

  getLoginForm() {
    this.loginForm = this.fb.group({
      emailorusername : ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.apiService.post(apiConstant.API_HOST_URL + apiConstant.USER_LOGIN, this.loginForm.value).subscribe({
        next: (res: any) => {
          if(res){
            this.decodeTokenService.saveToken(res.token)

            this.userService.setUser(res.user)
            this.decodeTokenService.saveRefreshToken(res.user.refreshToken)
            this.router.navigate(['/user/home'])
          }
          else{
            alert('Need correct details')
          }
        },
        error: (error) => {
          this.loginError = error
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
