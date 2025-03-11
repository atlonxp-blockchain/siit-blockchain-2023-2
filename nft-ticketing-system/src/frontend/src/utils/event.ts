import { EventData } from "@/context/EventContext";
import { EventTicketing } from "@/lib/typechain/TicketX";
import axios from "axios";
import { BigNumber, ethers } from "ethers";

export const createEventFormToWeb3 = (
  name: string,
  location: string,
  date: string,
  imageCoverUri: string,
  ticketLimit: number,
  ticketPrice: string
) => {
  if (
    !name ||
    !location ||
    !date ||
    !imageCoverUri ||
    !ticketLimit ||
    !ticketPrice
  ) {
    throw new Error("All fields are required");
  }
  console.log(ticketPrice);
  console.log(ticketPrice.toString());
  return {
    name,
    location,
    dateTimestamp: new Date(date).getTime() / 1000,
    imageCoverUri,
    ticketLimit: BigNumber.from(ticketLimit),
    ticketPrice: ethers.utils.parseEther(ticketPrice),
  };
};

export const ethPriceInTHB = async () => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=thb"
    );
    return Number(response.data.ethereum.thb) || 0;
  } catch (error) {
    console.error("Error fetching ETH price:");
    return 0;
  }
};

export const covertEventToEventData = (
  events: EventTicketing.EventStructOutput[]
) => {
  const mockEvents: EventData[] = events.map((event) => ({
    id: event.id.toNumber(),
    name: event.name,
    dateTimestamp: event.dateTimestamp.toNumber(),
    location: event.location,
    imageCoverUri: event.imageCoverUri,
    ticketLimit: event.ticketLimit.toNumber(),
    ticketsIssued: event.ticketsIssued.toNumber(),
    ticketPrice: event.ticketPrice.toNumber(),
    isClosed: event.isClosed,
  }));
  return mockEvents;
};
