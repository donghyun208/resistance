'use strict';

describe('Directive: missionInfo', function () {

  // load the directive's module and view
  beforeEach(module('resistanceApp'));
  beforeEach(module('app/directives/missionInfo/missionInfo.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<mission-info></mission-info>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the missionInfo directive');
  }));
});
