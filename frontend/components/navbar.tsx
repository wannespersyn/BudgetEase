import React from 'react'
import Link from 'next/link'

type ActiveType = 'Transaction' | 'Dashboard' | 'Input' | 'Budget' | 'Reports' | 'Home';

const Navbar = ({ active }: { active: ActiveType }) => {

    const tabs = [
        { name: 'Home', path: '/' },
        { name: 'Input', path: '/input' },
        { name: 'Budget', path: '/budget' },
        { name: 'Reports', path: '/reports' },
        { name: 'Transaction', path: '/input' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: "Login", path: "/login" },
    ];

    return (
        <nav>
            {/* DESKTOP MENU */}
            <div className="w-full z-10">
                <div className={`flexBetween mx-auto w-full sticky bg-gray-900 text-white`}>
                    <div className="flexBetween w-full gap-16 p-3 mx-12 lg:mx-24">
                        <DesktopMenu tabs={tabs} active={active} />
                    </div>
                </div>
            </div>
        </nav>
    );
};

/**
 * This is the component for the desktop menu.
 * 
 * @param tabs
 * @param active
 * @returns 
 */
const DesktopMenu = ({ tabs, active }: { tabs: { name: string, path: string }[], active: ActiveType }) => {
    return (
        <div className="relative flex items-center justify-center w-full">
            {/* Tabs */}
            <ul className="relative flex gap-8 text-xl text-white">
                {tabs.map((tab) => (
                    <TabDesktop key={tab.name} active={active === tab.name} href={tab.path} >
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
        <li 
            className="relative z-10 block cursor-pointer px-3 py-1.5 uppercase font-mono lg:text-2xl"
        >
            <Link href={href} className={`mix-blend-difference ${active ? 'border-b-2 border-accent' : ''}`}>
                {children}
            </Link>
        </li>
    );
};


export default Navbar;
