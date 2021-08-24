var assert = require('assert');
import User from '../src/models/User';

describe('User', function() {
  describe('Create User', function() {
    it('Should create new account with Username: Johnny and password: Test', function() {
      const newUser = new User("Johnny", "Test");
      assert.equal(newUser.userName, "Johnny");
      assert.equal(newUser.password, "Test");
    });
  });
});