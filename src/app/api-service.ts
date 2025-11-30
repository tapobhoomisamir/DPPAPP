import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // private apiUrl = 'https://tapobhoomi-dppapp-mobile.free.beeceptor.com';


  // Supabase API
  private supabaseUrl = 'https://ixoujsfjdjzuadnlrhhr.supabase.co/rest/v1';
  private supabaseKey = 'sb_publishable_Jx5KetAVpAnTWeQZ6vklLg_761EOfvz';
  constructor(private http: HttpClient) {}

  private supabaseHeaders = new HttpHeaders({
    'apikey': this.supabaseKey,
    'Authorization': `Bearer ${this.supabaseKey}`,
    'Content-Type': 'application/json'
  });

  // getMedias(): Observable<any> {
  //   return this.http.get(this.apiUrl+"/medias");
  // }


  getMedias(): Observable<any> {
    let url = `${this.supabaseUrl}/events`;
    return this.http.get(url, { headers: this.supabaseHeaders });
  }
  // getMonthYearData(month : number,year : number): Observable<any> {
  //   return this.http.get(this.apiUrl+`/month-data/${year}/${month}`);
  // }

  // Get all day_panchang rows or filter by month/year
  getMonthYearData(month?: number, year?: number): Observable<any> {
    let url = `${this.supabaseUrl}/day_panchang?select=*`;
    if (month) url += `&month=eq.${month}`;
    if (year) url += `&year=eq.${year}`;
    return this.http.get(url, { headers: this.supabaseHeaders });
  }
}
