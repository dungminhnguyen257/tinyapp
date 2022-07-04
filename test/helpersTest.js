const { assert } = require("chai");

const { getUserByEmail } = require("../helpers.js");

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

describe("getUserByEmail", function () {
  it("should return a user with valid email", function () {
    const users = getUserByEmail("user2@example.com", testUsers);
    const expectedUserID = testUsers.user2RandomID;
    // Write your assert statement here
    assert.strictEqual(users, expectedUserID);
  });
  it("should return undefined with invalid email", function () {
    const users = getUserByEmail("null@example.com", testUsers);
    // Write your assert statement here
    assert.strictEqual(users, undefined);
  });
});
