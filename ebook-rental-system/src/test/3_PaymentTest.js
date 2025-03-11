const PaymentSystem = artifacts.require("PaymentSystem");

contract("PaymentSystem", accounts => {
    let paymentSystem;
    const  recipient = accounts[1];

    beforeEach(async () => {
        paymentSystem = await PaymentSystem.new();
    });

    it("should make a payment", async () => {
        const amount = web3.utils.toWei("1", "ether");
        const initialRecipientBalance = await web3.eth.getBalance(recipient);
        await paymentSystem.makePayment(recipient, amount, { value: amount });

        const recipientBalance = await web3.eth.getBalance(recipient);
        let result = BigInt(initialRecipientBalance) + BigInt(amount);
        assert.equal(recipientBalance, result, "Payment was not successful");
    });

    it("should fail if the payment amount is incorrect", async () => {
        const amount = web3.utils.toWei("1", "ether");
        const incorrectAmount = web3.utils.toWei("2", "ether");

        try {
            await paymentSystem.makePayment(recipient, incorrectAmount, { value: amount });
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "Invalid payment", "The error message should contain 'Invalid payment'");
        }
    });
});