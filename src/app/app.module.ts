/*------------------------------
  App
------------------------------*/
import { MyApp } from './app.component'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'

/*------------------------------
  Angular
------------------------------*/
import { NgModule, ErrorHandler, ApplicationRef } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule, HttpClient } from '@angular/common/http'

/*------------------------------
  Ionic
------------------------------*/
// Native
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { Push } from '@ionic-native/push/ngx'
import { Globalization } from '@ionic-native/globalization'
import { ScreenOrientation } from '@ionic-native/screen-orientation'
import { IonicStorageModule } from '@ionic/storage'
import { NativePageTransitions } from '@ionic-native/native-page-transitions'

/*------------------------------
  AWS
------------------------------*/
// Amplify
import { AmplifyAngularModule, AmplifyService, AmplifyModules } from 'aws-amplify-angular'
import Auth from '@aws-amplify/auth'

/*------------------------------
  Pages
------------------------------*/
// Exercise
import { ExercisePage } from '@pages/exercise/exercise'
import { RatingPage } from '@pages/rating/rating'
// Auth
import { LoginPage } from '@pages/auth/login/login'
import { SignUpPage } from '@pages/auth/signup/signup'
import { ConfirmCodePage } from '@pages/auth/confirmCode/confirmCode'
// Onboarding
import { OnboardingPage } from '@pages/onboarding/onboarding'
// Logbook
import { LogbookPage } from '@pages/logbook/logbook'
// Profile
import { ProfilePage } from '@pages/profile/profile'
// Progress
import { ProgressPage } from '@pages/progress/progress'
// Tabs (navigation)
import { TabsPage } from '@pages/tabs/tabs'

/*------------------------------
  Modals
------------------------------*/
//Settings
import { SettingsModal } from '@modals/settings/settings'
// Fear ladder
import { FearLadderModal } from '@modals/fearLadder/fearLadder'
import { FearLadderStepModal } from '@modals/fearLadder/step/fearLadder.step'
// Exercise
import { ExerciseMoodModal } from '@modals/exercise/mood/exercise.mood'
import { ExerciseDuringModal } from '@modals/exercise/during/exercise.during'
import { ExerciseTriggerModal } from '@modals/exercise/trigger/exercise.trigger'
import { ExerciseSuccessModal } from '@modals/exercise/success/exercise.success'
import { ExerciseListModal } from '@modals/exercise/list/exercise.list'
// Badge
import { BadgeModal } from '@modals/badge/badge'
import { BadgeEarnedModal } from '@modals/badgeEarned/badgeEarned'

/*------------------------------
  Lib
------------------------------*/
// pipes
import { NgPipesModule } from 'ngx-pipes'
import { msToTimePipe } from '@lib/pipes/msToTime'
import { accumulateTimePipe } from '@lib/pipes/accumulateTime'
import { differencePipe } from '@lib/pipes/difference'
import { relativeTimePipe } from '@lib/pipes/relativeTime'

/*------------------------------
  Directives
------------------------------*/

/*------------------------------
  Translation
------------------------------*/
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { HttpModule } from '@angular/http'

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}

/*------------------------------
  Datavisualizations
------------------------------*/
import { ChartModule } from 'angular2-highcharts'
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService'
import * as highcharts from 'highcharts/highcharts'
import Highmore from 'highcharts/highcharts-more'

/*------------------------------
  Redux
------------------------------*/
import { NgReduxModule, NgRedux, DevToolsExtension } from '@angular-redux/store'

// Logger
declare var require
var reduxLogger = require('redux-logger')
import reduxLogger from 'redux-logger'

// Thunk
import thunk from 'redux-thunk'

// Actions
import { ExerciseActions } from '@stores/exercise/exercise.action'
import { FearLadderActions } from '@stores/fearLadder/fearLadder.action'
import { BadgeActions } from '@stores/badge/badge.action'

// Reducers
import { rootReducer, IAppState, INITIAL_STATE } from '@stores/reducer'

/*------------------------------
  Components
------------------------------*/
// Mood indicator
import { SpiritMoodIndicator } from '@components/moodIndicator/moodIndicator.component'
import { SpiritMoodIndicatorMock } from '@components/moodIndicator/mock/moodIndicatorMock.component'

// Logbook item
import { SpiritLogbookItem } from '@components/logbook/item/logbookItem.component'
import { SpiritLogbookItemMock } from '@components/logbook/item/mock/logbookItemMock.component'

