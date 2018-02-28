import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Storage } from '@ionic/storage';

import { TabsPage } from '../pages/tabs/tabs';
import { OnboardingPage } from '../pages/onboarding/onboarding';
import { LoginPage } from '../pages/login/login';

import { AuthService } from '../lib/services';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage; // Always start the app with the LoginPage to be sure

  constructor(
    protected platform: Platform,
    protected statusBar: StatusBar,
    protected splashScreen: SplashScreen,
    protected storage: Storage,
    protected authService: AuthService
    ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // Set rootPage based on storage 'jwtToken' and 'onboardingCompleted'
      storage.get('jwtToken').then((val) => {
        const localToken = val;
        // If there is no token present
        if(!localToken) { this.rootPage = LoginPage; } else {
          // Try to verify the token
          authService.verifyJwtToken({token: localToken})
          .then((resp) => {
            // Token is verified --> refresh the token
            authService.refreshJwtToken({token: localToken})
            .then((resp) => {
              // Token is refreshed!
              // Check if the user allready did the onboarding
              storage.get('onboardingCompleted')
              .then((val) => {
                // Based on the 'onboardingCompleted' we guide the user to the next page
                this.rootPage = val === true ? TabsPage : OnboardingPage;
              })
              .catch((err) => {
                // Something went wrong getting the storage
                console.log(err);
              })
            })
            .catch((err) => {
              // Error refreshing token
              console.log(err);
            })
          })
          .catch((err) => {
            // Token expired
            console.log(err);
          });
        }

      });
    });
  }
}
