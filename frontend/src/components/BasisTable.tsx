import React from 'react';

type basisTableData = {
    basisAdditions: basisAddition[];
};
  
type basisAddition = {
    spotExchange: string;
    futureExchange: string;
    basisValue: number;
};