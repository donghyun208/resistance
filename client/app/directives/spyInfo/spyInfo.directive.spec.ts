'use strict';

describe('Directive: spyInfo', function () {

  // load the directive's module and view
  beforeEach(module('resistanceApp'));
  beforeEach(module('app/directives/spyInfo/spyInfo.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<spy-info></spy-info>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the spyInfo directive');
  }));
});
