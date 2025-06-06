import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { ApiService } from "../../../core/services/apiServices/api.service";
import { apiConstant } from "../../../core/constants/apiConstants";
import { IUser } from "../../../core/models/user";
import { IPost } from "../../../core/models/post";

import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { UserService } from "../../../core/services/userService/user.service";

@Component({
  selector: "app-another-user",
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: "./another-user.component.html",
  styleUrl: "./another-user.component.css",
})
export class AnotherUserComponent implements OnInit {
  @ViewChild("showOnePost") showOnePost!: ElementRef;
  route = inject(ActivatedRoute);
  apiService = inject(ApiService);
  // userService = inject(UserService);
  cdr = inject(ChangeDetectorRef);
  username = "";
  user!: IUser;
  loggedInUser!: IUser;
  posts: IPost[] = [];
  onePost!: IPost;
  currentImageIndex = 0;
  reqsent: { [key: string]: boolean } = {};
  queryParamsSubject!: Subscription;
  isFollowing = false;
  queryparams = { uid: "", viewerUid: "" };

  ngOnInit(): void {
    this.queryParamsSubject = this.route.queryParams.subscribe(
      (params: any) => {
        const newUserName = params["uid"];
        const viewer = params["viewerUid"];

        // console.log('JYACHI PROFILE BAGHAT AAHE: '+newUserName+'LOGGEDIN: ',viewer);

        this.queryparams = {
          uid: newUserName,
          viewerUid: viewer,
        };

        if (newUserName !== this.username) {
          this.username = newUserName;
          this.getLoggedInUser();
        }
      },
    );
  }

  getUser() {
    // console.log('QUERYPARAMS: ',this.queryparams);

    console.log(
      apiConstant.API_HOST_URL +
        apiConstant.SHOW_ANOTHER_USER +
        `?uid=${this.queryparams.uid}&viewerId=${this.loggedInUser.id}`,
    );

    this.apiService
      .get<IUser>(
        apiConstant.API_HOST_URL +
          apiConstant.SHOW_ANOTHER_USER +
          `?uid=${this.queryparams.uid}&viewerId=${this.loggedInUser?.id}`,
      )
      .subscribe({
        next: (res: IUser) => {
          // console.log('ANOTHER USER: ', res);

          this.user = res;
          if (res.isPrivate === false) this.posts = res.posts;
        },
        error: (error) => console.log(error),
      });
  }

  getLoggedInUser() {
    // this.userService.user$.subscribe((res: any) => {
    //   this.loggedInUser = res;
    //   this.getUser();
    // });
    // console.log('LOGGED IN USER: ', this.loggedInUser);
    this.loggedInUserFollowing();
  }

  loggedInUserFollowing() {
    this.apiService
      .get<
        IUser[]
      >(apiConstant.API_HOST_URL + apiConstant.SHOW_FOLLOWINGS + this.loggedInUser.id)
      .subscribe({
        next: (res: IUser[]) => {
          // console.log(`FOLLOWING OF ${this.loggedInUser.username}: `,res);
          // console.log(`ANOTHER USER IS ${this.user.username}`);

          const followingNames = res.map((user) => user.id);
          // console.log('GGGGGGGG');

          // console.log('ONLY NAMES: ',followingNames);

          if (followingNames.includes(this.loggedInUser.id))
            this.isFollowing = true;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  sendRequest(name: string) {
    this.apiService
      .post(
        apiConstant.API_HOST_URL +
          apiConstant.SEND_REQUEST +
          this.loggedInUser.username,
        { username: name },
      )
      .subscribe({
        next: (res: any) => {
          console.log("REQUEST SENT BY ME: ", res);
          this.reqsent[name] = true;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  showPost(postId: string) {
    this.apiService
      .get(apiConstant.API_HOST_URL + apiConstant.SHOW_ONE_POST + postId)
      .subscribe({
        next: (res: any) => {
          this.onePost = res;

          console.log("ONE POST: ", this.onePost);

          // Modal functionality can be implemented with Tailwind CSS and Angular
          // For now, we'll use a simple show/hide approach
          this.showOnePost.nativeElement.classList.remove("hidden");
        },
        error: (error) => console.log(error),
      });
  }

  nextImage() {
    if (
      this.onePost.media != null &&
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

  likeAPost(post: IPost) {
    this.apiService
      .patch(apiConstant.API_HOST_URL + apiConstant.LIKE_POST + post._id, {
        liker: this.loggedInUser.username,
      })
      .subscribe({
        next: (res: any) => console.log("LIKED BY ", res),
        error: (error) => console.log(error),
      });
  }

  unlikeAPost(post: IPost) {}

  ngOnDestroy() {
    if (this.queryParamsSubject) {
      this.queryParamsSubject.unsubscribe();
    }
  }
}
