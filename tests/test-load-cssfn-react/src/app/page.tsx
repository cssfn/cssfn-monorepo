'use client'

import styles from "./page.module.css";

import '@cssfn/cssfn-dom'
import './components/TestComponent1'
import { TestComponent2 } from './components/TestComponent2'
import { TestComponent3 } from './components/TestComponent3'
import { TestComponent4 } from './components/TestComponent4'
import { TestComponent5 } from './components/TestComponent5'
import { TestComponent6 } from './components/TestComponent6'


export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        test
        <TestComponent2 />
        <TestComponent3 />
        <TestComponent4 />
        <TestComponent5 />
        <TestComponent6 />
      </main>
    </div>
  );
}
