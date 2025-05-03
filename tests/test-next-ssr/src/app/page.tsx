'use client'

import '../libs/cssfn-preload'

import Image from "next/image";
import styles from "./page.module.css";

import { dynamicStyleSheet } from '@cssfn/cssfn-react'
import { style } from '@cssfn/core'
// import './styles/styleSheet2'



// const useStyleSheet1 = dynamicStyleSheet(
//     () => style({
//         '--sheet1': '"sheet1"',
//         color: 'red',
//     })
// , { id: 'sheet-1' });

const useStyleSheet2 = dynamicStyleSheet(
  () => import(/* webpackChunkName: 'sheet-2' */ /* webpackPreload: true */ './styles/styleSheet2')
  // styleSheet2
, { id: 'sheet-2' });



export default function Home() {
  // const sheet1 = useStyleSheet1();
  const sheet2 = useStyleSheet2();
  
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* <button className={sheet1.main}>button 1</button> */}
        <button className={sheet2.main}>button 2</button>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
