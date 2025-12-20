import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { from } from 'rxjs';

import { CapacitorHttp, HttpResponse } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // private apiUrl = 'https://tapobhoomi-dppapp-mobile.free.beeceptor.com';

  private cache = new Map<string, { data: any, expiry: number }>();
  private readonly TTL = 10 * 60 * 1000;
  // Supabase API
  private supabaseUrl = 'https://ixoujsfjdjzuadnlrhhr.supabase.co/rest/v1';
  private supabaseKey = 'sb_publishable_Jx5KetAVpAnTWeQZ6vklLg_761EOfvz';
  private tapobhoomiBaseUrl = 'https://tapobhoomigoa.com/calendarapi/api/v1';
  private tapobhomiV1Key = '768bf677a6eaa7a94b9942d442edc1779d5e012f798e18cb1caaee4f2e7ec232';
  //private tapobhoomiBaseUrl = '/calendarapi/api/v1';
  constructor(private http: HttpClient) {}

  private supabaseHeaders = new HttpHeaders({
    'apikey': this.supabaseKey,
    'Authorization': `Bearer ${this.supabaseKey}`,
    'Content-Type': 'application/json'
  });

private tapobhoomiApiHeaders = new HttpHeaders({
    'X-API-Key': this.tapobhomiV1Key,
    'Content-Type': 'application/json'
  });

  private tapobhooiAPIHeaderJson = {
        'Content-Type': 'application/json',
        'X-API-Key': this.tapobhomiV1Key,
        'Accept': 'application/json',
      };

  /**
   * Internal helper to handle caching logic
   */
  private getWithCache(url: string, headers: HttpHeaders): Observable<any> {
    const cachedEntry = this.cache.get(url);
    const now = Date.now();

    // Return cached data if it exists and hasn't expired
    if (cachedEntry && now < cachedEntry.expiry) {
      console.log(`Returning cached data for: ${url}`);
      return of(cachedEntry.data);
    }

    // Otherwise, fetch from network and update cache
    return this.http.get(url, { headers }).pipe(
      tap(data => {
        console.log(`Updating cache for: ${url}`);
        this.cache.set(url, { data, expiry: now + this.TTL });
      })
    );
  }


  getMedias(lang?: string): Observable<any> {
    let url = `${this.tapobhoomiBaseUrl}/homeitem?`;
    if (lang) url += `lang=${lang}`;
    return this.getWithCache(url, this.tapobhoomiApiHeaders);
  }
  
  // Get all day_panchang rows or filter by month/year
  // getMonthYearData(month?: number, year?: number,lang?: string): Observable<any> {
    
  //   let url = `${this.tapobhoomiBaseUrl}/panchang?`;
  //   //if (month) url += `&month=eq.${month}`;
  //   //if (year) url += `&year=eq.${year}`;
  //   if (month) url += `month=${month}`;
  //   if (year) url += `&year=${year}`;
  //   if (lang) url += `&lang=${lang}`;
    
  //   return this.getWithCache(url, this.tapobhoomiApiHeaders);
  // }

  getMonthYearData(month: number, year: number,lang: string): Observable<any> {
  // Converts the Promise from Capacitor into an Observable
    return from(CapacitorHttp.get({
      url: `${this.tapobhoomiBaseUrl}/panchang`,
      headers: this.tapobhooiAPIHeaderJson,
      params: { month: month.toString(), year: year.toString(), lang: lang }
    }));
  }

//   async getMonthYearData(month: number, year: number) {
//   const response = await CapacitorHttp.get({
//     url: 'https://tapobhoomigoa.com/calendarapi/api/v1/panchang',
//     params: { month: month.toString(), year: year.toString(), lang: 'en' }
//   });
//    console.log('Panchang Data:', response.data);
  
//   return response.data;
// }

  //  getFestivalData(lang?: string): Observable<any> {
  //   let url = `${this.tapobhoomiBaseUrl}/festivals?`;
  //   //if (month) url += `&month=eq.${month}`;
  //   //if (year) url += `&year=eq.${year}`;
  //   if (lang) url += `lang=${lang}`;
    
  //   return this.getWithCache(url, this.tapobhoomiApiHeaders);
  // }

  getFestivalData(lang: string): Observable<any> {
  // Converts the Promise from Capacitor into an Observable
    return from(CapacitorHttp.get({
      url:  `${this.tapobhoomiBaseUrl}/festivals?`,
      headers: this.tapobhooiAPIHeaderJson,
      params: {  lang: lang }
    }));
  }

}
