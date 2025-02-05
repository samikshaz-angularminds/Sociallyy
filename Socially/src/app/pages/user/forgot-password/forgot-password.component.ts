import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../../core/services/apiServices/api.service';
import { apiConstant } from '../../../core/constants/apiConstants';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/userService/user.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email = ''
  otp = ''
  apiService = inject(ApiService)
  emailSent = false
  router = inject(Router);
  userService = inject(UserService);
  loading = false

  onSend(email: string) {
    console.log('email: ', email);

    this.apiService.post(apiConstant.API_HOST_URL + apiConstant.SEND_OTP, { email }).subscribe({
      next: (res: any) => {
        if (res) {
          console.log(res);
          this.emailSent = true
        }
      },
      error: (error) => console.log(error)
    })

  }

  onVerify(otp: string) {
    this.apiService.post(apiConstant.API_HOST_URL + apiConstant.VERIFY_OTP, { email: this.email, otp }).subscribe({
      next: (res: any) => {
        console.log('RESPONSE AFTER VERIFICATION-- ', res);
        if (res) {
          this.loading = true 
          setTimeout(()=>{
            this.loading = false;
            this.userService.saveToken(res.token)
            this.userService.setUser(res.user)
            this.router.navigate(['/user/home']);
          },1000)
        }
      },
      error: (error) => console.log(error)


    })
  }

}
