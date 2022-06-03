import React from 'react';

type selectmenuType = {
	recon : string;
}

export default function ColumnMapping({recon}:selectmenuType) {
	console.log(recon);
	const array = [
		'Map column',
		'2A : a',
		'2A : b',
		'2A : c',
		'2A : d',
	]
  return (
    <div>
		<select>
			{
				array.map((e) => {
					return <option>{e}</option>
				})
			}
		</select>
  </div>
  )
}
