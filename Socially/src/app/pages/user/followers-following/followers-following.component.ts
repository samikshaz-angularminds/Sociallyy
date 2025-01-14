import { Component, inject, Input, OnChanges, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/apiServices/api.service';
import { apiConstant } from '../../../core/constants/apiConstants';
import { IUser } from '../../../core/models/user';
import { UserService } from '../../../core/services/userService/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-followers-following',
  standalone: true,
  imports: [],
  templateUrl: './followers-following.component.html',
  styleUrl: './followers-following.component.css'
})
export class FollowersFollowingComponent implements OnInit {

  selectedElement: string = ''
  apiService = inject(ApiService)
  userService = inject(UserService)
  route = inject(ActivatedRoute)
  accountHolder !: string
  anotherUser !: string
  user !: IUser
  router = inject(Router)

  followers: IUser[] = []
  followings: IUser[] = []


  ngOnInit(): void {
    this.selectedElement = this.route.snapshot.paramMap.get('element')!
    this.accountHolder = this.route.snapshot.queryParams['user']
    this.anotherUser = this.route.snapshot.queryParams['username']

    if (this.selectedElement !== undefined) this.getUser(this.selectedElement)
    if (this.anotherUser !== undefined) this.getUser(this.selectedElement, this.anotherUser)

    console.log('SELECTED ELEMENT: ', this.selectedElement);
    console.log('ACCOUNT HOLDER: ', this.accountHolder);
    console.log('ANOTHER USER: ', this.anotherUser);



  }

  seeUser(uname: string) {
    this.router.navigate(['seeProfile'], { queryParams: { username: uname, profile:this.user.username } })
  }

  getUser(element: string, username?: string) {
    this.userService.user$.subscribe((response: any) => this.user = response)

    console.log('ELEMENT: ',element);
    console.log('USERNAME: ',username);
    
    
    console.log('USER IS: ', this.user);

    if (username && element === 'followers') this.getFollowers(username)
    if (username && element === 'followings') this.getFollowings(username)


    if(element === 'followers') this.getFollowers(this.user.username)
    if(element === 'followings') this.getFollowings(this.user.username)

  }

  getFollowers(uname: string) {
    console.log('URL:: ',apiConstant.API_HOST_URL+apiConstant.SHOW_FOLLOWERS+uname);

    this.apiService.get(apiConstant.API_HOST_URL + apiConstant.SHOW_FOLLOWERS + uname).subscribe({
      next: (res: any) => {
        if (res) console.log('FOLLOWERS', res)

        this.followers = res
      },
      error: (error) => console.log(error)
    })
  }

  getFollowings(uname: string) {
    console.log('URL:: ',apiConstant.API_HOST_URL+apiConstant.SHOW_FOLLOWINGS+uname);
    
    this.apiService.get(apiConstant.API_HOST_URL + apiConstant.SHOW_FOLLOWINGS + uname).subscribe({
      next: (res: any) => {
        console.log('FOLLOWING: ', res)

        this.followings = res
      },
      error: (error) => console.log(error)
    })
  }

  removeFollower(uname: string) {
    this.apiService.delete(apiConstant.API_HOST_URL + apiConstant.REMOVE_FOLLOWER + this.user.username, '', { username: uname }).subscribe({
      next: (res: any) => {
        console.log('REMOVED A FOLLOWER: ', res)
        this.getFollowers(uname)
      },
      error: (error) => console.log(error)
    })
  }

  removeFollowing(uname: string) {
    this.apiService.delete(apiConstant.API_HOST_URL + apiConstant.REMOVE_FOLLOWING + this.user.username, '', { username: uname }).subscribe({
      next: (res: any) => {
        console.log('REMOVED FROM FOLLOWING: ', res)
        this.getFollowings(uname)
      },
      error: (error) => console.log(error)
    })
  }

}
