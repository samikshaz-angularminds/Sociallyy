import { inject, Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { tokenConstant } from '../../constants/token';
// import { UserService } from '../userService/user.service';
import { ApiService } from '../apiServices/api.service';
import { apiConstant } from '../../constants/apiConstants';
import { IUser } from '../../models/user';

export interface CustomJwtPayload extends jwt_decode.JwtPayload {
  _id: string
  id: string
  email: string
  username: string
}

@Injectable({
  providedIn: 'root'
})
export class DecodeTokenService {

  // userService = inject(UserService)
  isUserLoggedIn = false
  apiService = inject(ApiService);
  user !: IUser;
  user$ : Observable<IUser | null> = of(null);

  constructor() {
    
  }
  
  ngOnInit():void{
    this.user$ = this.initializeUserState()
    this.user$.subscribe((res) => console.log("res of user$=> ",res));

  }

  saveToken(token: string) {
    localStorage.setItem(tokenConstant.LOGIN_TOKEN, token)
    // this.userService.isUserLoggedIn = true
  }

  saveRefreshToken(token: string) {
    localStorage.setItem(tokenConstant.REFRESH_TOKEN, token)
    // this.userService.isUserLoggedIn = true
  }

  getToken() {
    if (localStorage.getItem(tokenConstant.LOGIN_TOKEN)) {
      return localStorage.getItem(tokenConstant.LOGIN_TOKEN)
    }

    return null
  }

  getRefreshToken() {
    if (localStorage.getItem(tokenConstant.REFRESH_TOKEN)) return localStorage.getItem(tokenConstant.REFRESH_TOKEN)

    return null

  }

  clearToken() {
    localStorage.removeItem(tokenConstant.LOGIN_TOKEN)
    localStorage.removeItem(tokenConstant.REFRESH_TOKEN)
    // this.userService.isUserLoggedIn = false
  }

  private decodeToken(token: string) {
    // return JwtDecode(token)
    return jwt_decode.jwtDecode(token) as CustomJwtPayload
  }

  getMe(userid: string) {
    // console.log("hi from getmeeeeeeeee ",userid);
    let wholeUser !: IUser;

    return this.apiService.get<IUser>(apiConstant.API_HOST_URL + apiConstant.GET_ME + userid)
  }

  initializeUserState(): Observable<IUser | null>  {
    const token = localStorage.getItem(tokenConstant.LOGIN_TOKEN)

    if (token) {
      const decodedToken = this.decodeToken(token)
      this.isUserLoggedIn = true
      const u: CustomJwtPayload = {
        _id: decodedToken._id,
        email: decodedToken.email,
        username: decodedToken.username,
        id: decodedToken.id,
      }


      return this.getMe(u._id).pipe(
        tap((user:IUser) => {
          console.log("tap tap tap-- ",user);
          
          this.user = user})
      )
      
    }
    return of(null);
  }
}