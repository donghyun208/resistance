'use strict';

describe('Directive: endGame', function () {

  // load the directive's module and view
  beforeEach(module('resistanceApp'));
  beforeEach(module('app/directives/endGame/endGame.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<end-game></end-game>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the endGame directive');
  }));
});
