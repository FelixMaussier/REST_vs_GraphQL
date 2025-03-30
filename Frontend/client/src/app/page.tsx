import React from 'react';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

export default function Page() {
  return (
    <div className="page-container">
      < Header />
      <h1>Welcome to the REST vs. GraphQL Comparison</h1>
      < Footer />
    </div>
  );
}