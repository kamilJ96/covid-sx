import React, { ReactElement } from 'react';

function Loading(): ReactElement {
  return (
    <div className="asx-loading">
      <svg width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <circle cx="50" cy="50" r="0" fill="none" stroke="#e90c0c" strokeWidth="2">
          <animate attributeName="r" repeatCount="indefinite" dur="1.5s" values="0;46" keyTimes="0;1" keySplines="0 0.2 0.8 1" calcMode="spline" begin="-0.5s"></animate>
          <animate attributeName="opacity" repeatCount="indefinite" dur="1.5s" values="1;0" keyTimes="0;1" keySplines="0.2 0 0.8 1" calcMode="spline" begin="-0.5s"></animate>
        </circle>
        <circle cx="50" cy="50" r="0" fill="none" stroke="#14bbce" strokeWidth="2">
          <animate attributeName="r" repeatCount="indefinite" dur="1.5s" values="0;46" keyTimes="0;1" keySplines="0 0.2 0.8 1" calcMode="spline"></animate>
          <animate attributeName="opacity" repeatCount="indefinite" dur="1.5s" values="1;0" keyTimes="0;1" keySplines="0.2 0 0.8 1" calcMode="spline"></animate>
        </circle>
      </svg>
    </div >
  );
}

export default Loading;
