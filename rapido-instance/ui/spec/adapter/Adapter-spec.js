import Adapter from '../../src/modules/adapter/Adapter.js'
import MockBackend from '../../src/modules/adapter/MockBackend.js'

describe("Backend Adapter", function() {

  it("should store a mock backend implementation", function() {
    Adapter.setBackend(new MockBackend());
  })

  it("should return the stored backend implementation", function() {
    expect(Adapter.call()).not.toBe(null);
    
    expect(Adapter.call().getName()).toBe("MockBackend");
  })

  it("should allow a call to login", function(done) {
    Adapter.call().login("username", "password")
      .catch(function(error) {
        expect(error.message).not.toBeNull();
        done();
      });
  })

});
