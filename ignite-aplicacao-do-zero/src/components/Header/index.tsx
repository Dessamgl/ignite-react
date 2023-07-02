import Link from 'next/link';

import style from './header.module.scss';

export default function Header() {
  return (
    <header className={style.headerContainer}>
      <div className={style.headerContent}>
        <Link href="/">
          <a>
            <img src="/logo.svg" alt="logo" />
          </a>
        </Link>
      </div>
    </header>
  );
}
