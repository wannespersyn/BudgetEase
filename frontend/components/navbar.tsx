import React from 'react';
import Link from 'next/link';
import styles from '../styles/Navbar.module.css';

type ActiveType = 'Transaction' | 'Dashboard' | 'Input' | 'Budget' | 'Reports' | 'Home';

const Navbar = ({ active }: { active: ActiveType }) => {
    const tabs = [
        { name: 'Home', path: '/' },
        { name: 'Input', path: '/input.html' },
        { name: 'Budget', path: '/budget.html' },
        { name: 'Reports', path: '/reports.html' },
        { name: 'Transaction', path: '/input.html' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: "Login", path: "/login" },
    ];

    return (
        <nav className={styles.navbar}>
            {/* DESKTOP MENU */}
            <div className={styles.navbarWrapper}>
                <div className={styles.innerWrapper}>
                    <DesktopMenu tabs={tabs} active={active} />
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
