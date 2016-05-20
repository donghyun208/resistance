'use strict';
(function(){

class MissionInfoCtrl {
  constructor (private Game) {
  }
}

angular.module('resistanceApp')
  .directive('missionInfo', () => ({
    scope: {},
    bindToController: {},
    restrict: 'EA',
    controller: MissionInfoCtrl,
    controllerAs: "$ctrl",
    templateUrl: 'app/directives/missionInfo/missionInfo.html'
  }));
})();
