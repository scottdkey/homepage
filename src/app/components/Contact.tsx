import Image from "next/image";
import LinkedInLogo from "../images/LinkedIn_icon.svg";
import "./Contact.css";

export const Contact = () => {
  return (
    <div className="container">
      <a
        href={"https://linkedin.com/in/scottdkey"}
        className="linkedin-button"
        target="_blank"
      >
        <Image
          className="logo-image"
          src={LinkedInLogo}
          alt="linkedin logo"
          width={40}
          height={40}
        />
        <div className="btn-text">Profile</div>
      </a>
      <a
        href={"https://github.com/scottdkey"}
        className="linkedin-button"
        target="_blank"
      >
        <Image
          className="logo-image"
          src={LinkedInLogo}
          alt="linkedin logo"
          width={40}
          height={40}
        />
        <div className="btn-text">Github</div>
      </a>
    </div>
  );
};
