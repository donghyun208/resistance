'use strict';

angular.module('resistanceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('root.home', {
        template: '<home></home>'
      });
  });
