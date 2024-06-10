import React from 'react';
import './NavItem.css';

function NavItem({ title, imageSrc, description }) {
  return (
    <div className="navItem">
      <img src={imageSrc} alt={title} className="navItem-image" />
      <div className="navItem-content">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default NavItem;
