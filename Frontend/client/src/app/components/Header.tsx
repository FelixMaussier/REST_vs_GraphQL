import React from 'react';
import '../styles/Header.css';
import Link from 'next/link';


export default function Header() {

    return (
        <header className="header">
            <div className="logo">
                <h1>REST vs. GraphQL</h1>
            </div>
            <nav>
                <ul className="nav-list">
                    <li><Link href="/RestPage">REST</Link></li>
                    <li><Link href="/graphPage">GraphQL</Link></li>
                    <li><Link href="/contact">Author</Link></li>
                </ul>
            </nav>
        </header>
    );
}
