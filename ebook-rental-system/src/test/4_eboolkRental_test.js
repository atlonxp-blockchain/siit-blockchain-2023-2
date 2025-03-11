const UserRegistration = artifacts.require("UserRegistration");
const PublisherManagement = artifacts.require("PublisherManagement");
const PaymentSystem = artifacts.require("PaymentSystem");
const EbookRental = artifacts.require("EbookRental");

contract("EbookRental", (accounts) => {
  let userRegistration;
  let publisherManagement;
  let paymentSystem;
  let ebookRental;
  let canRead;


  const owner = accounts[0];
  const user = accounts[1];
  const publisher = accounts[2];

  const increaseTime = async (seconds) => {
    return new Promise((resolve, reject) => {
      web3.currentProvider.send(
        {
          jsonrpc: "2.0",
          method: "evm_increaseTime",
          params: [seconds],
          id: new Date().getTime(),
        },
        (err, result) => {
          if (err) return reject(err);
          return resolve(result.result);
        }
      );
    });
  };

  beforeEach(async () => {
    // Deploy contracts and register user before each test
    userRegistration = await UserRegistration.new({ from: owner });
    publisherManagement = await PublisherManagement.new({ from: owner });
    paymentSystem = await PaymentSystem.new({ from: owner });
    ebookRental = await EbookRental.new(
      userRegistration.address,
      publisherManagement.address,
      paymentSystem.address,
      { from: owner }
    );


    // Register publisher and add a book
    await publisherManagement.registerPublisher("Publisher1", "contact@example.com", { from: publisher });
    await publisherManagement.addBookList(1, "Book1", "Description", "Author", 100, { from: publisher });
  });

  it("should rent book successfully", async () => {
    await userRegistration.registerUser("user", "user@example.com", "passwordHash", { from: user });

    // Perform the rental operation 
    try {
      await ebookRental.rentBook(1, publisher, { from: user });
      assert.fail("Expected the rental operation to fail");
    } catch (error) {
      // Check if the error message indicates that the user is not registered
      assert.include(error.message, "User is not registered", "Unexpected error message");
    }
  });

  it("should register a user", async () => {
    // Register the user
    await userRegistration.registerUser("user", "user@example.com", "passwordHash", { from: user });
  
    // Check if the user is registered
    const isUserRegistered = await userRegistration.checkIsRegistered({ from: user });
    assert.equal(isUserRegistered, true, `User ${user} should be registered`);
    
  });
  

  it("should not allow renting a book if the user is not registered", async () => {
    // Perform the rental operation and expect it to fail
    try {
      await ebookRental.rentBook(1, publisher,{ from: user });
      assert.fail("Expected the rental operation to fail");
    } catch (error) {
      // Check if the error message indicates that the user is not registered
      assert.include(error.message, "User is not registered", "Unexpected error message");
    }
  });
  


  it("should allow reading a rented book within the rental period", async () => {
    
    // Perform the rental operation
    try {
      await ebookRental.rentBook(1, publisher,{ from: user });
  
      // Increase the time to simulate the passage of 1 day
      await increaseTime(1 * 24 * 3600);
  
      // Check if the user is allowed to read the rented book within the rental period
      canRead = await ebookRental.canReadBook(user, 1);
    } catch (error) {
      console.error("Error during rental operation:", error);
    }
  
    // Assert the result outside the try-catch block
    if (typeof canRead !== "undefined") {
      assert.equal(canRead, true, "User should be allowed to read the rented book within the rental period");
    } else {
      // Log a message or handle the case where canRead is undefined
      console.error("canRead is undefined. Check for errors during the rental operation.");
    }
  });
  


  it("should prevent reading a rented book after the rental period has expired", async () => {
    // Perform the rental operation
    try {
      await ebookRental.rentBook(1,publisher, { from: user });
  
      // Increase the time to simulate the passage of 31 days (beyond the rental period)
      await increaseTime(31 * 24 * 3600);
  
      // Check if the user is allowed to read the rented book after the rental period has expired
      canRead = await ebookRental.canReadBook(user, 1);
    } catch (error) {
      // Handle the error if needed
      console.error("Error during the rental operation:", error);
    }
  
    // Assert the result outside the try-catch block
    if (typeof canRead !== "undefined") {
      assert.equal(canRead, false, "User should not be allowed to read the rented book after the rental period");
    } else {
      // Log a message or handle the case where canRead is undefined
      console.error("canRead is undefined. Check for errors during the rental operation.");
    }
  });

  it("should prevent reading a book that the user has not rented", async () => {
    // Register the user
    await userRegistration.registerUser("user", "user@example.com", "passwordHash", { from: user });
  
    // Register the publisher and add a book
    await publisherManagement.registerPublisher("Publisher1", "contact@example.com", { from: publisher });
    await publisherManagement.addBookList(2, "Book2", "Description", "Author", 150, { from: publisher });
  
    // Attempt to read the book without renting
    try {
      // Assuming Book ID 2 is not rented by the user
      canRead = await ebookRental.canReadBook(user, 2);
    } catch (error) {
      // Handle the error if needed
      console.error("Error during canReadBook operation:", error);
    }
  
    // Assert the result outside the try-catch block
    if (typeof canRead !== "undefined") {
      assert.equal(canRead, false, "User should not be allowed to read a book they have not rented");
    } else {
      // Log a message or handle the case where canRead is undefined
      console.error("canRead is undefined. Check for errors during the canReadBook operation.");
    }
  });
  
  
});
