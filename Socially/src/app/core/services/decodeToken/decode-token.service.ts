import { inject, Injectable } from '@angular/core';
import { ApiService } from '../apiServices/api.service';
import { apiConstant } from '../../constants/apiConstants';
import { UserService } from '../userService/user.service';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DecodeTokenService {
  apiService = inject(ApiService)
  userService = inject(UserService)

  constructor() {

  }

  async decodeToken(loginToken: string) {

    console.log('TOKEN IN SERVICE: ', loginToken);

    if (!loginToken) return of(null)

    const [header, payload] = loginToken.split('.')

    const decodePayload = atob(payload)
    console.log('DECODE PAYLOAD: ', decodePayload);

    const parsedPayload = JSON.parse(decodePayload)
    console.log('PARSED PAYLOAD: ', parsedPayload);

    const response = this.getLoggedInUser(parsedPayload._id)

    return response


  }

  getLoggedInUser(id: string) {
    console.log('FETCHING USER WITH ID:::::: ', id);

    return this.apiService.get(apiConstant.API_HOST_URL + apiConstant.GET_ME + id).
      pipe(
        catchError((error: any) => {
          console.log(error)
          return of(null);
        })
      )
  }
}
