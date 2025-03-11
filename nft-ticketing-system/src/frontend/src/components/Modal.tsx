import Link from "next/link";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";

interface ModalProps {
  isTxProcessing: boolean;
  txSuccess: boolean;
  txError: string;
  txID: string;
}

export default function Modal({
  isTxProcessing,
  txSuccess,
  txError,
  txID,
}: ModalProps) {
  console.log(txError);
  return (
    <dialog id="my_modal_1" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg">Transaction Status</h3>
        <div className="mt-4 mb-4 text-2xl">
          {isTxProcessing && (
            <span className="loading loading-dots loading-lg"></span>
          )}
          {txSuccess === true && !isTxProcessing && (
            <div className="w-full flex justify-center items-center">
              Transaction Success
              <FaCheckCircle className="text-success text-2xl" />
            </div>
          )}
          {txError !== "" && !isTxProcessing && (
            <div className="w-full flex justify-center items-center">
              Transaction Error
              <MdError className="text-error text-2xl" />
            </div>
          )}
        </div>

        <Link
          href={`https://goerli.etherscan.io/tx/${txID}`}
          target="_blank"
          className="truncate mt-4"
        >
          Etherscan: {txID}
        </Link>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
