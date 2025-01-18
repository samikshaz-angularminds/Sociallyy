import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from '../../../core/services/apiServices/api.service';
import { apiConstant } from '../../../core/constants/apiConstants';
import { IUser } from '../../../core/models/user';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterModule],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.css'
})
export class UserRegistrationComponent implements OnInit {

  fb = inject(FormBuilder)
  userRegistrationForm !: FormGroup
  selectedImage : File | null = null
  apiService = inject(ApiService)
  new_user !: IUser
  isPassword = true


  ngOnInit(): void {
    this.getRegistrationForm()
  }

  getRegistrationForm() {
    this.userRegistrationForm = this.fb.group({
      full_name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      phone: ['', [Validators.maxLength(10),Validators.minLength(10),Validators.pattern(/^\d{10}$/)]],
      website: '',
    })
  }

  togglePassword() {
    // console.log(type);
    this.isPassword = !this.isPassword
  }

  onFileSelect(event: Event) {
    console.log(event);
    console.log(event.target);

    const fileInput = event.target as HTMLInputElement

    
    if (fileInput.files?.length) {
      this.selectedImage = fileInput.files[0]
    }
    console.log( 'IMAGE: ',this.selectedImage);

  }


  isFile(file : File | null) : file is File{
    return file != null
  }

  onSubmit() {
    this.new_user = this.userRegistrationForm.value

    console.log('new-user:  ', this.new_user);


    const formData = new FormData()
    formData.append('full_name', this.new_user.full_name)
    formData.append('username', this.new_user.username)
    formData.append('email', this.new_user.email)
    formData.append('password', this.new_user.password)
    formData.append('bio', this.new_user.bio)
    formData.append('phone', this.new_user.phone)
    formData.append('website', this.new_user.website)
    formData.append('isVerified', String(this.new_user.isVerified))
    formData.append('isPrivate', String(this.new_user.isPrivate))
    formData.append('followers', String(this.new_user.followers))
    formData.append('followings', String(this.new_user.followings))
    formData.append('posts', String(this.new_user.posts))
    if(this.isFile(this.selectedImage)) formData.append('profilePhoto', this.selectedImage)

    for (const [key, value] of (formData as any).entries()) {
      console.log(`FORMDATA ${key}: ${value}`);
    }

    if (this.userRegistrationForm.valid) {
      console.log(this.userRegistrationForm.value);

      this.apiService.post(apiConstant.API_HOST_URL + apiConstant.USER_REGISTRATION, formData).subscribe({
        next: (res: any) => {
          console.log(res);
          this.getRegistrationForm()
          this.selectedImage 

          // this.ngOnInit()
        },
        error: (error) => {
          console.log(error);

        }
      })

    }
  }
}
