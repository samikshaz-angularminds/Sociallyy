import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/apiServices/api.service';
import { UserService } from '../../../core/services/userService/user.service';
import { apiConstant } from '../../../core/constants/apiConstants';
import { Router, RouterModule } from '@angular/router';
import { IUser } from '../../../core/models/user';
import { AsyncPipe, CommonModule } from '@angular/common';
import { forkJoin, map, tap } from 'rxjs';
import { tokenConstant } from '../../../core/constants/token';
import { IPost } from '../../../core/models/post';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {

  apiService = inject(ApiService)
  userService = inject(UserService)
  changeRef = inject(ChangeDetectorRef)
  router = inject(Router)
  user !: IUser
  users !: IUser[]
  reqsent: { [key: string]: boolean } = {}
  followingNames: string[] = []
  followings: IUser[] = []
  liked = { uname: '', post_id: '', isLiked: false }
  currentImageIndex = 0
  pendingRequestsToUsers: string[] = []


  ngOnInit(): void {
    this.getUser()
  }

  getUser() {
    this.userService.user$.subscribe((res: any) => {
      console.log();

      this.getMe(res._id)


    })
  }

  getSuggestions() {
    forkJoin({
      suggestions: this.apiService.get<IUser[]>(apiConstant.API_HOST_URL + apiConstant.GET_USERS_EXCEPT_ME + this.user._id),
      pendingRequest: this.apiService.get(apiConstant.API_HOST_URL + apiConstant.PENDING_REQUESTS + this.user.username),
      followings: this.apiService.get(apiConstant.API_HOST_URL + apiConstant.SHOW_FOLLOWINGS + this.user.username)
    }).subscribe({
      next: (res: any) => {
        const { suggestions, pendingRequest, followings } = res
        console.log('suggestions:: ', suggestions);
        console.log('pendingRequest:: ', pendingRequest);
        console.log('followings:: ', followings);

        const pendingRequestNames = pendingRequest.map((request: any) => request.toUser)
        const followingNames = followings.map((user: any) => user.username)

        this.users = suggestions.filter((res: any) => !followingNames.includes(res.username) && !pendingRequestNames.includes(res.username))

        console.log('SUGGESTED USERS ARE: ', this.users);

      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  myPendingRequests() {
    return this.apiService.get(apiConstant.API_HOST_URL + apiConstant.PENDING_REQUESTS + this.user.username).pipe(
      map((res: any) => {
        console.log('response of requests: ', res);
        return res.map((r: any) => r.username)
      })
    )
  }

  seeUser(uname: string) {
    this.router.navigate(['seeProfile'], { queryParams: { username: uname, profile: this.user.username } })
  }

  sendRequest(name: string) {
    this.apiService.post(apiConstant.API_HOST_URL + apiConstant.SEND_REQUEST + this.user.username, { username: name }).subscribe({
      next: (res: any) => {
        console.log('REQUEST SENT BY ME: ', res);
        this.reqsent[name] = true
        this.getSuggestions()
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  nextImg() {
    this.currentImageIndex++
  }

  prevImg() {
    this.currentImageIndex--
  }

  getMe(userid: string) {
    this.apiService.get(apiConstant.API_HOST_URL + apiConstant.GET_ME + userid).subscribe({
      next: (res: any) => {
        this.user = res
        this.getSuggestions()
        this.followingsOfUser(this.user.username)
      },
      error: (error) => console.log(error)

    })
  }

  likeToggle(post: IPost, username: string, liked: boolean) {

    console.log('LIKED? ', liked);

    if (liked) this.unlikeAPost(post, username)
    else this.likeAPost(post, username)

    this.changeRef.detectChanges()
  }

  likeAPost(post: IPost, liker: string) {
    console.log('POST ID: ', post._id);

    this.apiService.patch(apiConstant.API_HOST_URL + apiConstant.LIKE_POST + post._id, { liker: liker }).subscribe({
      next: (res: any) => console.log('LIKED A POST: ', res),
      error: (error) => console.log(error)
    })
  }

  unlikeAPost(post: IPost, unliker: string) {
    this.apiService.patch(apiConstant.API_HOST_URL + apiConstant.UNLIKE_POST + post._id, { unliker: unliker }).subscribe({
      next: (res: any) => {
        console.log('UNLIKED A POST: ', res)
        this.liked = {
          post_id: post._id,
          isLiked: false,
          uname: unliker
        }
      },
      error: (error) => console.log(error)
    })
  }

  followingsOfUser(username: string) {
    this.apiService.get(apiConstant.API_HOST_URL + apiConstant.SHOW_FOLLOWINGS + username).subscribe({
      next: (res: any) => {
        console.log('followingss: ', res);
        this.followings = res

      },
      error: (error) => console.log(error)

    })
  }


}
