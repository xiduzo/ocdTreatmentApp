import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

import Auth from '@aws-amplify/auth';
import Storage from '@aws-amplify/storage';
import awsmobile from '../aws-exports';
Storage.configure(awsmobile);
Auth.configure(awsmobile);

import { Analytics } from 'aws-amplify'

Analytics.configure({ disabled: true })

platformBrowserDynamic().bootstrapModule(AppModule);
