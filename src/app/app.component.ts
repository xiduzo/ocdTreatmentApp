import { Component } from '@angular/core';
import { App, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { Storage } from '@ionic/storage';

import { TabsPage } from '../pages/tabs/tabs';
//import { OnboardingPage } from '../pages/onboarding/onboarding';
//import { LoginPage } from '../pages/login/login';

import { AuthService, UserService } from '../lib/services';

import { TranslateService } from 'ng2-translate';
import { Globalization } from '@ionic-native/globalization';
import { defaultLanguage, availableLanguages, sysOptions } from '../lib/constants';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  private rootPage:any = LoginPage; // Always start the app with the LoginPage to be sure
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
        // We only let the users use the app in portrait, bc its fucked up in landscape (sorry not sorry)
        //if(platform.platforms().find(platform => { return platform === 'core' })) screenOrientation.lock(screenOrientation.ORIENTATIONS.PORTRAIT);

        // Set the language for the app
        this.setLanguage();

        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        statusBar.styleDefault();
        splashScreen.hide();
      });

    // platform.ready().then(() => {
    //   // We only let the users use the app in portrait, bc its fucked up in landscape (sorry not sorry)
    //   //if(platform.platforms().find(platform => { return platform === 'core' })) screenOrientation.lock(screenOrientation.ORIENTATIONS.PORTRAIT);
    //
    //   // Set the language for the app
    //   this.setLanguage();
    //
    //   // Okay, so the platform is ready and our plugins are available.
    //   // Here you can do any higher level native things you might need.
    //   statusBar.styleDefault();
    //   splashScreen.hide();
    //
    //   // Uncomment to start with fresh user
    //   // storage.clear();
    //
    //   // Get the user
    //   storage.get('user').then((user) => {
    //     if(user) { userService.setUser(user); }
    //   });
    //
    //   // Set rootPage based on storage 'jwtToken' and 'onboardingCompleted'
    //   storage.get('jwtToken')
    //   .then((val) => {
    //     const localToken = val;
    //
    //     if(localToken) {
    //       // Try to verify the token
    //       authService.verifyJwtToken({token: localToken})
    //       .then((resp) => {
    //         // Token is verified --> refresh the token
    //         authService.refreshJwtToken({token: localToken})
    //         .then((resp:any) => {
    //           // Set the token for the app
    //           authService.setLocalToken(resp.token);
    //           // Token is refreshed!
    //           // Check if the user allready did the onboarding
    //           storage.get('onboardingCompleted')
    //           .then((val) => {
    //             // Based on the 'onboardingCompleted' we guide the user to the next page
    //             val === true ? this.appCtrl.getRootNav().push(TabsPage) : this.appCtrl.getRootNav().push(OnboardingPage);
    //           })
    //           // Something went wrong getting the 'onboardingCompleted'
    //           .catch((err) => { console.log(err); });
    //         })
    //         // Error refreshing token
    //         .catch((err) => { console.log(err); });
    //       })
    //       // Token expired
    //       .catch((err) => { console.log(err); });
    //     }
    //   })
    //   // Something went wrong getting the 'jwtToken'
    //   .catch((err) => { console.log(err); });
    // });
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
          var language = this.getSuitableLanguage(result.value);
          this.translate.use(language);
          sysOptions.systemLanguage = language;
          this.storage.set('language', language);
        });
      } else {
        let browserLanguage = this.translate.getBrowserLang() || defaultLanguage;
        var language = this.getSuitableLanguage(browserLanguage);
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
