import { inject, Injectable } from '@angular/core';
import { IUser } from '../../models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { tokenConstant } from '../../constants/token';
import * as jwt_decode from 'jwt-decode';
import { ApiService } from '../apiServices/api.service';
import { apiConstant } from '../../constants/apiConstants';
import { Router } from '@angular/router';

interface CustomJwtPayload extends jwt_decode.JwtPayload {
  _id: string;
  email: string;
  username : string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user !: IUser
  private userSubject = new BehaviorSubject<CustomJwtPayload | undefined>(undefined)
  isUserLoggedIn = false
router = inject(Router)


  constructor(){
    this.initializeUserState()
  }

  setUser(user: CustomJwtPayload) {
    this.userSubject.next(user)
    this.isUserLoggedIn = true
  }

  get user$(): Observable<CustomJwtPayload | undefined> {
    return this.userSubject.asObservable()
  }

  saveToken(token: string) {
    localStorage.setItem(tokenConstant.LOGIN_TOKEN, token)

  }

  clearToken() {
    localStorage.removeItem(tokenConstant.LOGIN_TOKEN)
    this.isUserLoggedIn = false
  }


  private decodeToken(token: string) {
    // return JwtDecode(token)
    return jwt_decode.jwtDecode(token) as CustomJwtPayload
  }

  initializeUserState() {
    const token = localStorage.getItem(tokenConstant.LOGIN_TOKEN)

    if (token) {
      const decodedToken = this.decodeToken(token)
      const user: CustomJwtPayload = {
        _id: decodedToken._id,
        email: decodedToken.email,
        username: decodedToken.username
      }

      this.setUser(user)
      this.isUserLoggedIn = true
    }
    
  }
  

}
