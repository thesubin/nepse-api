import React from "react";
import CompanyTable from "./components/companyTable";

function CompanyTablePage() {
  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Company Table</h1>
      <CompanyTable />
    </div>
  );
}

export default CompanyTablePage;
