import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { Storage } from '@ionic/storage';

import { TabsPage } from '@pages/tabs/tabs';
import { OnboardingPage } from '@pages/onboarding/onboarding';
import { LoginPage } from '@pages/auth/login/login';

import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization';
import {
  defaultLanguage,
  availableLanguages,
  sysOptions
} from '../lib/language';

import { AmplifyService } from 'aws-amplify-angular';

import moment from 'moment';

import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';

import { IFearLadderState } from '@stores/fearLadder/fearLadder.reducer';
import { FearLadderActions } from '@stores/fearLadder/fearLadder.action';

import { IExerciseState } from '@stores/exercise/exercise.reducer';
import { ExerciseActions } from '@stores/exercise/exercise.action';

import { IBadgeState } from '@stores/badge/badge.reducer';
import { BadgeActions } from '@stores/badge/badge.action';
import { environment } from '@lib/environment';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @select() readonly fearLadder$: Observable<IFearLadderState>;
  @select() readonly exercises$: Observable<IExerciseState>;
  @select() readonly badges$: Observable<IBadgeState>;

  public rootPage: any = environment.offline ? TabsPage : LoginPage; // Always start the app with the LoginPage to be sure

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private storage: Storage,
    private translate: TranslateService,
    private globalization: Globalization,
    private screenOrientation: ScreenOrientation,
    private amplifyService: AmplifyService,
    private exerciseActions: ExerciseActions,
    private fearLadderActions: FearLadderActions,
    private badgeActions: BadgeActions
  ) {
    this.platform.ready().then(
      (): void => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        this.statusBar.styleDefault();
        this.splashScreen.hide();

        // Init the redux states
        this.initReduxStates();

        // Observe changes for local storage
        // TODO fix this in the actions (thunk)
        this.observeReduxStates();
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
      if (environment.offline) return true;

      switch (authState.state) {
        case 'signedIn':
          this.setTabsOrOnboardingPage();
          break;
        case 'signedOut':
          this.rootPage = LoginPage;
        case 'confirmSignUp':
          break;
        case 'signIn':
          break;
        default:
          // TODO:
          // Catch all events
          console.log(authState, authState.state);
          break;
      }
    });
  }

  initReduxStates(): void {
    this.exerciseActions.loadExercises();
    this.fearLadderActions.loadFearLadder();
    this.badgeActions.loadBadges();
  }

  observeReduxStates(): void {
    // Subscribe on fear ladder events
    this.fearLadder$.subscribe((fearLadderState: IFearLadderState) => {
      if (!fearLadderState.loading)
        this.storage.set('fearLadder', fearLadderState.steps);
    });
    // Subscribe on exercise events
    this.exercises$.subscribe((exerciseState: IExerciseState) => {
      if (!exerciseState.loading)
        this.storage.set('exercises', exerciseState.list);
    });
    // Subscribe on badge events
    this.badges$.subscribe((badgeState: IBadgeState) => {
      if (!badgeState.loading) this.storage.set('badges', badgeState.list);
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
    return availableLanguages.some(lang => lang.code == language)
      ? language
      : defaultLanguage;
  }
}
