import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/authGuard/auth.guard";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "account/login",
    pathMatch: "full",
  },
  {
    path: "account",
    children: [
      {
        path: "login",
        loadComponent: () =>
          import("./pages/user/user-login/user-login.component").then(
            (m) => m.UserLoginComponent,
          ),
      },
      {
        path: "register",
        loadComponent: () =>
          import(
            "./pages/user/user-registration/user-registration.component"
          ).then((m) => m.UserRegistrationComponent),
      },
      {
        path: "**",
        loadComponent: () =>
          import("./pages/page-not-found/page-not-found.component").then(
            (m) => m.PageNotFoundComponent,
          ),
      },
    ],
  },
  {
    path: "user",
    canActivateChild: [authGuard],
    children: [
      {
        path: "home",
        loadComponent: () =>
          import("./pages/user/home-page/home-page.component").then(
            (m) => m.HomePageComponent,
          ),
      },
      {
        path: "myProfile",
        loadComponent: () =>
          import("./pages/user/user-profile/user-profile.component").then(
            (m) => m.UserProfileComponent,
          ),
      },
      {
        path: "requests",
        loadComponent: () =>
          import("./pages/user/my-requests/my-requests.component").then(
            (m) => m.MyRequestsComponent,
          ),
      },
      {
        path: "route/:element",
        loadComponent: () =>
          import(
            "./pages/user/followers-following/followers-following.component"
          ).then((m) => m.FollowersFollowingComponent),
      },
      {
        path: "**",
        loadComponent: () =>
          import("./pages/page-not-found/page-not-found.component").then(
            (m) => m.PageNotFoundComponent,
          ),
      },
    ],
  },
  {
    path: "seeProfile",
    loadComponent: () =>
      import("./pages/user/another-user/another-user.component").then(
        (m) => m.AnotherUserComponent,
      ),
    runGuardsAndResolvers: "always",
  },
  {
    path: "message",
    loadComponent: () =>
      import("./pages/message/messaging/messaging.component").then(
        (m) => m.MessagingComponent,
      ),
  },
  {
    path: "password",
    loadComponent: () =>
      import("./pages/user/forgot-password/forgot-password.component").then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: "**",
    loadComponent: () =>
      import("./pages/page-not-found/page-not-found.component").then(
        (m) => m.PageNotFoundComponent,
      ),
  },
];
