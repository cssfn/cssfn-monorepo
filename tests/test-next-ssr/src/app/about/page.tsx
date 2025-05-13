import styles from "../page.module.css";

// import { TestClientComponent } from '../TestClientComponent'
// import { TestServerComponent } from '../TestServerComponent'
import { TestClientComponent2 } from '../TestClientComponent-2'
import { TestServerComponent2 } from '../TestServerComponent-2'



export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* <TestClientComponent />
        <TestServerComponent /> */}
        <TestClientComponent2 />
        <TestServerComponent2 />
      </main>
    </div>
  );
}
