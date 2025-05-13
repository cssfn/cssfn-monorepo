import styles from "./page.module.css";

import { TestClientComponent } from './TestClientComponent'
import { TestServerComponent } from './TestServerComponent'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <TestClientComponent />
        <TestServerComponent />
      </main>
    </div>
  );
}
