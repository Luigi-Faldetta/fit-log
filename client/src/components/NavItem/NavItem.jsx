import React from 'react';
import PropTypes from 'prop-types';
import './NavItem.css';

function NavItem({ title, imageSrc, onClick }) {
  return (
    <div className="navItem" onClick={onClick}>
      <img src={imageSrc} alt={title} className="navItem-image" />
      <div className="navItem-content">
        <h2>{title}</h2>
      </div>
      <div className="navItem-overlay"></div>
    </div>
  );
}

NavItem.propTypes = {
  title: PropTypes.string.isRequired,
  imageSrc: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

NavItem.defaultProps = {
  onClick: null,
};

export default NavItem;
