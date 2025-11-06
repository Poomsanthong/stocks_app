import React from "react";

const FooterLink = ({ text, linkText, href }: FooterLinkProps) => {
  return (
    <div className="text-center pt-4">
      <p className="text-sm text-gray-500">
        {text}{" "}
        <a href={href} className="text-yellow-500">
          {linkText}
        </a>
      </p>
    </div>
  );
};

export default FooterLink;
