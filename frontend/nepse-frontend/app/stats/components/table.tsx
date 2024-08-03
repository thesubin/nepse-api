'use client';
import { StockData } from '@/types/dataTable.types';
import React, { useState, useEffect } from 'react';

import axios from "axios"
const DataTable = () => {
  const [data, setData] = useState<StockData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        axios.get('https://the-value-crew.github.io/nepse-api/data/date/latest.json')
      .then(resp => {
        console.log(resp)
        const sortedData = resp?.data?.data?.sort((a:StockData, b:StockData) => ((a.price.diff/a.price.prevClose) *100) -((b.price.diff/b.price.prevClose) *100));
        setData(sortedData); 
    
    }
        )
      .catch(e => console.log(e))
    
    };

    fetchData();
  }, []);

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Company Code
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Company Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Change
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            LTP
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Diff
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
           Transaction Amount
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((item, index) => (
          <tr key={index} className=''>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{item.company.code}</div>
            </td>
          
             <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{item.company.name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{((item.price.diff/item.price.prevClose) *100)
           }</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{item.price.close}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-red-500">{item.price.diff}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-green-500">{item.amount}</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;