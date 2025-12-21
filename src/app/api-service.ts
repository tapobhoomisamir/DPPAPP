import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
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
  private supabaseKey = '<key>';
  private tapobhoomiBaseUrl = 'https://tapobhoomigoa.com/calendarapi/api/v1';
  private tapobhomiV1Key = '<key>';
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
   * Internal helper to handle caching logic using CapacitorHttp
   */
  private getWithCache(url: string, params: any = {}): Observable<any> {
    // Construct a unique key based on URL and params for the cache map
    const cacheKey = url + JSON.stringify(params);
    const cachedEntry = this.cache.get(cacheKey);
    const now = Date.now();

    // Return cached data if valid
    if (cachedEntry && now < cachedEntry.expiry) {
      console.log(`Returning cached data for: ${cacheKey}`);
      return of(cachedEntry.data);
    }

    // Use CapacitorHttp to bypass CORS and convert Promise to Observable
    return from(CapacitorHttp.get({
      url: url,
      headers: this.tapobhooiAPIHeaderJson,
      params: params
    })).pipe(
      map((response: HttpResponse) => response.data), // Extract the JSON data
      tap(data => {
        console.log(`Updating cache for: ${cacheKey}`);
        this.cache.set(cacheKey, { data, expiry: now + this.TTL });
      })
    );
  }

  getMedias(lang?: string): Observable<any> {
    const url = `${this.tapobhoomiBaseUrl}/homeitem`;
    const params = lang ? { lang } : {};
    return this.getWithCache(url, params);
  }

  getMonthYearData(month: number, year: number, lang: string): Observable<any> {
    const url = `${this.tapobhoomiBaseUrl}/panchang`;
    const params = { 
      month: month.toString(), 
      year: year.toString(), 
      lang: lang 
    };
    return this.getWithCache(url, params);
  }

  getFestivalData(lang?: string): Observable<any> {
    const url = `${this.tapobhoomiBaseUrl}/festivals`;
    const params = lang ? { lang } : {};
    return this.getWithCache(url, params);
  }

}
