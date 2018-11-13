import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';

import { MapaComponent } from './components/mapa/mapa.component';
import { MapaEditarComponent } from './components/mapa/mapa-editar.component';

import { AgmCoreModule } from '@agm/core';
import { ReactiveFormsModule } from '@angular/forms';

// import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';

import {
    SocialLoginModule,
    AuthServiceConfig,
    GoogleLoginProvider,
    FacebookLoginProvider,
} from "angular-6-social-login";

import { SigninComponent } from './components/signin/signin.component';

import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

// Configs 
export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
      [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider("325264672733-9bgahps9b8kdglhphgsgefb4g1lse207.apps.googleusercontent.com")
        }
      ]
  );
  return config;
}

const appRoutes: Routes = [
  { path: '',   redirectTo: '/login', pathMatch: 'full'},
  {
    path: 'login',
    component: SigninComponent,
  },
  { path: 'mapa',
    component: MapaComponent,
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  entryComponents: [
    MapaEditarComponent
  ],
  declarations: [
    AppComponent,
    MapaComponent,
    MapaEditarComponent,
    SigninComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDNOu2JQ001PxZY-GVwFvVou0_6h_Sj-14'
    }),
    // OwlDateTimeModule, 
    // OwlNativeDateTimeModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    SocialLoginModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [    
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }

