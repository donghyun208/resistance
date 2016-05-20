'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Home',
    'state': 'main'
  }];

  isCollapsed = false;
  //end-non-standard

  constructor() {
    }
}

angular.module('resistanceApp')
  .controller('NavbarController', NavbarController);
