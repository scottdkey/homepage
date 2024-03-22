import Image from "next/image";
import LinkedInLogo from "../images/LinkedIn_icon.svg";
import GitHubMark from "../images/github-mark/github-mark-white.svg";
import styles from "./Contact.module.css";
import { handleEmailFormSubmit } from "../lib/sendContactEmail";
import { useState } from "react";

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  return (
    <>
      <div className={styles.container}>
        <a
          href={"https://linkedin.com/in/scottdkey"}
          className={`${styles.linkedinButton} ${styles.profileButton}`}
          target="_blank"
        >
          <Image
            className={styles.logoImage}
            src={LinkedInLogo}
            alt="linkedin logo"
            width={40}
            height={40}
          />
          <div className={styles.btnText}>Profile</div>
        </a>
        <a
          href={"https://github.com/scottdkey"}
          className={`${styles.githubButton} ${styles.profileButton}`}
          target="_blank"
        >
          <Image
            className={`${styles.githubLogoOffset} ${styles.logoImage}`}
            src={GitHubMark}
            alt="linkedin logo"
            width={30}
            height={30}
          />
          <div className={styles.btnText}>Github</div>
        </a>
      </div>
      {submitted ? (
        <div className={styles.submittedArea}>
          <h3 className={styles.submittedTitle}>email sent</h3>
          <button
            className={`${styles.btn}`}
            onClick={() => setSubmitted(false)}
          >
            send another
          </button>
        </div>
      ) : (
        <form
          className={styles.emailForm}
          action={async (formData) => {
            await handleEmailFormSubmit(formData);
            formData.set("firstName", "");
            formData.set("lastName", "");
            formData.set("email", "");
            formData.set("body", "");
          }}
          onSubmit={() => setSubmitted(true)}
        >
          <label htmlFor="firstName" className={`${styles.inputLabel}`}>
            first name
          </label>
          <input name="firstName" className={styles.standardInput} required />
          <span className={styles.firstNameValid}></span>
          <label htmlFor="lastName" className={styles.inputLabel}>
            last name
          </label>
          <input name="lastName" className={styles.standardInput} required />
          <span className={styles.lastNameValid}></span>
          <label htmlFor="email" className={styles.inputLabel}>
            email
          </label>
          <input
            type="email"
            name="email"
            className={styles.standardInput}
            required
          />
          <span className={styles.emailValid}></span>
          <label className={styles.inputLabel}>message</label>
          <textarea
            name="body"
            className={`${styles.standardInput} ${styles.bodyInput}`}
            required
          />
          <span className={styles.bodyValid}></span>
          <button
            type="submit"
            className={`${styles.btn} ${styles.submitButton}`}
          >
            submit
          </button>
        </form>
      )}
    </>
  );
};
