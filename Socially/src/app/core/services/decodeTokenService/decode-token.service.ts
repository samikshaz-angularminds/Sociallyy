import { inject, Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { tokenConstant } from '../../constants/token';
import { UserService } from '../userService/user.service';

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

  userService = inject(UserService)

  constructor() {
    this.initializeUserState()
  }

  saveToken(token: string) {
    localStorage.setItem(tokenConstant.LOGIN_TOKEN, token)
    this.userService.isUserLoggedIn = true
  }

  saveRefreshToken(token: string) {
    localStorage.setItem(tokenConstant.REFRESH_TOKEN, token)
    this.userService.isUserLoggedIn = true
  }

  getToken() {
    if (localStorage.getItem(tokenConstant.LOGIN_TOKEN)) return localStorage.getItem(tokenConstant.LOGIN_TOKEN)

    return null
  }

  getRefreshToken() {
    if (localStorage.getItem(tokenConstant.REFRESH_TOKEN)) return localStorage.getItem(tokenConstant.REFRESH_TOKEN)

    return null

  }

  clearToken() {
    localStorage.removeItem(tokenConstant.LOGIN_TOKEN)
    localStorage.removeItem(tokenConstant.REFRESH_TOKEN)
    this.userService.isUserLoggedIn = false
  }

  private decodeToken(token: string) {
    // return JwtDecode(token)
    return jwt_decode.jwtDecode(token) as CustomJwtPayload
  }

  initializeUserState() {
    const token = localStorage.getItem(tokenConstant.LOGIN_TOKEN)

    if (token) {




    }
  }


}
