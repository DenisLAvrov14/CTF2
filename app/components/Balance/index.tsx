'use client';
import * as React from 'react';
import styles from './balance.module.scss';
import Image from 'next/image';
import iconPrice from '../../../public/icons-price.svg'
import currencyIcon from '../../../public/currencyIcon.svg'
import iconCart from '../../../public/Icons-basket.svg'

const Balance = () => {
  return (
    <div className={styles.cartBox}>
    <div className={styles.balance}>
      <div className={styles.balanceTitle}>
        <p className={styles.title}>Balance</p>
        <div className={styles.balanceCount}>
          <span>
            14.256
          </span>
          <Image src={iconPrice} alt='iconPrice' width={20} height={20} />
        </div>
      </div>
      <div className={styles.currencyIcon}>
        <Image src={currencyIcon} alt="currencyIcon"/>
      </div>
    </div>
    <div className={styles.cart}>
      <div className={styles.cartButtons}>
        <div className={styles.btnBorder}>
          <button className={styles.cartBtn} type="button">Сonclusion</button>
        </div>
        <div className={styles.btnBorder}>
          <button className={styles.cartBtn} type="button">Replenish</button>
        </div>
      </div>
      <div className={styles.cartIcon}>
        <Image src={iconCart} alt="currencyIcon" />
      </div>
    </div>
  </div>
  );
};

export default Balance;
