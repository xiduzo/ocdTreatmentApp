import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { ExercisePage } from '../pages/exercise/exercise';
import { OnboardingPage } from '../pages/onboarding/onboarding';
import { LoginPage } from '../pages/login/login';
import { SignUpPage } from '../pages/signup/signup';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { IonicStorageModule } from '@ionic/storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { RestangularModule } from 'ngx-restangular';

import { AuthService, UserService } from '../lib/services';

import { RoundProgressModule, RoundProgressConfig } from 'angular-svg-round-progressbar';

import { ChartModule } from 'angular2-highcharts';
import * as highcharts from 'highcharts';

// Function for setting the default restangular configuration
export function RestangularConfigFactory(RestangularProvider, authService) {
  RestangularProvider.setBaseUrl('http://localhost:8000/');
  RestangularProvider.setRequestSuffix('/');


  RestangularProvider.addFullRequestInterceptor((element, operation, path, url, headers, params) => {
    let jwtToken = authService.getLocalToken();

    if(!jwtToken) { return; }

    return {
      headers: Object.assign({}, headers, {Authorization: `JWT ${jwtToken}`})
    };
  });
}

@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    HomePage,
    TabsPage,
    OnboardingPage,
    ExercisePage,
    LoginPage,
    SignUpPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    ChartModule.forRoot(highcharts),
    HttpClientModule,
    RoundProgressModule,
    RestangularModule.forRoot([AuthService], RestangularConfigFactory)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePage,
    HomePage,
    TabsPage,
    OnboardingPage,
    ExercisePage,
    LoginPage,
    SignUpPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativePageTransitions,
    ScreenOrientation,
    AuthService,
    UserService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
  constructor(
    private _progressConfig: RoundProgressConfig
  ) {
    _progressConfig.setDefaults({
      color: '#FCD28A'
    })
  }
}
