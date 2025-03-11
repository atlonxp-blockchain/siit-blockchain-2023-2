const PublisherManagement = artifacts.require("PublisherManagement");

contract("PublisherManagement", accounts => {
    let publisherManagementInstance;
    const owner = accounts[0];
    const publisher = accounts[2];

    beforeEach(async () => {
        publisherManagementInstance = await PublisherManagement.new();
    });

    it("should register a publisher", async () => {
        const name = "Test Publisher";
        const contactDetails = "test@example.com";

        await publisherManagementInstance.registerPublisher(name, contactDetails, { from: accounts[0] });
        const registeredPublisher = await publisherManagementInstance.publishers(accounts[0]);

        assert.equal(registeredPublisher.name, name, "Publisher name not match");
        assert.equal(registeredPublisher.contactDetails, contactDetails, "Publisher contact detail not match");
    });

    it("should add a book list", async () => {
        const name = "Test Publisher";
        const contactDetails = "test@example.com";

        await publisherManagementInstance.registerPublisher(name, contactDetails, { from: accounts[0] });

        const bookName = "Test Book";
        const authorName = "Test Author";
        const description = "Test Description";
        const price = 100;
        const bookId = 1;

        await publisherManagementInstance.addBookList(bookId, bookName, description, authorName, price, { from: accounts[0] });
        const book = await publisherManagementInstance.getBookInfo(accounts[0], bookId);
        const [bName, bDescription, bAuthor, bPrice] = Object.values(book);

        assert.equal(bName, bookName, "book name not match");
        assert.equal(bAuthor, authorName, "Author name not match");
        assert.equal(bDescription, description, "Book decription not match");
        assert.equal(bPrice, price, "price not match");
    });
});
