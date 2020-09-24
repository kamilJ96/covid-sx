import React, { ReactElement } from 'react';

export type SectorFilterProps = {
  sectors: string[],
  sectorsExcluded: string[],
  sectorColours: Record<string, unknown>,
  clickSector: (sectorsExcluded: string[]) => void,
};

function SectorFilter(props: SectorFilterProps): ReactElement {
  const sectors = props.sectors.slice();
  sectors.sort((a, b) => a.localeCompare(b));

  return (
    <div className="sector-filter">
      {sectors.map(sector => {
        const inactive = props.sectorsExcluded.includes(sector);
        return (
          <div
            key={sector}
            className={'sector ' + (inactive ? 'inactive' : 'active')}
            style={{ color: props.sectorColours[sector] as string }}
            onClick={() => inactive ? props.clickSector(props.sectorsExcluded.filter(s => s !== sector)) : props.clickSector(props.sectorsExcluded.concat(sector))}
          >
            {sector}
          </div>
        );
      })}
    </div>
  );
}

export default SectorFilter;
