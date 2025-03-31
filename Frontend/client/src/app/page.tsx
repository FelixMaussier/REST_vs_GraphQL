import React from 'react';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import CardREST from './components/CardREST';
import CardGraphQL from './components/CardGraphQL';

export default function Page() {
  return (
    <div className="page-container">
      < Header />
      <h1>Welcome to the REST vs. GraphQL Comparison</h1>


      <div className="card-container">
        <div className="cardREST">
          <CardREST />
        </div>
        <div className='cardGraphQL'>
          <CardREST />
        </div>
      </div>




      < Footer />
    </div>
  );
}