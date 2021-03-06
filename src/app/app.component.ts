import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { Storage } from '@ionic/storage';

import { TabsPage } from '@/pages/tabs/tabs';
import { OnboardingPage } from '@/pages/onboarding/onboarding';
import { LoginPage } from '@/pages/auth/login/login';

import { TranslateService } from 'ng2-translate';
import { Globalization } from '@ionic-native/globalization';
import {
  defaultLanguage,
  availableLanguages,
  sysOptions
} from '../lib/language';

import { AmplifyService } from 'aws-amplify-angular';

import moment from 'moment';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // private rootPage:any = LoginPage; // Always start the app with the LoginPage to be sure
  private rootPage: any = LoginPage;

  private signedIn: boolean;
  private user: any;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private storage: Storage,
    private translate: TranslateService,
    private globalization: Globalization,
    private screenOrientation: ScreenOrientation,
    private amplifyService: AmplifyService
  ) {
    this.platform.ready().then(
      (): void => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      }
    );
  }

  ngOnInit(): any {
    // Set the language for the app
    this.setLanguage();

    // We only let the users use the app in portrait, bc its fucked up in landscape (sorry not sorry)
    if (this.platform.is('cordova')) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }

    // Subscribe on auth events
    this.amplifyService.authStateChange$.subscribe(authState => {
      switch (authState.state) {
        case 'signedIn':
          console.log(authState, authState.state);
          this.signedIn = true;
          this.user = authState.user;
          this.setTabsOrOnboardingPage();
          break;
        case 'signedOut':
          this.signedIn = false;
          this.rootPage = LoginPage;
        case 'confirmSignUp':
          this.user = authState.user;
          break;
        case 'signIn':
          console.log(this.user);
          break;
        default:
          // TODO:
          // Catch all events
          console.log(authState, authState.state);
          break;
      }
    });
  }

  setTabsOrOnboardingPage(): void {
    // See if the users completed their onboarding
    this.storage
      .get('onboardingCompleted')
      .then(val => {
        // Based on the 'onboardingCompleted' we guide the user to the next page
        this.rootPage = val ? TabsPage : OnboardingPage;
      })
      .catch(err => {
        console.log(err);
      });
  }

  setLanguage(): void {
    // See if we have set the language already
    this.storage.get('language').then(val => {
      // return if we have set a language
      if (val) return this.translate.setDefaultLang(val);

      // Else try to find the best option
      // First set the default language
      this.translate.setDefaultLang(defaultLanguage);

      // Then try to find best language based on cordova || browser
      if ((<any>window).cordova) {
        this.globalization.getPreferredLanguage().then(result => {
          this.updateLanguageSettings(result.value);
        });
      } else {
        let browserLanguage =
          this.translate.getBrowserLang() || defaultLanguage;
        this.updateLanguageSettings(browserLanguage);
      }
    });
  }

  updateLanguageSettings(language: string): void {
    language = this.getSuitableLanguage(language);
    this.translate.use(language);
    sysOptions.systemLanguage = language;
    this.storage.set('language', language);

    // Moment language
    moment.locale(language);
  }

  getSuitableLanguage(language: string): string {
    language = language.substring(0, 2).toLowerCase();
    return availableLanguages.some(x => x.code == language)
      ? language
      : defaultLanguage;
  }
}
