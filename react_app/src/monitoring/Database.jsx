import React from 'react';
import { Treemap } from 'recharts';

const data = [
  { name: "BILLY CAT", size: 7800 },
  { name: "DOG GO TO THE MOON", size: 5000 },
  { name: "BAMK OF NAKAMOTO DOLLAR", size: 6000 },
  { name: "RSIC GENESIS RUNE", size: 7000 },
  { name: "PUPS WORLD PEACE", size: 8000 },
  { name: "BILLY CAT", size: 1000 },
  { name: "DOG", size: 2000 },
  { name: "STUPID SILLY CAT", size: 300 },
  { name: "HACKTOUYON THAT THANG", size: 4500 },
  { name: "CAT GO TO THE MOON", size: 500 },
  // Add more runes as needed
];

const Database = () => (
  <>
  
  <h2>RuneHolders</h2>
    <Treemap
      width={730}
      height={250}
      data={data}
      dataKey="size"
      aspectRatio={4 / 3}
      stroke="#fff"
      fill="#8884d8"
    />
  </>
);

export default Database;