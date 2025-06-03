import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserHeaderComponent } from "./pages/user/user-header/user-header.component";
import { DecodeTokenService } from './core/services/decodeTokenService/decode-token.service';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserHeaderComponent,AsyncPipe, JsonPipe,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Socially';

  // apiService = inject(ApiService)
  // tokenService = inject(DecodeTokenService);

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
