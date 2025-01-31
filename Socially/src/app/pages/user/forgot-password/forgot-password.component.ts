import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../../core/services/apiServices/api.service';
import { apiConstant } from '../../../core/constants/apiConstants';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email = ''
  apiService = inject(ApiService)

  onSend(email: string) {
    console.log('email: ', email);

    this.apiService.post(apiConstant.API_HOST_URL + apiConstant.FORGOT_PASSWORD, { email }).subscribe({
      next: (res: any) => {
        console.log(res);

      },
      error: (error) => console.log(error)

    })

  }

}
