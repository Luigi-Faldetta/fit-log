import React from 'react';
import './NavItem.css';

function NavItem({ title, imageSrc, onClick }) {
  return (
    <div className="navItem" onClick={onClick}>
      <img src={imageSrc} alt={title} className="navItem-image" />
      <div className="navItem-content">
        <h2>{title}</h2>
      </div>
    </div>
  );
}

export default NavItem;
