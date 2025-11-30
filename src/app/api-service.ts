import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://tapobhoomi-dppapp-mobile.free.beeceptor.com';

  constructor(private http: HttpClient) {}

  getMedias(): Observable<any> {
    return this.http.get(this.apiUrl+"/medias");
  }
}
