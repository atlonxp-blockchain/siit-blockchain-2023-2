"use client";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import React, { useState } from "react";
import { useWeb3ModalSigner } from "@web3modal/ethers5/react";
import { contractAddress } from "@/lib/contract";
import { TicketX__factory } from "@/lib/typechain";
import { FaCalendarAlt, FaEthereum } from "react-icons/fa";
import Link from "next/link";
import useSWR from "swr";
import axios from "axios";
import { ethers } from "ethers";
import Image from "next/image";
import moment from "moment";
import { FaLocationDot } from "react-icons/fa6";
import { covertEventToEventData } from "@/utils/event";
import Modal from "@/components/Modal";

export default function Admin() {
  const { signer } = useWeb3ModalSigner();
  const [txID, setTxID] = useState("");
  const [isTxProcessing, setIsTxProcessing] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);
  const [txError, setTxError] = useState("");
  const { data: ethPrice } = useSWR("ethPrice", async () => {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=thb"
      );
      return Number(response.data.ethereum.thb);
    } catch (error) {
      console.error("Error fetching ETH price:", error);
    }
  });
  const { data: ethBalance } = useSWR("balance", async () => {
    try {
      const balance = await mainContract.viewETHBalance();
      return Number(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  });
  const { data: allEvents } = useSWR("allEvents", async () => {
    try {
      const events = await mainContract.viewAllEvents();
      const mockEvents = covertEventToEventData(events);
      return mockEvents;
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  });
  const mainContract = TicketX__factory.connect(contractAddress, signer!);
  async function handleWithdraw() {
    try {
      setIsTxProcessing(true);
      setTxError("");
      setTxSuccess(false);
      const modal = document.getElementById("my_modal_1");
      if (modal instanceof HTMLDialogElement) {
        modal.showModal();
      }
      const tx = await mainContract.withdrawAll();
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
  async function handleToggleEvent(id: number, isClosed: boolean) {
    try {
      setIsTxProcessing(true);
      setTxError("");
      setTxSuccess(false);
      const modal = document.getElementById("my_modal_1");
      if (modal instanceof HTMLDialogElement) {
        modal.showModal();
      }
      const tx = await mainContract.toggleEvent(id, isClosed);
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
        {ethBalance !== undefined && (
          <div className="text-xl font-bold mb-8 text-center ">
            Current Balance: {ethBalance} ETH (~
            {((ethPrice || 0) * (ethBalance || 0) || 0).toFixed(2)}
            THB)
          </div>
        )}
        {ethBalance === undefined && (
          <div className="text-xl font-bold mb-8 text-center ">
            Current Balance:
            <div className="mt-10 w-full flex justify-center">
              <span className="loading loading-dots loading-lg text-primary"></span>
            </div>
          </div>
        )}
        <div className="w-full flex justify-center items-center mb-16">
          <button
            className="btn btn-outline btn-primary"
            onClick={handleWithdraw}
          >
            Claim All
          </button>
        </div>
        <div className="w-full flex justify-center items-center gap-4">
          <Link href="/admin/event">
            <button className="btn btn-primary">Create Event</button>
          </Link>
          <Link href="/admin/validate">
            <button className="btn btn-primary">Use Ticket</button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 mt-6">
          {allEvents &&
            allEvents.map((event) => (
              <div
                className="w-full flex justify-start items-center "
                key={event.id}
              >
                {event.imageCoverUri.search("http") === 0 && (
                  <Image
                    src={event.imageCoverUri}
                    alt={event.name}
                    width={253}
                    height={253}
                    objectFit="cover"
                    className="max-w-[253px] max-h-[253px] overflow-hidden"
                  />
                )}
                {event.imageCoverUri.search("http") !== 0 && (
                  <div className="w-[253px] h-[253px] bg-slate-200 bg-opacity-20"></div>
                )}
                <div className="flex flex-col gap-2 ml-6">
                  <h2 className="text-xl font-bold text-white text-opacity-80">
                    {event.name}
                  </h2>
                  <div className="flex items-center text-xl font-normal gap-3 ">
                    <FaLocationDot />
                    <p className="text-white text-opacity-80">
                      {event.location}
                    </p>
                  </div>
                  <div className="flex items-center text-xl font-normal gap-3 ">
                    <FaCalendarAlt />
                    <p className="text-white text-xl font-normal text-opacity-80">
                      {moment(event.dateTimestamp * 1000).format("LL")}
                    </p>
                  </div>
                  <div className="border border-slate-100 border-opacity-80 p-5 text-xl">
                    <div className="flex items-center">
                      <p className="text-white text-opacity-80">
                        Price: {ethers.utils.formatEther(event.ticketPrice)}
                      </p>
                      <FaEthereum className="text-white text-opacity-80" />
                    </div>
                    <p className="text-white text-opacity-80 mt-2">
                      Amount: {event.ticketLimit - event.ticketsIssued}/
                      {event.ticketLimit}
                    </p>
                  </div>
                  <div className="form-control w-52">
                    <label className="cursor-pointer label">
                      <span className="label-text text-lg">Status</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={!event.isClosed}
                        onChange={() =>
                          handleToggleEvent(event.id, !event.isClosed)
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          {!allEvents && (
            <div className="w-full flex justify-center items-center">
              <div className="mt-10 w-full flex justify-center">
                <span className="loading loading-dots loading-lg text-primary"></span>
              </div>
            </div>
          )}
        </div>
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
