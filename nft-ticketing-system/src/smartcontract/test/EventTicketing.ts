import { ethers } from "hardhat";
import { expect } from "chai";
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

describe("EventTicketing", function () {
  async function deployEventTicketingFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const EventTicketing = await ethers.getContractFactory("EventTicketing");
    const eventTicketing = await EventTicketing.deploy();

    return { eventTicketing, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should deploy the contract correctly", async function () {
      const { eventTicketing } = await loadFixture(deployEventTicketingFixture);
      expect(await eventTicketing.getAddress()).to.properAddress;
    });
    it("Should set the right owner", async function () {
      const { eventTicketing, owner } = await loadFixture(
        deployEventTicketingFixture
      );
      expect(await eventTicketing.owner()).to.equal(owner.address);
    });
  });

  describe("Event Management", function () {
    it("Should allow the owner to create an event", async function () {
      const { eventTicketing } = await loadFixture(deployEventTicketingFixture);
      const name = "Test Event";
      const dateTimestamp = (await time.latest()) + 24 * 60 * 60; // One day from now
      const location = "Test Location";
      const imageCoverUri = "testUri";
      const ticketLimit = 100;
      const ticketPrice = ethers.parseEther("0.1");

      await expect(
        eventTicketing.createEvent(
          name,
          dateTimestamp,
          location,
          imageCoverUri,
          ticketLimit,
          ticketPrice
        )
      )
        .to.emit(eventTicketing, "EventCreated")
        .withArgs(
          anyValue,
          name,
          dateTimestamp,
          location,
          ticketLimit,
          ticketPrice
        );
    });
    it("Should fail when a non-owner tries to create an event", async function () {
      const { eventTicketing, addr1 } = await loadFixture(
        deployEventTicketingFixture
      );
      const name = "Test Event";
      const dateTimestamp = (await time.latest()) + 24 * 60 * 60; // One day from now
      const location = "Test Location";
      const imageCoverUri = "testUri";
      const ticketLimit = 100;
      const ticketPrice = ethers.parseEther("0.1");

      // Attempt to create the event with addr1 (non-owner)
      await expect(
        eventTicketing
          .connect(addr1)
          .createEvent(
            name,
            dateTimestamp,
            location,
            imageCoverUri,
            ticketLimit,
            ticketPrice
          )
      ).to.be.revertedWithCustomError(
        eventTicketing,
        "OwnableUnauthorizedAccount"
      );
    });
    it("Should allow the owner to toggle an event's status", async function () {
      const { eventTicketing, owner, addr1 } = await loadFixture(
        deployEventTicketingFixture
      );
      const eventId = 0; // Assuming an event with ID 0 has been created
      // Create an event first
      const name = "Test Event";
      const dateTimestamp = (await time.latest()) + 24 * 60 * 60; // One day from now
      const location = "Test Location";
      const imageCoverUri = "testUri";
      const ticketLimit = 100;
      const ticketPrice = ethers.parseEther("0.1");

      await eventTicketing.createEvent(
        name,
        dateTimestamp,
        location,
        imageCoverUri,
        ticketLimit,
        ticketPrice
      );
      await expect(eventTicketing.toggleEvent(eventId, true))
        .to.emit(eventTicketing, "EventToggled")
        .withArgs(eventId, true);
    });
  });
  describe("Ticket Purchasing", function () {
    it("Should allow users to purchase tickets after creating an event", async function () {
      const { eventTicketing, addr1 } = await loadFixture(
        deployEventTicketingFixture
      );

      // Create an event first
      const name = "Test Event";
      const dateTimestamp = (await time.latest()) + 24 * 60 * 60; // One day from now
      const location = "Test Location";
      const imageCoverUri = "testUri";
      const ticketLimit = 100;
      const ticketPrice = ethers.parseEther("0.1");

      await eventTicketing.createEvent(
        name,
        dateTimestamp,
        location,
        imageCoverUri,
        ticketLimit,
        ticketPrice
      );

      // Assuming the first event has ID 0
      const eventId = 0;
      const quantity = 2;

      // Calculate total price for the tickets
      const totalPrice = ticketPrice * BigInt(quantity);

      await expect(
        eventTicketing
          .connect(addr1)
          .purchaseTickets(eventId, quantity, { value: totalPrice })
      )
        .to.emit(eventTicketing, "TicketsPurchased")
        .withArgs(eventId, addr1.address, quantity);
    });
    it("Should fail when a user tries to purchase tickets for an event that doesn't exist", async function () {
      const { eventTicketing, addr1, addr2 } = await loadFixture(
        deployEventTicketingFixture
      );
      // Create an event first
      const name = "Test Event";
      const dateTimestamp = (await time.latest()) + 24 * 60 * 60; // One day from now
      const location = "Test Location";
      const imageCoverUri = "testUri";
      const ticketLimit = 100;
      const ticketPrice = ethers.parseEther("0.1");

      await eventTicketing.createEvent(
        name,
        dateTimestamp,
        location,
        imageCoverUri,
        ticketLimit,
        ticketPrice
      );
      const eventId = 1; // Event with ID 1 does not exist
      const quantity = 2;

      // Calculate total price for the tickets
      const totalPrice = ticketPrice * BigInt(quantity);

      await expect(
        eventTicketing
          .connect(addr1)
          .purchaseTickets(eventId, quantity, { value: totalPrice })
      ).to.revertedWith("Event does not exist");
    });
    it("Should fail when a user sent less ethers than the total price", async function () {
      const { eventTicketing, addr1, addr2 } = await loadFixture(
        deployEventTicketingFixture
      );
      // Create an event first
      const name = "Test Event";
      const dateTimestamp = (await time.latest()) + 24 * 60 * 60; // One day from now
      const location = "Test Location";
      const imageCoverUri = "testUri";
      const ticketLimit = 100;
      const ticketPrice = ethers.parseEther("0.1");

      await eventTicketing.createEvent(
        name,
        dateTimestamp,
        location,
        imageCoverUri,
        ticketLimit,
        ticketPrice
      );
      const eventId = 0;
      const quantity = 2;

      // Calculate total price for the tickets
      const totalPrice = BigInt(0);

      await expect(
        eventTicketing
          .connect(addr1)
          .purchaseTickets(eventId, quantity, { value: totalPrice })
      ).to.revertedWith("Incorrect amount of ETH sent");
    });
    it("Should fail when a user tries to purchase more tickets than the limit", async function () {
      const { eventTicketing, addr1 } = await loadFixture(
        deployEventTicketingFixture
      );
      // Create an event first
      const name = "Test Event";
      const dateTimestamp = (await time.latest()) + 24 * 60 * 60; // One day from now
      const location = "Test Location";
      const imageCoverUri = "testUri";
      const ticketLimit = 100;
      const ticketPrice = ethers.parseEther("0.1");

      await eventTicketing.createEvent(
        name,
        dateTimestamp,
        location,
        imageCoverUri,
        ticketLimit,
        ticketPrice
      );
      const eventId = 0;
      const quantity = 101;

      // Calculate total price for the tickets
      const totalPrice = ticketPrice * BigInt(quantity);

      await expect(
        eventTicketing
          .connect(addr1)
          .purchaseTickets(eventId, quantity, { value: totalPrice })
      ).to.revertedWith("Not enough tickets available");
    });

    it("Should fail when a user tries to purchase when the event is closed", async function () {
      const { eventTicketing, owner, addr1 } = await loadFixture(
        deployEventTicketingFixture
      );
      // Create an event first
      const name = "Test Event";
      const dateTimestamp = (await time.latest()) + 24 * 60 * 60; // One day from now
      const location = "Test Location";
      const imageCoverUri = "testUri";
      const ticketLimit = 100;
      const ticketPrice = ethers.parseEther("0.1");

      await eventTicketing.createEvent(
        name,
        dateTimestamp,
        location,
        imageCoverUri,
        ticketLimit,
        ticketPrice
      );
      // Close the event
      await expect(eventTicketing.connect(owner).toggleEvent(0, true))
        .to.emit(eventTicketing, "EventToggled")
        .withArgs(0, true);
      const eventId = 0;
      const quantity = 100;

      // Calculate total price for the tickets
      const totalPrice = ticketPrice * BigInt(quantity);

      await expect(
        eventTicketing
          .connect(addr1)
          .purchaseTickets(eventId, quantity, { value: totalPrice })
      ).to.revertedWith("Event has been closed");
    });
  });

  describe("Using Tickets", function () {
    it("Should allow the owner to mark a ticket as used", async function () {
      const { eventTicketing, owner, addr1 } = await loadFixture(
        deployEventTicketingFixture
      );

      // Create an event first
      const name = "Test Event";
      const dateTimestamp = (await time.latest()) + 24 * 60 * 60; // One day from now
      const location = "Test Location";
      const imageCoverUri = "testUri";
      const ticketLimit = 100;
      const ticketPrice = ethers.parseEther("0.1");

      await eventTicketing.createEvent(
        name,
        dateTimestamp,
        location,
        imageCoverUri,
        ticketLimit,
        ticketPrice
      );
      // Assuming a ticket with ID 0 has been purchased for an event with ID 0
      const ticketId = 0;
      const eventId = 0;
      const quantity = 2;

      // Calculate total price for the tickets
      const totalPrice = ticketPrice * BigInt(quantity);
      await eventTicketing
        .connect(addr1)
        .purchaseTickets(eventId, quantity, { value: totalPrice });

      await expect(eventTicketing.useTicket(ticketId, eventId))
        .to.emit(eventTicketing, "TicketUsed")
        .withArgs(ticketId, eventId);
    });
    it("Should fail when non-owner tries to mark a ticket as used", async function () {
      const { eventTicketing, owner, addr1 } = await loadFixture(
        deployEventTicketingFixture
      );

      // Create an event first
      const name = "Test Event";
      const dateTimestamp = (await time.latest()) + 24 * 60 * 60; // One day from now
      const location = "Test Location";
      const imageCoverUri = "testUri";
      const ticketLimit = 100;
      const ticketPrice = ethers.parseEther("0.1");

      await eventTicketing.createEvent(
        name,
        dateTimestamp,
        location,
        imageCoverUri,
        ticketLimit,
        ticketPrice
      );
      // Assuming a ticket with ID 0 has been purchased for an event with ID 0
      const ticketId = 0;
      const eventId = 0;
      const quantity = 2;

      // Calculate total price for the tickets
      const totalPrice = ticketPrice * BigInt(quantity);
      await eventTicketing
        .connect(addr1)
        .purchaseTickets(eventId, quantity, { value: totalPrice });

      await expect(
        eventTicketing.connect(addr1).useTicket(ticketId, eventId)
      ).to.revertedWithCustomError(
        eventTicketing,
        "OwnableUnauthorizedAccount"
      );
    });
    it("Should fail when trying to use a ticket that has already been used", async function () {
      const { eventTicketing, owner, addr1 } = await loadFixture(
        deployEventTicketingFixture
      );

      // Create an event first
      const name = "Test Event";
      const dateTimestamp = (await time.latest()) + 24 * 60 * 60; // One day from now
      const location = "Test Location";
      const imageCoverUri = "testUri";
      const ticketLimit = 100;
      const ticketPrice = ethers.parseEther("0.1");

      await eventTicketing.createEvent(
        name,
        dateTimestamp,
        location,
        imageCoverUri,
        ticketLimit,
        ticketPrice
      );
      // Assuming a ticket with ID 0 has been purchased for an event with ID 0
      const ticketId = 0;
      const eventId = 0;
      const quantity = 2;

      // Calculate total price for the tickets
      const totalPrice = ticketPrice * BigInt(quantity);
      await eventTicketing
        .connect(addr1)
        .purchaseTickets(eventId, quantity, { value: totalPrice });

      await eventTicketing.useTicket(ticketId, eventId);

      await expect(eventTicketing.useTicket(ticketId, eventId)).to.revertedWith(
        "Ticket already used"
      );
    });
    it("Should fail when trying to use a ticket with non-existent event ID", async function () {
      const { eventTicketing, owner, addr1 } = await loadFixture(
        deployEventTicketingFixture
      );

      // Create an event first
      const name = "Test Event";
      const dateTimestamp = (await time.latest()) + 24 * 60 * 60; // One day from now
      const location = "Test Location";
      const imageCoverUri = "testUri";
      const ticketLimit = 100;
      const ticketPrice = ethers.parseEther("0.1");

      await eventTicketing.createEvent(
        name,
        dateTimestamp,
        location,
        imageCoverUri,
        ticketLimit,
        ticketPrice
      );
      // Assuming a ticket with ID 0 has been purchased for an event with ID 0
      const ticketId = 0;
      const eventId = 0;
      const quantity = 2;
      const wrongEventId = 1;

      // Calculate total price for the tickets
      const totalPrice = ticketPrice * BigInt(quantity);
      await eventTicketing
        .connect(addr1)
        .purchaseTickets(eventId, quantity, { value: totalPrice });

      await expect(
        eventTicketing.useTicket(ticketId, wrongEventId)
      ).to.revertedWith("Event does not exist");
    });
    it("Should fail when trying to use a ticket that not belong to the event", async function () {
      const { eventTicketing, owner, addr1 } = await loadFixture(
        deployEventTicketingFixture
      );

      // Create an event first
      const name = "Test Event";
      const dateTimestamp = (await time.latest()) + 24 * 60 * 60; // One day from now
      const location = "Test Location";
      const imageCoverUri = "testUri";
      const ticketLimit = 100;
      const ticketPrice = ethers.parseEther("0.1");

      await eventTicketing.createEvent(
        name,
        dateTimestamp,
        location,
        imageCoverUri,
        ticketLimit,
        ticketPrice
      );
      await eventTicketing.createEvent(
        name,
        dateTimestamp,
        location,
        imageCoverUri,
        ticketLimit,
        ticketPrice
      );
      // Assuming a ticket with ID 0 has been purchased for an event with ID 0
      const ticketId = 0;
      const eventId = 0;
      const quantity = 2;
      const wrongEventId = 1;

      // Calculate total price for the tickets
      const totalPrice = ticketPrice * BigInt(quantity);
      await eventTicketing
        .connect(addr1)
        .purchaseTickets(eventId, quantity, { value: totalPrice });

      await expect(
        eventTicketing.useTicket(ticketId, wrongEventId)
      ).to.revertedWith("Ticket does not belong to the event");
    });
  });

  describe("Viewing Events and Tickets", function () {
    it("Should allow users to view all events", async function () {
      const { eventTicketing } = await loadFixture(deployEventTicketingFixture);
      // Create an event first
      const name = "Test Event";
      const dateTimestamp = (await time.latest()) + 24 * 60 * 60; // One day from now
      const location = "Test Location";
      const imageCoverUri = "testUri";
      const ticketLimit = 100;
      const ticketPrice = ethers.parseEther("0.1");

      await eventTicketing.createEvent(
        name,
        dateTimestamp,
        location,
        imageCoverUri,
        ticketLimit,
        ticketPrice
      );
      const events = await eventTicketing.viewAllEvents();
      expect(events).to.be.an("array");
      // Add more specific checks on the events array
    });

    it("Should allow users to view only openning events", async function () {
      const { eventTicketing } = await loadFixture(deployEventTicketingFixture);
      // Create an event first
      const name = "Test Event";
      const dateTimestamp = (await time.latest()) + 24 * 60 * 60; // One day from now
      const location = "Test Location";
      const imageCoverUri = "testUri";
      const ticketLimit = 100;
      const ticketPrice = ethers.parseEther("0.1");

      await eventTicketing.createEvent(
        name,
        dateTimestamp,
        location,
        imageCoverUri,
        ticketLimit,
        ticketPrice
      );
      await eventTicketing.createEvent(
        name,
        dateTimestamp,
        location,
        imageCoverUri,
        ticketLimit,
        ticketPrice
      );
      await eventTicketing.toggleEvent(1, true);
      const events = await eventTicketing.viewOpenEvents();
      expect(events).to.have.lengthOf(1);
      // Add more specific checks on the events array
    });

    it("Should allow users to view their own tickets", async function () {
      const { eventTicketing, addr1 } = await loadFixture(
        deployEventTicketingFixture
      );
      // Create an event first
      const name = "Test Event";
      const dateTimestamp = (await time.latest()) + 24 * 60 * 60; // One day from now
      const location = "Test Location";
      const imageCoverUri = "testUri";
      const ticketLimit = 100;
      const ticketPrice = ethers.parseEther("0.1");

      await eventTicketing.createEvent(
        name,
        dateTimestamp,
        location,
        imageCoverUri,
        ticketLimit,
        ticketPrice
      );
      // Assuming addr1 has purchased tickets
      const tickets = await eventTicketing.connect(addr1).viewUserTickets();
      expect(tickets).to.be.an("array");
      // Add more specific checks on the tickets array
    });

    // Additional tests for viewing events and tickets
  });

  describe("Contract's Ethers", function () {
    it("should return 0 when contract has no balance", async function () {
      const { eventTicketing } = await loadFixture(deployEventTicketingFixture);
      expect(await eventTicketing.viewETHBalance()).to.equal(0);
    });

    it("should return correct balance when contract has Ether", async function () {
      const { eventTicketing, owner, addr1 } = await loadFixture(
        deployEventTicketingFixture
      );
      // Create an event first
      const name = "Test Event";
      const dateTimestamp = (await time.latest()) + 24 * 60 * 60; // One day from now
      const location = "Test Location";
      const imageCoverUri = "testUri";
      const ticketLimit = 100;
      const ticketPrice = ethers.parseEther("0.1");

      await eventTicketing.createEvent(
        name,
        dateTimestamp,
        location,
        imageCoverUri,
        ticketLimit,
        ticketPrice
      );
      // Assuming the first event has ID 0
      const eventId = 0;
      const quantity = 2;

      // Calculate total price for the tickets
      const totalPrice = ticketPrice * BigInt(quantity);

      await eventTicketing
        .connect(addr1)
        .purchaseTickets(eventId, quantity, { value: totalPrice });

      expect(await eventTicketing.viewETHBalance()).to.equal(totalPrice);
    });
    it("should only be callable by owner", async function () {
      const { eventTicketing, addr1 } = await loadFixture(
        deployEventTicketingFixture
      );
      await expect(
        eventTicketing.connect(addr1).withdrawAll()
      ).to.be.revertedWithCustomError(
        eventTicketing,
        "OwnableUnauthorizedAccount"
      );
    });

    it("should withdraw all Ether to owner", async function () {
      const { eventTicketing, owner, addr1 } = await loadFixture(
        deployEventTicketingFixture
      );
      // Create an event first
      const name = "Test Event";
      const dateTimestamp = (await time.latest()) + 24 * 60 * 60; // One day from now
      const location = "Test Location";
      const imageCoverUri = "testUri";
      const ticketLimit = 100;
      const ticketPrice = ethers.parseEther("0.1");

      await eventTicketing.createEvent(
        name,
        dateTimestamp,
        location,
        imageCoverUri,
        ticketLimit,
        ticketPrice
      );
      // Assuming the first event has ID 0
      const eventId = 0;
      const quantity = 2;

      // Calculate total price for the tickets
      const totalPrice = ticketPrice * BigInt(quantity);

      await eventTicketing
        .connect(addr1)
        .purchaseTickets(eventId, quantity, { value: totalPrice });

      await eventTicketing.withdrawAll();
      const finalContractBalance = await eventTicketing.viewETHBalance();
      expect(finalContractBalance).to.equal(0);
    });
  });
});
