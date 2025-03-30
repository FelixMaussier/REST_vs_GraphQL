import React from 'react';
import '../styles/Header.css';

export default function Header() {

    return (
        <header className="header">
            <div className="logo">
                <h1>REST vs. GraphQL</h1>
            </div>
            <nav>
                <ul className="nav-list">
                    <li><a href="/">REST</a></li>
                    <li><a href="/about">GraphQL</a></li>
                    <li><a href="/contact">Author</a></li>
                </ul>
            </nav>
        </header>
    );
}
