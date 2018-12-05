import { Component } from '@angular/core';
import { App, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { Storage } from '@ionic/storage';

import { TabsPage } from '../pages/tabs/tabs';
import { OnboardingPage } from '../pages/onboarding/onboarding';
//import { LoginPage } from '../pages/login/login';

import { AuthService, UserService } from '../lib/services';

import { TranslateService } from 'ng2-translate';
import { Globalization } from '@ionic-native/globalization';
import { defaultLanguage, availableLanguages, sysOptions } from '../lib/language';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // private rootPage:any = LoginPage; // Always start the app with the LoginPage to be sure
  // TODO: Fix some sort of secure login for users (finger print / passcode / etc) if user want to have protection of data
  private rootPage:any;

  constructor(
    protected appCtrl: App,
    protected platform: Platform,
    protected statusBar: StatusBar,
    protected splashScreen: SplashScreen,
    protected storage: Storage,
    protected authService: AuthService,
    protected userService: UserService,
    protected translate: TranslateService,
    protected globalization: Globalization,
    protected screenOrientation: ScreenOrientation
  ) {
    platform.ready().then(() => {
      // storage.clear();
      // We only let the users use the app in portrait, bc its fucked up in landscape (sorry not sorry)
      screenOrientation.lock(screenOrientation.ORIENTATIONS.PORTRAIT);

      // Set the language for the app
      this.setLanguage();

      // See if the users completed their onboarding
      storage.get('onboardingCompleted')
      .then((val) => {
        // Based on the 'onboardingCompleted' we guide the user to the next page
        this.appCtrl.getRootNavById('n4').push((val ? TabsPage : OnboardingPage));
      })
      .catch((err) => { console.log(err); });

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  setLanguage() {
    // See if we have set the language allready
    this.storage.get('language')
    .then((val) => {
      // return if we have set a language
      if(val) return this.translate.setDefaultLang(val);

      // Else try to find the best option
      this.translate.setDefaultLang(defaultLanguage);

      if ((<any>window).cordova) {
        this.globalization.getPreferredLanguage().then(result => {
          let language = this.getSuitableLanguage(result.value);
          this.translate.use(language);
          sysOptions.systemLanguage = language;
          this.storage.set('language', language);
        });
      } else {
        let browserLanguage = this.translate.getBrowserLang() || defaultLanguage;
        let language = this.getSuitableLanguage(browserLanguage);
        this.translate.use(language);
        sysOptions.systemLanguage = language;
        this.storage.set('language', language);
      }
    })

  }

  getSuitableLanguage(language) {
    language = language.substring(0, 2).toLowerCase();
		return availableLanguages.some(x => x.code == language) ? language : defaultLanguage;
  }
}
