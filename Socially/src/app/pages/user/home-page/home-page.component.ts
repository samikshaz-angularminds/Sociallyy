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
  currentImageIndex = 0
  pendingRequestsToUsers: string[] = []
  likerss: IUser[] = []


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
    // forkJoin({
    //   suggestions: this.apiService.get<IUser[]>(apiConstant.API_HOST_URL + apiConstant.GET_USERS_EXCEPT_ME + this.user._id),
    //   pendingRequest: this.apiService.get(apiConstant.API_HOST_URL + apiConstant.PENDING_REQUESTS + this.user.id),
    //   followings: this.apiService.get(apiConstant.API_HOST_URL + apiConstant.SHOW_FOLLOWINGS + this.user.id)
    // }).subscribe({
    //   next: (res: any) => {
    //     const { suggestions, pendingRequest, followings } = res
    //     console.log('suggestions:: ', suggestions);
    //     console.log('pendingRequest:: ', pendingRequest);
    //     console.log('followings:: ', followings);

    //     const pendingRequestNames = pendingRequest.map((request: any) => request.toUser)
    //     const followingNames = followings.map((user: any) => user.username)

    //     this.users = suggestions.filter((res: any) => !followingNames.includes(res.username) && !pendingRequestNames.includes(res.username))

    //     console.log('SUGGESTED USERS ARE: ', this.users);

    //   },
    //   error: (error) => {
    //     console.log(error)
    //   }
    // })

    this.apiService.get(apiConstant.API_HOST_URL + apiConstant.SUGGESTIONS + this.user.id).subscribe({
      next: (res: any) => {
        console.log('sugg: ', res);
        this.users = res
      },
      error: (error) => console.log(error)

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

  seeUser(uid: string) {
    this.router.navigate(['seeProfile'], { queryParams: { uid: uid, viewerUid: this.user.id } })
  }

  sendRequest(myUid: string) {
    console.log('myid: ', this.user.id);
    console.log('others id: ', myUid);

    this.apiService.post(apiConstant.API_HOST_URL + apiConstant.SEND_REQUEST + this.user.id, { myUid }).subscribe({
      next: (res: any) => {
        console.log('REQUEST SENT BY ME: ', res);
        this.reqsent[myUid] = true
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
        this.followingsOfUser(this.user.id)
      },
      error: (error) => console.log(error)

    })
  }

  getPostLikes(postid: string) {
    console.log(apiConstant.API_HOST_URL + apiConstant.POST_LIKESS + postid);

    this.apiService.get(apiConstant.API_HOST_URL + apiConstant.POST_LIKESS + postid).subscribe({
      next: (res: any) => {
        console.log('likesss: ', res);
        this.likerss = res

      },
      error: (error) => console.log(error)
    })
  }


  likeToggle(post: IPost, username: string) {

    if (post.likes.includes(username)) this.unlikeAPost(post, username)
    else this.likeAPost(post, username)

    this.changeRef.detectChanges()
  }

  likeAPost(post: IPost, liker: string) {
    console.log('POST ID: ', post._id);

    this.apiService.patch(apiConstant.API_HOST_URL + apiConstant.LIKE_POST + post._id, { liker: liker }).subscribe({
      next: (res: any) => this.getMe(this.user._id),
      error: (error) => console.log(error)
    })
  }

  unlikeAPost(post: IPost, unliker: string) {
    this.apiService.patch(apiConstant.API_HOST_URL + apiConstant.UNLIKE_POST + post._id, { unliker: unliker }).subscribe({
      next: (res: any) => {
        this.getMe(this.user._id)

      },
      error: (error) => console.log(error)
    })
  }

  followingsOfUser(myUid: string) {
    this.apiService.get(apiConstant.API_HOST_URL + apiConstant.SHOW_FOLLOWINGS + myUid).subscribe({
      next: (res: any) => {
        console.log('followingss: ', res);
        this.followings = res

      },
      error: (error) => console.log(error)

    })
  }


}
