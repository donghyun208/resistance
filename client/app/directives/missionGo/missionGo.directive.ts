'use strict';

angular.module('resistanceApp')
  .directive('missionGo', function () {
    return {
      templateUrl: 'app/directives/missionGo/missionGo.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
