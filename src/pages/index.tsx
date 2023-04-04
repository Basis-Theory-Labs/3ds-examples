import React from 'react';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';

const Home = () => (
  <div className={styles.container}>
    <main className={styles.main}>
      <div className={styles.link}>
        <Link href="/stripe">{'Stripe'}</Link>
      </div>
      <div className={styles.link}>
        <Link href="/adyen">{'Adyen'}</Link>
      </div>
      <div className={styles.link}>
        <Link href="/spreedly">{'Spreedly'}</Link>
      </div>
    </main>
  </div>
);

export default Home;
