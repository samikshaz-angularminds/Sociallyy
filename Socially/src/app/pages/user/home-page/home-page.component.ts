import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/apiServices/api.service';
import { UserService } from '../../../core/services/userService/user.service';
import { apiConstant } from '../../../core/constants/apiConstants';
import { Router, RouterModule } from '@angular/router';
import { IUser } from '../../../core/models/user';
import { AsyncPipe, CommonModule } from '@angular/common';
import { tap } from 'rxjs';
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


  ngOnInit(): void {
    this.getUser()
  }

  getUser() {
    this.userService.user$.subscribe((res: any) => {
      // console.log('USER FROM HOME PAGE: ', res);

      this.user = res
    })

    // console.log('USER HERE HOME PAGE: ', this.user);

    this.myFollowings(this.user.username).subscribe({
      next: () => this.getSuggestions(),
      error: (error) => console.log(error)
    })
  }

  myFollowings(username: string) {
    return this.apiService.get<IUser[]>(apiConstant.API_HOST_URL + apiConstant.SHOW_FOLLOWINGS + username).pipe(
      tap((res: IUser[]) => {
        // console.log('FOOOLLLLLLOOOWIIIIIINGGGS: ',res);
        this.followings = res

        res.forEach(user => {
          user.posts.forEach(post => {
            if (post.likes.includes(username)) {
              this.liked = {
                uname: username,
                post_id: post._id,
                isLiked: true
              }
            }
          });
        });

        this.followingNames = res.map((res: any) => res.username)
        // console.log('FOLLOWINGS FROM HOME PAGE: ', this.followingNames)
      })
    )
  }

  getSuggestions() {
    console.log('FOLLOW NAMESSSSS: ', this.followingNames);

    this.apiService.get<IUser[]>(apiConstant.API_HOST_URL + apiConstant.GET_USERS_EXCEPT_ME + this.user._id).subscribe({
      next: (res: IUser[]) => {
        // console.log('SUGGESTIONS: ', res);

        this.users = res.filter(res => !this.followingNames.includes(res.username))
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  seeUser(uname: string) {
    this.router.navigate(['seeProfile'], { queryParams: { username: uname, profile : this.user.username } })
  }

  sendRequest(name: string) {
    this.apiService.post(apiConstant.API_HOST_URL + apiConstant.SEND_REQUEST + name, { username: name }).subscribe({
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


  nextImg(){
    this.currentImageIndex++
  }

  prevImg(){
    this.currentImageIndex--
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


}
