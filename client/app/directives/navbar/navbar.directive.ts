'use strict';

(function(){

class NavbarController {

  constructor(private Game, private GameData, private Fullscreen) {
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
