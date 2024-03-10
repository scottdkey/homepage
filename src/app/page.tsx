"use client";
import { useState } from "react";
import { Accordion, AccordionItem } from "./components/Accordion/Accordion";
import styles from "./page.module.css";
import { About } from "./components/About";
import { Projects } from "./components/Projects";
import { Contact } from "./components/Contact";

export default function Home() {
  const [active, setActive] = useState<number>(0);
  return (
    <main className={styles.main}>
      <h1>Scott Key</h1>
      <h3>this page is currently under construction</h3>
      <Accordion>
        <AccordionItem
          label="about"
          handleClick={() => setActive(1)}
          active={active === 1}
        >
          <About />
        </AccordionItem>
        <AccordionItem
          label="projects"
          handleClick={() => setActive(2)}
          active={active === 2}
        >
          <Projects />
        </AccordionItem>
        <AccordionItem
          label="contact"
          handleClick={() => setActive(3)}
          active={active === 3}
        >
          <Contact />
        </AccordionItem>
      </Accordion>
    </main>
  );
}
