'use strict';

describe('Service: GameData', function () {

  // load the service's module
  beforeEach(module('resistanceApp'));

  // instantiate service
  var GameData;
  beforeEach(inject(function (_GameData_) {
    GameData = _GameData_;
  }));

  it('should do something', function () {
    expect(!!GameData).toBe(true);
  });

});
