'use strict';

angular.module('resistanceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('root.game.main', {
        template: '<main></main>'
      })
  });
