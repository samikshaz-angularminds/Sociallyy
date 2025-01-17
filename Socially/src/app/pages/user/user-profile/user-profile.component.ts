import { ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { apiConstant } from '../../../core/constants/apiConstants';
import { ApiService } from '../../../core/services/apiServices/api.service';
import { UserService } from '../../../core/services/userService/user.service';
import { IUser } from '../../../core/models/user';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IPost } from '../../../core/models/post';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  @ViewChild('showOnePost') showOnePost !: ElementRef
  apiService = inject(ApiService)
  userService = inject(UserService)
  fb = inject(FormBuilder)
  changeRef = inject(ChangeDetectorRef)
  router = inject(Router)
  user !: IUser
  postForm !: FormGroup
  selectedFiles: File[] = []
  posts: IPost[] = []
  onePost !: IPost
  currentImageIndex = 0
  liked = { uname: '', post_id: '', isLiked: false }

  ngOnInit(): void {
    this.getUser()

  }

  getUser() {
    this.userService.user$.subscribe((res: any) => {
      this.getProfile(res._id)
      this.getAvailablePosts(res._id)
    })

  }

  getAvailablePosts(userid: string) {
    this.apiService.get(apiConstant.API_HOST_URL + apiConstant.SHOW_MY_POSTS + userid).subscribe({
      next: (res: any) => {
        console.log('AVAILABLE POSTS: ', res)
        this.posts = res
      },
      error: (error) => console.log(error)
    })
  }

  showPost(postId: string) {
    this.apiService.get(apiConstant.API_HOST_URL + apiConstant.SHOW_ONE_POST + postId).subscribe({
      next: (res: any) => {
        this.onePost = res

        // console.log('ONE POST: ', this.onePost);
        // console.log('LIKE OBJJ: ', this.liked);

        if (this.onePost.likes.includes(this.user.username)) {
          this.liked.uname = this.user.username
          this.liked.post_id = this.onePost._id
          this.liked.isLiked = true
        }

        const modalElement = this.showOnePost.nativeElement;
        const modalInstance = new Modal(modalElement);
        modalInstance.show();
      },
      error: (error) => console.log(error)
    })
  }

  nextImage() {
    if (this.onePost.media.length > 0 && this.currentImageIndex < this.onePost.media.length) {
      this.currentImageIndex++
    }
  }

  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--
    }
  }

  getProfile(userid: string) {
    this.apiService.get(apiConstant.API_HOST_URL + apiConstant.GET_ME + userid).subscribe({
      next: (res: any) => {
        // console.log(res);
        this.user = res

      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  updateProfilePicture(userid:string){
    // this.apiService.patch()
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

  deletePost(id: string) {
    this.apiService.delete(apiConstant.API_HOST_URL + apiConstant.DELETE_POST + id).subscribe({
      next: (res: any) => console.log('POST DELETED: ', res),
      error: (error) => console.log(error)
    })
  }
}
