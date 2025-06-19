'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Navbar.module.css';

type ActiveType = 'Transaction' | 'Dashboard' | 'Goal' | 'Budget' | 'Home' | 'Invoice';

const Navbar = ({ active }: { active: ActiveType }) => {
    const [auth, isAuth] = useState(false);
    const [tabs, setTabs] = useState<{ name: string, path: string }[]>([]);
    const preTabs = [
        { name: 'Home', path: `` },
        { name: 'Budget', path: `/budget` },
        { name: 'Transaction', path: `/input` },
        { name: 'Goal', path: `/goal` },
        { name: 'Invoice', path: `/invoice` },
        { name: 'Dashboard', path: `/dashboard` },
    ];

    useEffect(() => {
        const email = localStorage.getItem('email');
        const password = localStorage.getItem('password');
        if (email && password) {
            isAuth(true);
            setTabs(preTabs);
        } else {
            setTabs(preTabs);
            isAuth(true);
        }

    }, []);

    return (
        <nav className={styles.navbar}>
            {/* DESKTOP MENU */}
            <div className={styles.navbarWrapper}>
                <h3 className={styles.logoText}>BUDGETEASE</h3>
                <div className={styles.innerWrapper}>
                    <DesktopMenu tabs={tabs} active={active} />
                </div>
                <div className={styles.authLinksContainer}>
                    <Link href={`/login`} className={`${styles.authLink} ${styles.signIn}`}>
                        Sign In
                    </Link>
                    <Link href={`/register`} className={`${styles.authLink} ${styles.signUp}`}>
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
};

const DesktopMenu = ({ tabs, active }: { tabs: { name: string, path: string }[], active: ActiveType }) => {
    return (
        <div className={styles.desktopMenuContainer}>
            <ul className={styles.tabsList}>
                {tabs.map((tab) => (
                    <TabDesktop key={tab.name} active={active === tab.name} href={tab.path}>
                        {tab.name}
                    </TabDesktop>
                ))}
            </ul>
        </div>
    );
};

const TabDesktop = ({
    children,
    href,
    active,
}: {
    children: React.ReactNode,
    href: string,
    active: boolean,
}) => {
    return (
        <li className={styles.tabItem}>
            <Link href={href} className={`${styles.link} ${active ? styles.linkActive : ''}`}>
                {children}
            </Link>
        </li>
    );
};

export default Navbar;
