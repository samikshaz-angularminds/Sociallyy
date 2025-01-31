import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { UserLoginComponent } from './pages/user/user-login/user-login.component';
import { UserRegistrationComponent } from './pages/user/user-registration/user-registration.component';
import { HomePageComponent } from './pages/user/home-page/home-page.component';
import { UserProfileComponent } from './pages/user/user-profile/user-profile.component';
import { MyRequestsComponent } from './pages/user/my-requests/my-requests.component';
import { FollowersFollowingComponent } from './pages/user/followers-following/followers-following.component';
import { authGuard } from './core/guards/authGuard/auth.guard';
import { AnotherUserComponent } from './pages/user/another-user/another-user.component';
import { MessagingComponent } from './pages/message/messaging/messaging.component';
import { ForgotPasswordComponent } from './pages/user/forgot-password/forgot-password.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'landing-page',
        pathMatch: 'full'
    },
    {
        path: 'landing-page',
        component: LandingPageComponent
    },
    {
        path: 'account',
        children: [
            {
                path: 'login',
                component: UserLoginComponent
            },
            {
                path: 'register',
                component: UserRegistrationComponent
            },
        ]
    },
    {
        path: 'user',
        canActivateChild: [authGuard],
        children: [

            {
                path: 'home',
                component: HomePageComponent
            },
            {
                path: 'myProfile',
                component: UserProfileComponent
            },
            {
                path: 'requests',
                component: MyRequestsComponent
            },
            {
                path: 'route/:element',
                component: FollowersFollowingComponent
            },
        ]
    },
    {
        path: 'seeProfile',
        component : AnotherUserComponent,
        runGuardsAndResolvers: 'always'
    },
    {
        path:'message',
        component : MessagingComponent
    },
    {
        path : 'password',
        component : ForgotPasswordComponent
    }
];
