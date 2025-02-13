import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserRegistrationComponent } from "./pages/user/user-registration/user-registration.component";
import { ApiService } from './core/services/apiServices/api.service';
import { apiConstant } from './core/constants/apiConstants';
import { UserHeaderComponent } from "./pages/user/user-header/user-header.component";
import { tokenConstant } from './core/constants/token';
import { UserService } from './core/services/userService/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Socially';
  loggedIn = false

  apiService = inject(ApiService)
  userService = inject(UserService)

  constructor(){
    // this.deleteRejectedRequests()
  }

  // deleteRejectedRequests(){
  //   this.apiService.delete(apiConstant.API_HOST_URL+apiConstant.DELETE_REJECTED_REQUESTS).subscribe({
  //     next : (res:any) => console.log('delete response: ',res),
  //     error : (error) => console.log(error)
  //   })
  // }

  
}
