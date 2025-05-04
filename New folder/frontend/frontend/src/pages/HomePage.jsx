import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => (
  <div className="header">
    <div className="logo">ORDERMADE</div>
    <div className="auth">
      <button className="btn">Register</button>
      <button className="btn">Log in</button>
    </div>
  </div>
);

const SearchBar = () => (
  <div className="search-bar">
    <input type="text" placeholder="Search for fashion designers, services, etc" />
  </div>
);

const Carousel = () => (
  <div className="carousel">
    <h1>Discover Customized Needs</h1>
    <p>Find your potential Designer you wanted to work with</p>
  </div>
);

const FeaturedUser = () => (
  <div className="featured-user">
    <img src="profilepic.png" alt="User" />
    <h3>DISPLAY NAME</h3>
    <p>@Username</p>
  </div>
);

const FeaturedService = () => (
  <div className="featured-services">
    <img src="service.png" alt="Service" />
    <div className="info">
      <h3>Featured Services</h3>
      <p>Category: Category_name</p>
      <p>From: $100</p>
      <p>Description</p>
    </div>
  </div>
);

const ExploreSection = () => (
  <div className="explore-section">
    <h2>Explore Services</h2>
  </div>
);

const HomePage = () => {
  return (
    <div>
      <Header />
      <SearchBar />
      <Carousel />
      <div className="featured-section">
        <FeaturedUser />
        <FeaturedService />
      </div>
      <ExploreSection />
    </div>
  );
};

export default HomePage;
