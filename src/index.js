// Core
import angular from 'angular';

// Dependencies
import 'angular-ui-router';

// Angular config
import routesConfig from './app/states';
import appConfig from './app/config';

// Modules
import CommonModule from './app/common.module';

// Styles
import './styles.scss';

// --- App Module -------------------
angular
  .module(
    'app', [
      'ui.router',
      CommonModule.name,
    ],
  )
  .config(routesConfig)
  .config(appConfig);
