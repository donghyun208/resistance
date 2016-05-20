'use strict';

angular.module('resistanceApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('root', {
        url: '/',
        cache: false,
        template: '<root></root>'
      });
  });
