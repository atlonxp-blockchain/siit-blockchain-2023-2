import React from "react";

const Footer = () => {
  const contactList = [
    "Contact us \u00A0\u00A0\u00A0 info@example.com",
  ];

  return (
    <footer className="text-white backgroundMain text-center">
      <div className="mx-2 py-2">
        <div className="flex flex-col items-center text-lg">
          {contactList}
        </div>
      </div>
      <div className="backgroundMain p-4">
        <span>© 2023 Crowdfunding</span>
      </div>
    </footer>
  );
};

export default Footer;
