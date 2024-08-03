"use client";

import React from "react";
import companiesData from "../../../../../../data/companies_summary.json";

interface Company {
  companyCode: string;
  companyName: string;
  high: number;
  low: number;
  highDate: string;
  lowDate: string;
  ltp: number;
  highPercentage?: string;
  lowPercentage?: string;
}

function CompanyTable() {
  const [sortKey, setSortKey] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("asc");

  const sortedData = React.useMemo(() => {
    let sortedCompanies: any = [...companiesData];

    if (sortKey) {
      sortedCompanies.sort((a: any, b: any) => {
        const aValue = a?.[sortKey];
        const bValue = b?.[sortKey];

        if (aValue < bValue) {
          return sortOrder === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortOrder === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return sortedCompanies.map((company: any) => {
      const lowPercentage = (
        ((company.ltp - company.low) / company.ltp) *
        100
      ).toFixed(2);
      const highPercentage = (
        ((company.high - company.ltp) / company.ltp) *
        100
      ).toFixed(2);

      return {
        ...company,
        lowPercentage,
        highPercentage,
      };
    });
  }, [sortKey, sortOrder]);

  const handleSort = (key: string) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <table className="w-full table-fixed bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <thead className="bg-gray-100 dark:bg-gray-900">
        <tr>
          <th
            className="px-4 py-2 cursor-pointer"
            onClick={() => handleSort("companyCode")}
          >
            Company Code
            {sortKey === "companyCode" && (
              <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
            )}
          </th>
          <th
            className="px-4 py-2 cursor-pointer"
            onClick={() => handleSort("companyName")}
          >
            Company Name
            {sortKey === "companyName" && (
              <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
            )}
          </th>
          <th
            className="px-4 py-2 cursor-pointer"
            onClick={() => handleSort("ltp")}
          >
            LTP
            {sortKey === "ltp" && (
              <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
            )}
          </th>
          <th
            className="px-4 py-2 cursor-pointer"
            onClick={() => handleSort("low")}
          >
            Low
            {sortKey === "low" && (
              <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
            )}
          </th>
          <th
            className="px-4 py-2 cursor-pointer"
            onClick={() => handleSort("high")}
          >
            High
            {sortKey === "high" && (
              <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
            )}
          </th>
          <th
            className="px-4 py-2 cursor-pointer"
            onClick={() => handleSort("lowPercentage")}
          >
            Low %
            {sortKey === "lowPercentage" && (
              <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
            )}
          </th>
          <th
            className="px-4 py-2 cursor-pointer"
            onClick={() => handleSort("highPercentage")}
          >
            High %
            {sortKey === "highPercentage" && (
              <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
            )}
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map((company: Company) => (
          <tr
            key={company.companyCode}
            className="hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <td className="px-4 py-2 text-center">{company.companyCode}</td>
            <td className="px-4 py-2 text-center">{company.companyName}</td>
            <td className="px-4 py-2 text-center">{company.ltp}</td>
            <td className="px-4 py-2 text-center">{company.low}</td>
            <td className="px-4 py-2 text-center">{company.high}</td>
            <td className="px-4 py-2 text-center">{company.lowPercentage}%</td>
            <td className="px-4 py-2 text-center">{company.highPercentage}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CompanyTable;
