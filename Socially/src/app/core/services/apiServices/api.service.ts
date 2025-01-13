import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }
  http = inject(HttpClient)

  get<T>(url: string, id?: string): Observable<T> {
    if (id) return this.http.get<T>(`${url}/${id}`)
    return this.http.get<T>(url)
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body, { withCredentials: true })
  }

  delete<T>(url: string, id?: string, body?: any): Observable<T> {
    if (id==='' && body) {
     return this.http.delete<T>(url, {body})
    }
    else if (id) {
     return this.http.delete<T>(`${url}${id}`)
    }
    return this.http.delete<T>(url)
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(url, body)
  }

  patch<T>(url: string, body: any, name ?: string): Observable<T> {
    if(name)  return this.http.patch<T>(`${url}${name}`,body)
    

    return this.http.patch<T>(url, body)
  }

  securedPost(url: string, body: any): Observable<any> {
    return this.http.post(url, body,);
  }
}
