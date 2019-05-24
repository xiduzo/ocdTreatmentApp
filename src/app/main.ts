import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

import awsmobile from '../aws-exports';

// import Auth from '@aws-amplify/auth';
// import Storage from '@aws-amplify/storage';
import Amplify, { Analytics } from 'aws-amplify';
Amplify.configure(awsmobile);

// Auth.configure(awsmobile);
// Storage.configure(awsmobile);
const analyticsConfig = {
  AWSPinpoint: {
    // Amazon Pinpoint App Client ID
    appId: 'dff47d9c622a4247a313a865729b1441',
    // Amazon service region
    region: 'eu-west-1',
    mandatorySignIn: false
  }
};
Analytics.configure(analyticsConfig);
Analytics.record({ name: 'anEvent' });

// Analytics.configure({ disabled: true });

platformBrowserDynamic().bootstrapModule(AppModule);
