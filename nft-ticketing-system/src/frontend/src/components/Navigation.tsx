"use client";
import Link from "next/link";
import React from "react";

export default function Navigation() {
  return (
    <div className="navbar px-3 overflow-hidden">
      <div className="hidden md:flex md:flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          Web3 Ticket
        </Link>
      </div>
      <div className="flex-none gap-2 ">
        <Link href="/inventory" className="btn btn-ghost">
          Inventory
        </Link>
        <w3m-button />
      </div>
    </div>
  );
}
