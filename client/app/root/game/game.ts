'use strict';

angular.module('resistanceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('root.game', {
        url: ':gameID',
        template: '<game></game>'
      });
  });
