/*------------------------------
  App
------------------------------*/
import { MyApp } from './app.component';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

/*------------------------------
  Angular
------------------------------*/
import { NgModule, ErrorHandler } from '@angular/core';
import { Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http';

/*------------------------------
  Ionic
------------------------------*/
// Native
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { EmailComposer } from '@ionic-native/email-composer';
import { Globalization } from '@ionic-native/globalization';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { IonicStorageModule } from '@ionic/storage';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { Broadcaster } from '@ionic-native/broadcaster';
import { File } from '@ionic-native/file';

/*------------------------------
  Pages
------------------------------*/
// Exercise
import { ExercisePage } from '../pages/exercise/exercise';
import { ExerciseMoodPage } from '../pages/exercise/mood/exercise.mood';
import { ExerciseDuringModal } from '../pages/exercise/during/exercise.during';
import { ExerciseTriggerModal } from '../pages/exercise/trigger/exercise.trigger';
import { ExerciseSuccessModal } from '../pages/exercise/success/exercise.success';
import { ExerciseListPage } from '../pages/exercise/list/exercise.list';
import { RatingPage } from '../pages/rating/rating';
// Auth
import { LoginPage } from '../pages/login/login';
import { SignUpPage } from '../pages/signup/signup';
// Onboarding
import { OnboardingPage } from '../pages/onboarding/onboarding';
// Logbook
import { LogbookPage } from '../pages/logbook/logbook';
// Profile
import { ProfilePage } from '../pages/profile/profile';
// Progress
import { ProgressPage } from '../pages/progress/progress';
// Tabs (navigation)
import { TabsPage } from '../pages/tabs/tabs';
// Fearladder
import { FearladderModal } from '../pages/fearladder/fearladder';
import { FearladderStepModal } from '../pages/fearladder/step/fearladder.step';
//Settings
import { SettingsPage } from '../pages/settings/settings';

/*------------------------------
  Lib
------------------------------*/
import { databaseHost } from '../lib/constants';
// pipes
import { groupByPipe } from '../lib/pipes/groupBy';
import { msToTimePipe } from '../lib/pipes/msToTime';
import { accumulateTimePipe } from '../lib/pipes/accumulateTime';

// injectables
import { AuthService, UserService } from '../lib/services';
// - badge
import { BadgeModal } from '../lib/badges/modal/badge';
import { BadgeFactory } from '../lib/badges/Badge';

/*------------------------------
  Translation
------------------------------*/
import { TranslateModule } from 'ng2-translate/ng2-translate';
import { TranslateLoader, TranslateStaticLoader } from 'ng2-translate/src/translate.service';

/*------------------------------
  Restangular
------------------------------*/
import { RestangularModule } from 'ngx-restangular';

/*------------------------------
  Datavisualizations
------------------------------*/
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import * as highcharts from 'highcharts/highcharts';
// import Highmore from 'highcharts/highcharts-more';

/*------------------------------
  Global events
------------------------------*/
import { EventsServiceModule } from 'angular-event-service';

/*------------------------------
  Components
------------------------------*/
import { RoundProgressModule } from 'angular-svg-round-progressbar';

// Setting the default restangular configuration
export function RestangularConfigFactory(RestangularProvider, authService) {
  RestangularProvider.setBaseUrl(databaseHost);
  RestangularProvider.setRequestSuffix('/');
  RestangularProvider.setFullResponse(true);

  RestangularProvider.addFullRequestInterceptor((element, operation, path, url, headers, params) => {
    let jwtToken = authService.getLocalToken();
    alert(jwtToken);
    if (!jwtToken) return;

    return {
      headers: Object.assign({}, headers, { Authorization: `JWT ${jwtToken}` })
    };
  });
}

// Language settings
export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, 'assets/language', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    ProgressPage,
    TabsPage,
    OnboardingPage,
    ExercisePage,
    ExerciseMoodPage,
    ExerciseDuringModal,
    ExerciseTriggerModal,
    ExerciseSuccessModal,
    ExerciseListPage,
    RatingPage,
    FearladderModal,
    FearladderStepModal,
    LoginPage,
    SignUpPage,
    LogbookPage,
    BadgeModal,
    SettingsPage,
    groupByPipe,
    accumulateTimePipe,
    msToTimePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp, { tabsPlacement: 'bottom' }),
    IonicStorageModule.forRoot(),
    ChartModule,
    HttpClientModule,
    RoundProgressModule,
    RestangularModule.forRoot([AuthService], RestangularConfigFactory),
    EventsServiceModule.forRoot(),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePage,
    ProgressPage,
    TabsPage,
    OnboardingPage,
    ExercisePage,
    ExerciseMoodPage,
    ExerciseDuringModal,
    ExerciseTriggerModal,
    ExerciseSuccessModal,
    ExerciseListPage,
    RatingPage,
    FearladderModal,
    FearladderStepModal,
    LoginPage,
    SignUpPage,
    LogbookPage,
    BadgeModal,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    EmailComposer,
    NativePageTransitions,
    ScreenOrientation,
    AuthService,
    UserService,
    LocalNotifications,
    Globalization,
    Broadcaster,
    File,
    BadgeFactory,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: HighchartsStatic, useFactory: highchartsFactory }
  ]
})

export class AppModule {
  constructor() {
  }
}

//https://github.com/gevgeny/angular2-highcharts/issues/163#issuecomment-383855550
export function highchartsFactory() {
  // Default options.
  highcharts.setOptions({
    global: {
      useUTC: false
    }
  });

  // Initialize addons.
  // Highmore(highcharts);

  return highcharts;
}
