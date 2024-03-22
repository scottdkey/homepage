"use client";
import { Accordion, AccordionItem } from "./components/Accordion/Accordion";
import styles from "./page.module.css";
import { About } from "./components/About";
import { Projects } from "./components/Projects/Projects";
import { Contact } from "./components/Contact/Contact";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 id={styles.title}>Scott Key</h1>
      <h3 id={styles.blerb}>
        Fullstack developer who loves to build large complex services.
      </h3>
      <Accordion>
        <AccordionItem label="about">
          <About />
        </AccordionItem>
        <AccordionItem label="projects">
          <Projects />
        </AccordionItem>
        <AccordionItem label="contact">
          <Contact />
        </AccordionItem>
      </Accordion>
    </main>
  );
}
