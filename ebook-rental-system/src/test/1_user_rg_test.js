const UserRegistration = artifacts.require("UserRegistration");

contract("UserRegistration", (accounts) => {
  let userRegistration;
  const owner = accounts[0];
  const user = accounts[1];

  before(async () => {
    userRegistration = await UserRegistration.new({ from: owner });
  });

  it("should register a user", async () => {
    // Check if the user is already registered
    const isUserRegisteredBefore = await userRegistration.checkIsRegistered.call({ from: user });
    assert.equal(isUserRegisteredBefore, false, "User should not be registered initially");

    // Register the user
    await userRegistration.registerUser("John", "john@example.com", "passwordHash", { from: user });

    // Check if the user is registered after registration
    const isUserRegisteredAfter = await userRegistration.checkIsRegistered.call({ from: user });
    assert.equal(isUserRegisteredAfter, true, "User should be registered after registration");

    // Get user details
    const userDetails = await userRegistration.users.call(user);
    assert.equal(userDetails.username, "John", "Username should match after registration");
    assert.equal(userDetails.email, "john@example.com", "Email should match after registration");
  });

  it("should update user profile", async () => {
    // Update user profile
    await userRegistration.updateProfile("UpdatedJohn", "updatedjohn@example.com", "passwordHash", { from: user });

    // Get updated user details
    const updatedUserDetails = await userRegistration.users.call(user);
    assert.equal(updatedUserDetails.username, "UpdatedJohn", "Username should be updated");
    assert.equal(updatedUserDetails.email, "updatedjohn@example.com", "Email should be updated");
  });

  it("should not register a user if already registered", async () => {
    // Try to register the user again (should fail)
    try {
      await userRegistration.registerUser("AnotherUser", "anotheruser@example.com", "passwordHash", { from: user });
      assert.fail("Should have thrown an error");
    } catch (error) {
      assert.include(error.message, "User is already registered", "Error message should indicate user is already registered");
    }
  });

  it("should not update user profile without correct password", async () => {
    // Try to update user profile without correct password (should fail)
    try {
      await userRegistration.updateProfile("Hacker", "hacker@example.com", "wrongPasswordHash", { from: user });
      assert.fail("Should have thrown an error");
    } catch (error) {
      assert.include(error.message, "Incorrect password", "Error message should indicate incorrect password");
    }
  });
});
