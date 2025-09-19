import React, { useEffect } from "react";
import { ThemeProvider } from "./components/ThemeContext";
import AdvancedBillSplitter from "./components/BillSplitter";

const App = () => {
  useEffect(()=>{
    document.title = "Bill Splitter";
  },[]);
  return (
    <ThemeProvider>
      <AdvancedBillSplitter />
    </ThemeProvider>
  );
};

export default App;
