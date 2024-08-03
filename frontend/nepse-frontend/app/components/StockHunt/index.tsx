"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import moment from "moment";
import data from "../../../../../data/stock_hunt_24-01-29.json";

import allData from "../../../../../mean/stock_report_24-01-29.json";

export default function StockHunt() {
  const [sortedData, setSortedData] = useState(data);
  const [sortKey, setSortKey] = useState<any>("date");
  const [sortOrder, setSortOrder] = useState("asc");

  const [allsortedData, setAllSortedData] = useState(
    allData.sort((a: any, b: any) => a?.["awayFromMean"] - b?.["awayFromMean"])
  );
  const [allsortKey, setAllSortKey] = useState<any>("date");
  const [allsortOrder, setAllSortOrder] = useState("asc");

  // Function to sort the data based on the selected key
  const sortData = (key: string) => {
    const order = sortOrder === "asc" ? 1 : -1;
    const sorted = [...sortedData].sort((a: any, b: any) =>
      a?.[key] > b?.[key] ? order : -order
    );
    setSortedData(sorted);
    setSortKey(key);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  const sortAllData = (key: string) => {
    const order = sortOrder === "asc" ? 1 : -1;
    const sorted = [...allsortedData].sort((a: any, b: any) =>
      a?.[key] > b?.[key] ? order : -order
    );
    setAllSortedData(sorted);
    setAllSortKey(key);
    setAllSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="container mx-auto p-4 ">
      <table className="table-auto w-full dark">
        <thead>
          <tr>
            <th
              className="cursor-pointer dark:hover:bg-gray-800"
              onClick={() => sortData("stock")}
            >
              Stock
            </th>
            <th
              className="cursor-pointer dark:hover:bg-gray-800"
              onClick={() => sortData("condition")}
            >
              Condition
            </th>
            <th
              className="cursor-pointer dark:hover:bg-gray-800"
              onClick={() => sortData("5_sma")}
            >
              5-day SMA
            </th>
            <th
              className="cursor-pointer dark:hover:bg-gray-800"
              onClick={() => sortData("20_SMA")}
            >
              20-day SMA
            </th>
            <th
              className="cursor-pointer dark:hover:bg-gray-800"
              onClick={() => sortData("lastHigh")}
            >
              Last High
            </th>
            <th
              className="cursor-pointer dark:hover:bg-gray-800"
              onClick={() => sortData("lastLow")}
            >
              Last Low
            </th>
            <th
              className="cursor-pointer dark:hover:bg-gray-800"
              onClick={() => sortData("date")}
            >
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData
            ?.filter((val: any) => val?.condition)
            .map((item: any, index: number) => (
              <tr key={index}>
                <td>{item.stock}</td>
                <td>{item.condition.toString()}</td>
                <td>{item["5_sma"]}</td>
                <td>{item["20_SMA"]}</td>
                <td>{item.lastHigh}</td>
                <td>{item.lastLow}</td>
                <td>{item.date}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <h4 className="dark:text-white">Retrace</h4>
      <table className="table-auto w-full dark">
        <thead>
          <tr>
            <th
              className="cursor-pointer dark:hover:bg-gray-800"
              onClick={() => sortData("stock")}
            >
              Stock
            </th>
            <th
              className="cursor-pointer dark:hover:bg-gray-800"
              onClick={() => sortData("condition")}
            >
              Condition
            </th>
            <th
              className="cursor-pointer dark:hover:bg-gray-800"
              onClick={() => sortData("5_sma")}
            >
              5-day SMA
            </th>
            <th
              className="cursor-pointer dark:hover:bg-gray-800"
              onClick={() => sortData("20_SMA")}
            >
              20-day SMA
            </th>
            <th
              className="cursor-pointer dark:hover:bg-gray-800"
              onClick={() => sortData("lastHigh")}
            >
              Last High
            </th>
            <th
              className="cursor-pointer dark:hover:bg-gray-800"
              onClick={() => sortData("lastLow")}
            >
              Last Low
            </th>
            <th
              className="cursor-pointer dark:hover:bg-gray-800"
              onClick={() => sortData("lastLow")}
            >
              Retrace Level
            </th>
            <th
              className="cursor-pointer dark:hover:bg-gray-800"
              onClick={() => sortData("ltp")}
            >
              LTP
            </th>
            <th
              className="cursor-pointer dark:hover:bg-gray-800"
              onClick={() => sortData("date")}
            >
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData
            ?.filter((val: any) => val?.retrace)
            .map((item: any, index: number) => (
              <tr key={index}>
                <td>{item.stock}</td>
                <td>{item.condition.toString()}</td>
                <td>{item["5_sma"]}</td>
                <td>{item["20_SMA"]}</td>
                <td>{item.lastHigh}</td>
                <td>{item.lastLow}</td>
                <td>{item?.["0.5_LEVEL"]}</td>
                <td>{item.ltp}</td>
                <td>{item.date}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <h4 className="dark:text-white">Mean Reversal</h4>
      <table className="table-auto w-full dark">
        <thead>
          <tr>
            <th
              className="cursor-pointer dark:hover:bg-gray-800"
              onClick={() => sortAllData("stock")}
            >
              Stock
            </th>

            <th
              className="cursor-pointer dark:hover:bg-gray-800"
              onClick={() => sortAllData("awayFromMean")}
            >
              Mean{" "}
            </th>
            <th
              className="cursor-pointer dark:hover:bg-gray-800"
              onClick={() => sortAllData("ltp")}
            >
              LTP
            </th>
            <th
              className="cursor-pointer dark:hover:bg-gray-800"
              onClick={() => sortAllData("date")}
            >
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {allsortedData?.map((item: any, index: number) => (
            <tr
              key={index}
              className={` dark:text-white ${
                item?.awayFromMean > 20
                  ? "dark:bg-green-600"
                  : item?.awayFromMean < 0
                  ? "dark:bg-red-600"
                  : "dark:bg-orange-400"
              }`}
            >
              <td>{item.stock}</td>
              <td>{item?.awayFromMean}</td>
              <td>{item.ltp}</td>
              <td>{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
