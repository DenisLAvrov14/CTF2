import React from 'react';
import Image from 'next/image';
import styles from './market.module.scss';
import { NextPage } from 'next';
import MarketSidebar from '@/components/MarketSidebar';
import { IProduct } from '@/index';
import iconCart from '../../../public/Icons-basket.svg'
import iconPrice from '../../../public/icons-price.svg'
import UserInfo from '@/components/UserInfo';
import MarketHeader from '@/components/MarketHeader';


//Пример data для карточек продуктов
const products = [
  {
    image: '/anubis.png',
    alt: 'Product 1',
    name: 'AK-47',
    price: '454,98',
    sellers: [
      {
        image: '/box.svg',
        alt: '',
        count: 16,
      },
    ],
  },
];

const ProductCard: React.FC<{ product: IProduct }> = ({ product }) => {
  return (
    <div className={styles.card}>

      <div>
        <Image className={styles.productImg} src={product.image} alt={product.alt} width={200} height={200} />
      </div>

      <div className={styles.title}>
        <h3>{product.name}</h3>
      </div>

      <div className={styles.price}>
        <span>
          {product.price}
        </span>
        <Image src={iconPrice} alt='iconPrice' width={20} height={20} />
      </div>

      <button type="button" className={styles.buying}>
        <Image src={iconCart} alt='icon-basket' width={29} height={29} />
        <p>Add to cart</p>
      </button>
    </div>
  );
};
const MarketPage: NextPage = () => {
  const renderCards = () => {
    const cards: JSX.Element[] = [];
    for (let i = 0; i < 20; i++) {
      cards.push(<ProductCard key={i} product={products[i % products.length]} />);
    }
    return cards;
  };

  return (
    <div className={styles.mainContainer}>
      <div className="flex">
        <div className={styles.aside}>
          <UserInfo />
          <MarketSidebar />
        </div>
        <section className="">
          <MarketHeader />
          <div className={styles.textCenter}>
            <div className={styles.container}>{renderCards()}</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MarketPage;
