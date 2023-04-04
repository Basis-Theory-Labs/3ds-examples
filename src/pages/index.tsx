import React from 'react';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';

const Home = () => (
  <div className={styles.container}>
    <main className={styles.main}>
      <div className={styles.link}>
        <Link href="/stripe">{'Test Stripe'}</Link>
      </div>
      <div className={styles.link}>
        <Link href="/adyen">{'Test Adyen'}</Link>
      </div>
    </main>
  </div>
);

export default Home;