// Progress bar
import { ProgressBarComponent } from '@components/progressBar/progressBar.component'

// Empty state
import { EmptyStateComponent } from '@components/emptyState/emptyState.component'

// Exercise level
import { ExerciseLevelComponent } from '@components/exerciseLevel/exerciseLevel.component'

// Exercise level step
import { ExerciseLevelStepComponent } from '@components/exerciseLevelStep/exerciseLevelStep.component'

// Progress stat
import { ProgressStatComponent } from '@components/progressStat/progressStat.component'

// Badge
import { BadgeComponent } from '@components/badge/badge.component'

/*------------------------------
  Other
------------------------------*/
// 3th party modules
import { RoundProgressModule } from 'angular-svg-round-progressbar'
import { ionicPinCodeInputModule } from 'ionic3-pincode-input'

// settings
import { environment } from '@lib/environment'

@NgModule({
  declarations: [
    MyApp,
    // Pages
    LoginPage,
    SignUpPage,
    ConfirmCodePage,
    LogbookPage,
    ProfilePage,
    ProgressPage,
    TabsPage,
    OnboardingPage,
    ExercisePage,
    RatingPage,
    // Modals
    BadgeModal,
    BadgeEarnedModal,
    SettingsModal,
    ExerciseMoodModal,
    ExerciseDuringModal,
    ExerciseTriggerModal,
    ExerciseSuccessModal,
    ExerciseListModal,
    FearLadderModal,
    FearLadderStepModal,
    // Pipes
    accumulateTimePipe,
    msToTimePipe,
    differencePipe,
    relativeTimePipe,
    // Components
    SpiritMoodIndicator,
    SpiritMoodIndicatorMock,
    SpiritLogbookItem,
    SpiritLogbookItemMock,
    ProgressBarComponent,
    EmptyStateComponent,
    ExerciseLevelComponent,
    ExerciseLevelStepComponent,
    ProgressStatComponent,
    BadgeComponent,
  ],
  imports: [
    NgPipesModule,
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'bottom',
      scrollPadding: false,
      scrollAssist: false,
    }),
    IonicStorageModule.forRoot({
      name: '__spiritDB',
      driverOrder: [ 'indexeddb', 'sqlite', 'websql' ],
    }),
    ChartModule,
    HttpClientModule,
    RoundProgressModule,
    ionicPinCodeInputModule,
    AmplifyAngularModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [ HttpClient ],
      },
    }),
    NgReduxModule,
  ],
  bootstrap: [ IonicApp ],
  entryComponents: [
    MyApp,
    // Pages
    ProfilePage,
    ProgressPage,
    TabsPage,
    OnboardingPage,
    LoginPage,
    SignUpPage,
    ConfirmCodePage,
    LogbookPage,
    RatingPage,
    ExercisePage,
    // Modals
    BadgeModal,
    FearLadderStepModal,
    BadgeEarnedModal,
    SettingsModal,
    FearLadderModal,
    ExerciseMoodModal,
    ExerciseDuringModal,
    ExerciseTriggerModal,
    ExerciseSuccessModal,
    ExerciseListModal,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Push,
    NativePageTransitions,
    ScreenOrientation,
    Globalization,
    AmplifyService,
    ExerciseActions,
    FearLadderActions,
    BadgeActions,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: HighchartsStatic, useFactory: highchartsFactory },
    {
      provide: DevToolsExtension,
      useClass: DevToolsExtension,
      deps: [ ApplicationRef, NgRedux ],
    },
    {
      provide: AmplifyService,
      useFactory: () => {
        return AmplifyModules({
          Auth,
        })
      },
    },
  ],
})
export class AppModule {
  constructor(private ngRedux: NgRedux<IAppState>, private devTools: DevToolsExtension) {
    this.ngRedux.configureStore(
      rootReducer,
      INITIAL_STATE,
      environment.development ? [ reduxLogger.createLogger(), thunk ] : [ thunk ], // Skip logger for non dev builds
      environment.development ? [ this.devTools.enhancer() ] : [] // Make sure we can build for devices
    )
  }
}

//https://github.com/gevgeny/angular2-highcharts/issues/163#issuecomment-383855550
export function highchartsFactory() {
  // Default options.
  highcharts.setOptions({
    global: {
      useUTC: false,
    },
  })

  // Initialize addons.
  Highmore(highcharts)

  return highcharts
}
