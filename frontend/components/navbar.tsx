import React from 'react';
import Link from 'next/link';
import styles from '../styles/Navbar.module.css';

type ActiveType = 'Transaction' | 'Dashboard' | 'Input' | 'Budget' | 'Reports' | 'Home';

const Navbar = ({ active }: { active: ActiveType }) => {
    const tabs = [
        { name: 'Home', path: '/$web/index.html' },
        { name: 'Input', path: '/$web/input.html' },
        { name: 'Budget', path: '/$web/budget.html' },
        { name: 'Reports', path: '/$web/reports.html' },
        { name: 'Transaction', path: '/$web/input.html' },
        { name: 'Dashboard', path: '/$web/dashboard.html' },
        { name: "Login", path: "/$web/login.html" },
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
