import auth from './modules/auth';
import copy from './modules/copy';
import waterMarker from './modules/waterMarker';
import debounce from './modules/debounce';
import throttle from './modules/throttle';

const directivesList = {
  auth,
  copy,
  waterMarker,
  debounce,
  throttle,
};

const directives = {
  install: function (app) {
    Object.keys(directivesList).forEach(key => {
      app.directive(key, directivesList[key]);
    });
  },
};

export default directives;
