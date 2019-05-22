import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

import awsmobile from '../aws-exports';

// import Auth from '@aws-amplify/auth';
// import Storage from '@aws-amplify/storage';
import Amplify, { Analytics } from 'aws-amplify';
Amplify.configure(awsmobile);

Analytics.record({ name: 'anEvent' });

// Auth.configure(awsmobile);
// Storage.configure(awsmobile);
// Analytics.configure(awsmobile);

// Analytics.configure({ disabled: true });

platformBrowserDynamic().bootstrapModule(AppModule);
