import { Component, ElementRef, HostListener, inject, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { IUser } from '../../../core/models/user';
import { ApiService } from '../../../core/services/apiServices/api.service';
import { apiConstant } from '../../../core/constants/apiConstants';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { tokenConstant } from '../../../core/constants/token';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { UserService } from '../../../core/services/userService/user.service';
import { DecodeTokenService } from '../../../core/services/decodeTokenService/decode-token.service';

@Component({
  selector: 'app-user-header',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.css'
})
export class UserHeaderComponent implements OnInit {
  @ViewChild('searchModal', { static: false }) searchModal !: ElementRef
  @ViewChild('fileInput') fileInput !: ElementRef

  userService = inject(UserService)
  apiService = inject(ApiService)
  decodeTokenService = inject(DecodeTokenService)
  user !: IUser
  isSidebarVisible = false
  accordionIsOpen = false
  router = inject(Router)

  fb = inject(FormBuilder)
  postForm !: FormGroup
  selectedFiles: File[] = []

  searchedUsers !: IUser[]
  filteredUsers !: IUser[]
  searchQuery = ''


  constructor() { }

  ngOnInit(): void {
    this.getUser()
    this.getPostForm()
  }

  getUser() {
    this.userService.user$.subscribe((res: any) => this.getImage(res._id))
  }

  getImage(userid: string) {
    this.apiService.get(apiConstant.API_HOST_URL + apiConstant.GET_ME + userid).subscribe({
      next: (res: any) => this.user = res,
      error: (error) => console.log(error)
    })
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const targetElement = event.target as HTMLElement

    if (!targetElement.closest('.sidebar') && !targetElement.closest('.logo')) {
      this.isSidebarVisible = false
    }
  }

  // Toggle the open/close state of the accordion
  toggleAccordion(): void {
    this.accordionIsOpen = !this.accordionIsOpen
  }


  async makeAccountPrivate() {

    const consent = await Swal.fire({
      title: 'Do you want to make this account private?',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonText: 'No'
    })

    if (consent) {
      this.apiService.patch(apiConstant.API_HOST_URL + apiConstant.ACCOUNT_PRIVACY + this.user._id, { command: true }).subscribe({
        next: (res: any) => console.log('PRIVACY: ', res),
        error: (error) => console.log(error)
      })
    }

  }

  async accountPrivacy() {

    const consent = await Swal.fire({
      title:  `Do you want to make this account ${this.user.isPrivate ? 'public' : 'private'}?`,
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonText: 'No'
    })

    if (consent) {
      this.apiService.patch(apiConstant.API_HOST_URL + apiConstant.ACCOUNT_PRIVACY + this.user._id, { command: this.user.isPrivate ? false : true }).subscribe({
        next: (res: any) => {
          console.log(` ${this.user.isPrivate ? 'public' : 'private'}`, res)
          this.ngOnInit()
        },
        error: (error) => console.log(error)
      })
    }

  }

  async deleteAccount() {

    const consent = await Swal.fire({
      title: 'Do you really want to delete this account?',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonText: 'No'
    })

    if (consent.isConfirmed) {
      this.apiService.delete(apiConstant.API_HOST_URL + apiConstant.DELETE_ACCOUNT + this.user._id).subscribe({
        next: (res: any) => {
          this.decodeTokenService.clearToken();
          this.router.navigateByUrl('account/login')
        
        },
        error: (error) => console.log(error)
      })

    }
  }

  logOut() {
    localStorage.removeItem(tokenConstant.LOGIN_TOKEN)
    document.cookie = "uid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    this.userService.isUserLoggedIn = false
    this.router.navigate(['account/login'])

  }

  getPostForm() {
    this.postForm = this.fb.group({
      caption: ''
    })
    // this.fileInput.nativeElement.value = ''

  }

  onFileSelect(event: Event) {
    const inputElement = event.target as HTMLInputElement

    if (inputElement.files) {
      this.selectedFiles = Array.from(inputElement.files)
      

    }
  }

  postIt() {
    const formData = new FormData()

    formData.append('caption', this.postForm.get('caption')?.value)
    formData.append('accountHolderName', this.user.username)
    this.selectedFiles.forEach(file => {
      formData.append('images', file)
    })


    this.apiService.post(apiConstant.API_HOST_URL + apiConstant.POST + this.user._id, formData).subscribe({
      next: (res: any) => {
        console.log('afterposting: ', res)
        this.selectedFiles = []
        if(this.fileInput) this.fileInput.nativeElement.value = []
        this.getPostForm()
      },
      error: (error) => console.log(error)
    })
  }

  availableUsers() {
    this.apiService.get(apiConstant.API_HOST_URL + apiConstant.SEARCHLIST_USERS).subscribe({
      next: (res: any) => this.searchedUsers = res,
      error: (error) => console.log(error)
    })
  }

  onSearch() {
    this.availableUsers()
    const query = this.searchQuery.toLowerCase()
    // console.log('SEARCHED USERS: ', this.searchedUsers);

    this.filteredUsers = this.searchedUsers?.filter(user => user.username.startsWith(query))
    // console.log('FILTERED ONES: ', this.filteredUsers);
  }

  seeUser(username: string) {
    console.log('LOGGED IN USED NAME: ',this.user.username);
    
    
    this.router.navigate(['seeProfile'], { queryParams: { username: username,profile: this.user.username } })
  }

  onModalDismiss() {
    this.searchQuery = ''
  }

}
