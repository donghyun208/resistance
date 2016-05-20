'use strict';
(function(){

class SpyInfoCtrl {

  constructor(private GameData, public Game) {
  }

}

angular.module('resistanceApp')
  .directive('spyInfo', () => ({
    scope: {},
    bindToController: {
    },
    controller: SpyInfoCtrl,
    controllerAs: "$ctrl",
    templateUrl: 'app/directives/spyInfo/spyInfo.html',
    restrict: 'EA'
  }));
})();
