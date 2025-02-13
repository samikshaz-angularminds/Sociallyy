import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tokenConstant } from '../../constants/token';
import { ApiService } from '../apiServices/api.service';
import { apiConstant } from '../../constants/apiConstants';
import { CustomJwtPayload, DecodeTokenService } from '../decodeTokenService/decode-token.service';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private userSubject = new BehaviorSubject<CustomJwtPayload | undefined>(undefined)
  isUserLoggedIn = false
  apiService = inject(ApiService);


  constructor() {}

  private decodeToken(token: string) {
    // return JwtDecode(token)
    return jwt_decode.jwtDecode(token) as CustomJwtPayload
  }

  initializeUserState() {
    const token = localStorage.getItem(tokenConstant.LOGIN_TOKEN)

    if (token) {
      const decodedToken = this.decodeToken(token)
      console.log('the decoded token is...', decodedToken);
      this.isUserLoggedIn = true
      const user: CustomJwtPayload = {
        _id: decodedToken._id,
        email: decodedToken.email,
        username: decodedToken.username,
        id: decodedToken.id,
      }

      console.log("initialize user state---  ",user);
      
      this.getMe(user._id)

      return user;
    }
    return null;
  }


  getMe(userid: string) {
    console.log("hi from getmeeeeeeeee ",userid);
    
    this.apiService.get(apiConstant.API_HOST_URL + apiConstant.GET_ME + userid).subscribe({
      next: (res: any) => {
        console.log('response for get user: ', res);

      },
      error: (error) => console.log(error)

    })
  }

  

  get user$(): Observable<CustomJwtPayload | undefined> {
    return this.userSubject.asObservable()
  }

  setUser(user: CustomJwtPayload) {
    console.log('SETUSER: ', user);

    this.userSubject.next(user)
  }






}
