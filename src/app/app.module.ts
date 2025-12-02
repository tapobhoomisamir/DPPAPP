import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader,TRANSLATE_HTTP_LOADER_CONFIG } from '@ngx-translate/http-loader';


// Function to load translation files from the assets folder
export function createTranslateLoader(http: HttpClient) {
  // The 'http' argument is now correctly provided by Angular's dependency injection
  return new TranslateHttpLoader();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    // Configure ngx-translate
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [] // 👈 Dependency array must be empty
      }
    })
  ],
  providers: [
    // Existing providers...
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy}, 
    provideHttpClient(withInterceptorsFromDi()), 
    
    // 👈 THIS PROVIDER FIXES THE RUNTIME ERROR (NG0201)
    { 
      provide: TRANSLATE_HTTP_LOADER_CONFIG, 
      useValue: { 
        loaderOptions: { 
          prefix: './assets/i18n/', 
          suffix: '.json' 
        } 
      } 
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
