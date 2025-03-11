const UserRegistration = artifacts.require('UserRegistration');

contract('UserRegistration', (accounts) => {
  it('should register a user', async () => {
    const instance = await UserRegistration.deployed();
    const result = await instance.registerUser('username', 'email', 'passwordHash', { from: accounts[0] });

    assert.equal(result.logs[0].event, 'UserRegistered');
  });
});
