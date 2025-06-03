import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from "@angular/core";
import { apiConstant } from "../../../core/constants/apiConstants";
import { ApiService } from "../../../core/services/apiServices/api.service";
import { IUser } from "../../../core/models/user";
import { Router, RouterModule } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
} from "@angular/forms";
import { IPost } from "../../../core/models/post";

import Swal from "sweetalert2";
import { CommonModule } from "@angular/common";
import { UserService } from "../../../core/services/userService/user.service";

@Component({
  selector: "app-user-profile",
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: "./user-profile.component.html",
  styleUrl: "./user-profile.component.css",
})
export class UserProfileComponent {
  @ViewChild("showOnePost") showOnePost!: ElementRef;
  apiService = inject(ApiService);
  // userService = inject(UserService);
  fb = inject(FormBuilder);
  changeRef = inject(ChangeDetectorRef);
  router = inject(Router);
  user!: IUser;
  postForm!: FormGroup;
  selectedFiles: File[] = [];
  posts: IPost[] = [];
  onePost!: IPost;
  currentImageIndex = 0;
  likerss: IUser[] = [];

  updatedImage: File | null = null;
  updatingUser!: IUser;

  ngOnInit(): void {
    // this.getUser()
    // console.log("in ngoninit user--- ", this.userService.user);

    // this.getProfile(this.userService.user?._id);
  }

  getUser() {
    // this.userService.user$.subscribe((res: any) => {
    //   console.log("USER HERE IS: ", res);

    //   this.getProfile(res?._id);
    //   this.getAvailablePosts(res?._id);
    // });
  }

  downloadProfilePic(url: string) {
    // const url1 = new URL(url)
    // const filename = url1.pathname.split("/")
    // const download = filename[filename.length - 1]
    // const contentType = filename[2];
    // console.log('type: ', contentType);
    // console.log(filename[filename.length - 1]);

    this.apiService
      .get(
        `${apiConstant.API_HOST_URL}${apiConstant.DOWNLOAD_PROFILE_PIC}?fileUrl=${url}`,
      )
      .subscribe({
        next: (res: any) => {
          console.log(res);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  getAvailablePosts(userid: string) {
    this.apiService
      .get(apiConstant.API_HOST_URL + apiConstant.SHOW_MY_POSTS + userid)
      .subscribe({
        next: (res: any) => {
          console.log("AVAILABLE POSTS: ", res);
          this.posts = res;
        },
        error: (error) => console.log(error),
      });
  }

  showPost(postId: string) {
    this.apiService
      .get(apiConstant.API_HOST_URL + apiConstant.SHOW_ONE_POST + postId)
      .subscribe({
        next: (res: any) => {
          this.onePost = res;
          // Modal functionality can be implemented with Tailwind CSS and Angular
          // For now, we'll use a simple show/hide approach
          this.showOnePost.nativeElement.classList.remove("hidden");
        },
        error: (error) => console.log(error),
      });
  }

  nextImage() {
    if (
      this.onePost.media.length > 0 &&
      this.currentImageIndex < this.onePost.media.length
    ) {
      this.currentImageIndex++;
    }
  }

  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  getProfile(userid: string | undefined) {
    console.log("user id while fetching profile: ", userid);

    this.apiService
      .get(apiConstant.API_HOST_URL + apiConstant.GET_ME + userid)
      .subscribe({
        next: (res: any) => {
          this.user = res;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  updateUser(user: IUser) {
    this.updatingUser = user;
  }

  finallyUpdateUser(userUpdateForm: NgForm) {
    const formValue = userUpdateForm.value;
    console.log("BIO: ", formValue.bio);

    const formData = new FormData();

    formData.append("full_name", formValue.full_name);
    formData.append("username", formValue.username);
    formData.append("email", formValue.email);
    formData.append("password", formValue.password);
    formData.append("bio", formValue.bio);
    formData.append("phone", formValue.phone);
    formData.append("website", formValue.website);
    formData.append("isVerified", String(formValue.isVerified));
    formData.append("isPrivate", String(formValue.isPrivate));
    formData.append("followers", String(formValue.followers));
    formData.append("followings", String(formValue.followings));
    formData.append("posts", String(formValue.posts));

    console.log("form: ", userUpdateForm);
    console.log("form value: ", userUpdateForm.value);

    for (const [key, value] of (formData as any).entries()) {
      console.log(`FORMDATA ${key}: ${value}`);
    }

    this.apiService
      .patch(
        apiConstant.API_HOST_URL + apiConstant.UPDATE_USER + this.user._id,
        formValue,
      )
      .subscribe({
        next: (res: any) => {
          console.log("UPDATED USER: ", res);
          this.getProfile(this.user._id);
        },
        error: (error) => console.log(error),
      });
  }

  onFileSelect(event: Event) {
    const selectedFile = event.target as HTMLInputElement;
    console.log(selectedFile.value);

    if (selectedFile.files?.length) {
      this.updatedImage = selectedFile.files[0];
    }
  }

  isFile(file: File | null): file is File {
    return file != null;
  }

  updateProfilePicture(userid: string) {
    const formData = new FormData();

    if (this.isFile(this.updatedImage))
      formData.append("profilePhoto", this.updatedImage);
    this.apiService
      .patch(
        apiConstant.API_HOST_URL + apiConstant.UPDATE_PROFILE_PICTURE + userid,
        formData,
      )
      .subscribe({
        next: (res: any) => {
          console.log("UPDATED: ", res);
          this.getProfile(userid);
        },
        error: (error) => console.log(error),
      });
  }

  prevImg() {
    this.currentImageIndex -= 1;
  }

  nextImg() {
    this.currentImageIndex += 1;
  }

  getPostLikes(postid: string) {
    console.log(apiConstant.API_HOST_URL + apiConstant.POST_LIKESS + postid);

    this.apiService
      .get(apiConstant.API_HOST_URL + apiConstant.POST_LIKESS + postid)
      .subscribe({
        next: (res: any) => {
          console.log("likesss: ", res);
          this.likerss = res;
        },
        error: (error) => console.log(error),
      });
  }

  likeToggle(post: IPost, username: string) {
    if (post.likes.includes(username)) this.unlikeAPost(post, username);
    else this.likeAPost(post, username);
  }

  likeAPost(post: IPost, liker: string) {
    console.log("POST ID: ", post._id);

    this.apiService
      .patch(apiConstant.API_HOST_URL + apiConstant.LIKE_POST + post._id, {
        liker: liker,
      })
      .subscribe({
        next: (res: any) => {
          this.getAvailablePosts(post.accountHolderId);
          this.changeRef.detectChanges();
        },
        error: (error) => console.log(error),
      });
  }

  unlikeAPost(post: IPost, unliker: string) {
    this.apiService
      .patch(apiConstant.API_HOST_URL + apiConstant.UNLIKE_POST + post._id, {
        unliker: unliker,
      })
      .subscribe({
        next: (res: any) => {
          this.getAvailablePosts(post.accountHolderId);
          this.changeRef.detectChanges();
        },
        error: (error) => console.log(error),
      });
  }

  async deletePost(id: string) {
    const confirmDelete = await Swal.fire({
      title: "Do you want to delete this post?",
      confirmButtonText: "Yes",
      showCancelButton: true,
      cancelButtonText: "No",
    });

    if (confirmDelete.isConfirmed) {
      this.apiService
        .delete(apiConstant.API_HOST_URL + apiConstant.DELETE_POST + id)
        .subscribe({
          next: (res: any) => console.log("POST DELETED: ", res),
          error: (error) => console.log(error),
        });
    }
  }
}
