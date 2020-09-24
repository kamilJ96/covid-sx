import React, { ReactElement } from 'react';

function Loading(): ReactElement {
  return (
    <div className="asx-loading">
      <img src="/loading.svg" alt="Loading, Please Wait" className="asx-loading-image" />
    </div>
  );
}

export default Loading;
