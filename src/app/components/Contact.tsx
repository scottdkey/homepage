import Image from "next/image";
import LinkedInLogo from "../images/LinkedIn_icon.svg";
import GitHubLogo from "../images/GitHub_Logo_White.png";
import GitHubMark from "../images/github-mark/github-mark-white.svg";
import "./Contact.css";

export const Contact = () => {
  return (
    <div className="container">
      <a
        href={"https://linkedin.com/in/scottdkey"}
        className="linkedin-button profile-button"
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
        className="github-button profile-button"
        target="_blank"
      >
        <Image
          className="github-logo-offset logo-image"
          src={GitHubMark}
          alt="linkedin logo"
          width={30}
          height={30}
        />
        <div className="btn-text">GitHub</div>
      </a>
    </div>
  );
};
