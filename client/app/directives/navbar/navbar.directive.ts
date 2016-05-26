'use strict';

(function(){

class NavbarController {
  //start-non-standard
  // menu = [{
  //   'title': 'Home',
  //   'state': 'main'
  // }];

  // isCollapsed = false;
  //end-non-standard

  constructor(private Game, private GameData) {
  }

  toggleRole() {
    this.GameData.showRole = !this.GameData.showRole
  }
}

angular.module('resistanceApp')
  .directive('navbarar', () => ({
    templateUrl: 'app/directives/navbar/navbar.html',
    restrict: 'E',
    controller: NavbarController,
    controllerAs: '$ctrl'
  }));

})();
