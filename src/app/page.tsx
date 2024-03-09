import { About } from "./components/About";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Scott Key</h1>
      <div>demos</div>
      <div>resume</div>
      <About />
      <div>contact</div>
    </main>
  );
}
