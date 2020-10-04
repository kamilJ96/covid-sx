import React, { ReactElement } from 'react';
import { GroupedKeys } from '../../types/dataTypes';

type HeaderProps = {
  group: GroupedKeys,
  changeGroup: (key: GroupedKeys) => void,
}

const defaultHeaderClass = 'asx-header-group';

export default function Header(props: HeaderProps): ReactElement {
  let sectorHeaderClass = defaultHeaderClass;
  let stateHeaderClass = defaultHeaderClass;

  if (props.group === GroupedKeys.sector) sectorHeaderClass += ' active';
  else if (props.group === GroupedKeys.state) stateHeaderClass += ' active';

  return (
    <header className="asx-header">
      <span className={sectorHeaderClass} onClick={() => props.changeGroup(GroupedKeys.sector)}>Group By Sector</span>
      <span className={stateHeaderClass} onClick={() => props.changeGroup(GroupedKeys.state)}>Group By State</span>
    </header>
  );
}
