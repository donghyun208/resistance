'use strict';

describe('Service: Game', function () {

  // load the service's module
  beforeEach(module('resistanceApp'));

  // instantiate service
  var Game;
  beforeEach(inject(function (_Game_) {
    Game = _Game_;
  }));

  it('should do something', function () {
    expect(!!Game).toBe(true);
  });

});
