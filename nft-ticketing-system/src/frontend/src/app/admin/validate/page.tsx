"use client";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import React, { useState } from "react";
import { useWeb3ModalSigner } from "@web3modal/ethers5/react";
import { contractAddress } from "@/lib/contract";
import { TicketX__factory } from "@/lib/typechain";
import { useEvents } from "@/context/EventContext";
import { ethers } from "ethers";
import Modal from "@/components/Modal";
export default function Validate() {
  const { events, setEvents } = useEvents();
  const { signer } = useWeb3ModalSigner();
  const [eventID, setEventID] = useState<number>();
  const [ticketID, setTicketID] = useState<number>();
  const [txID, setTxID] = useState("");
  const [isTxProcessing, setIsTxProcessing] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);
  const [txError, setTxError] = useState("");

  const mainContract = TicketX__factory.connect(contractAddress, signer!);
  async function handleUseTicket() {
    if (eventID === undefined || ticketID === undefined) {
      alert("Please fill in all the fields");
      return;
    }
    try {
      setIsTxProcessing(true);
      setTxError("");
      setTxSuccess(false);
      const modal = document.getElementById("my_modal_1");
      if (modal instanceof HTMLDialogElement) {
        modal.showModal();
      }
      const eventIDBigNumber = ethers.BigNumber.from(eventID);
      const ticketIDBigNumber = ethers.BigNumber.from(ticketID);
      const tx = await mainContract.useTicket(
        ticketIDBigNumber,
        eventIDBigNumber
      );
      setTxID(tx.hash);
      await tx.wait();
      setIsTxProcessing(false);
      setTxSuccess(true);
    } catch (error: any) {
      console.error("Error purchasing tickets:", error);
      setIsTxProcessing(false);
      setTxError(error.message);
    }
  }
  return (
    <div className="min-h-screen ">
      <Navigation />
      <div className="py-8 md:px-36">
        <p className="text-xl font-bold mb-8 text-center">Use Ticket</p>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Event ID</span>
          </label>
          <input
            type="number"
            placeholder="Event ID"
            className="input input-bordered"
            onChange={(e) => setEventID(Number(e.target.value))}
            value={eventID}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Ticket ID</span>
          </label>
          <input
            type="number"
            placeholder="Ticket ID"
            className="input input-bordered"
            onChange={(e) => setTicketID(Number(e.target.value))}
            value={ticketID}
          />
        </div>
        <button
          className="btn btn-primary mt-4 w-full"
          onClick={handleUseTicket}
        >
          Use Ticket
        </button>
      </div>
      <Footer />
      <Modal
        isTxProcessing={isTxProcessing}
        txSuccess={txSuccess}
        txError={txError}
        txID={txID}
      />
    </div>
  );
}
