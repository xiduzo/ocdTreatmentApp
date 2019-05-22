import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

import awsmobile from '../aws-exports';

import Auth from '@aws-amplify/auth';
import Storage from '@aws-amplify/storage';
import Analytics from '@aws-amplify/Analytics';

Auth.configure(awsmobile);
Storage.configure(awsmobile);
Analytics.configure(awsmobile);

platformBrowserDynamic().bootstrapModule(AppModule);
