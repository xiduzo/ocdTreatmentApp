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
// Other
import { HttpClientModule } from '@angular/common/http';

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
// YBOCS
// TODO: implement this page
import { YbocsModal } from '../pages/ybocs/ybocs';
// Fearladder
import { FearladderModal } from '../pages/fearladder/fearladder';
import { FearladderStepModal } from '../pages/fearladder/step/fearladder.step';

/*------------------------------
  Lib
------------------------------*/
import { databaseHost } from '../lib/constants';
import { GroupByPipe } from '../lib/pipes';
import { AuthService, UserService } from '../lib/services';

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
import * as highcharts from 'highcharts';

/*------------------------------
  Components
------------------------------*/
import { RoundProgressModule, RoundProgressConfig } from 'angular-svg-round-progressbar';
import { NgxCircularSliderModule } from 'ngx-circular-slider';



// Setting the default restangular configuration
export function RestangularConfigFactory(RestangularProvider, authService) {
  RestangularProvider.setBaseUrl(databaseHost);
  RestangularProvider.setRequestSuffix('/');
  RestangularProvider.setFullResponse(true);

  RestangularProvider.addFullRequestInterceptor((element, operation, path, url, headers, params) => {
    let jwtToken = authService.getLocalToken();
    alert(jwtToken);
    if(!jwtToken) return;

    return {
      headers: Object.assign({}, headers, {Authorization: `JWT ${jwtToken}`})
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
    FearladderModal,
    FearladderStepModal,
    YbocsModal,
    LoginPage,
    SignUpPage,
    LogbookPage,
    GroupByPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    ChartModule.forRoot(highcharts),
    HttpClientModule,
    RoundProgressModule,
    NgxCircularSliderModule,
    RestangularModule.forRoot([AuthService], RestangularConfigFactory),
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
    FearladderModal,
    FearladderStepModal,
    YbocsModal,
    LoginPage,
    SignUpPage,
    LogbookPage
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
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule {
  constructor( private _progressConfig: RoundProgressConfig) {
    this._progressConfig.setDefaults({ color: '#50D2C2' });
  }
}
