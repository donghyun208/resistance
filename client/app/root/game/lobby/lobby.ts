'use strict';

angular.module('resistanceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('root.game.lobby', {
        template: '<lobby></lobby>'
      });
  });
