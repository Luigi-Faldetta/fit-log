import React from 'react';
import './Skeleton.css';

const Skeleton = ({ variant = 'text', width, height, className = '', style = {} }) => {
  return (
    <div
      className={`skeleton skeleton--${variant} ${className}`}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  );
};

const SkeletonCard = ({ count = 1 }) => {
  const cards = Array.from({ length: count }, (_, i) => (
    <div key={i} className="skeleton-card" aria-hidden="true">
      <Skeleton className="skeleton-card__title" />
      <Skeleton className="skeleton-card__description" />
      <Skeleton className="skeleton-card__description skeleton-card__description--short" />
      <div className="skeleton-card__stats">
        <Skeleton className="skeleton-card__stat" />
        <Skeleton className="skeleton-card__stat" />
      </div>
    </div>
  ));

  return (
    <>
      <span className="visually-hidden" role="status">Loading content</span>
      {cards}
    </>
  );
};

const SkeletonChart = () => {
  return (
    <div className="skeleton-chart" role="status" aria-label="Loading chart">
      <span className="visually-hidden">Loading chart</span>
      <Skeleton className="skeleton-chart__area" />
      <div className="skeleton-chart__legend">
        <Skeleton className="skeleton-chart__legend-item" />
        <Skeleton className="skeleton-chart__legend-item" />
      </div>
    </div>
  );
};

const SkeletonTable = ({ rows = 4 }) => {
  return (
    <div className="skeleton-table-wrapper" role="status" aria-label="Loading table">
      <span className="visually-hidden">Loading table</span>
      <div className="skeleton-table">
        <div className="skeleton-table__header">
          <Skeleton className="skeleton-table__header-cell" />
          <Skeleton className="skeleton-table__header-cell" />
          <Skeleton className="skeleton-table__header-cell" />
          <Skeleton className="skeleton-table__header-cell" />
          <Skeleton className="skeleton-table__header-cell" />
        </div>
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="skeleton-table__row">
            <Skeleton className="skeleton-table__cell" />
            <Skeleton className="skeleton-table__cell" />
            <Skeleton className="skeleton-table__cell" />
            <Skeleton className="skeleton-table__cell" />
            <Skeleton className="skeleton-table__cell" />
          </div>
        ))}
      </div>
    </div>
  );
};

Skeleton.Card = SkeletonCard;
Skeleton.Chart = SkeletonChart;
Skeleton.Table = SkeletonTable;

export default Skeleton;
