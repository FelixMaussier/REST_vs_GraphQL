import React from "react";
import '../styles/Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <p className="text">© 2025 REST vs. GraphQL</p>
                <div className="socialLinks">
                    <a href="https://www.diva-portal.org/smash/search.jsf?dswid=-2923" className="socialIcon"> Diva portal </a>
                </div>
            </div>
        </footer>

    );
}