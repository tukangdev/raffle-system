import React from "react";
import { auth } from "../lib/firebase-client";

const Nav = () => (
  <nav className="w-full h-16 bg-primary">
    <div className=" space-x-6 flex flex-row justify-end items-center px-10 mx-auto h-full">
      <a
        className="text-white cursor-pointer"
        onClick={async () => {
          window.location.href = "/";
        }}
      >
        RAFFLE PAGE
      </a>
      <a
        className="text-white cursor-pointer"
        onClick={async () => {
          await auth.signOut();
          window.location.href = "/admin/login";
        }}
      >
        LOG OUT
      </a>
    </div>
  </nav>
);

export default Nav;
