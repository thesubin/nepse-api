export interface Company {
    code: string;
    name: string;
    cat: string;
  }
  
 export interface Price {
    max: number;
    min: number;
    close: number;
    prevClose: number;
    diff: number;
  }
  
 export interface StockData {
    company: Company;
    price: Price;
    numTrans: number;
    tradedShares: number;
    amount: number;
  }