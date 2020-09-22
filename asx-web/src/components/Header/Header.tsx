import React, { ReactElement, useState } from 'react';

export default function Header(): ReactElement {
  const [view] = useState('daily');

  return (
    <div className="asx-header">
      {view === 'daily' ? <div className="asx-header-daliy">Hello!</div> : null}
    </div>
  );
}
