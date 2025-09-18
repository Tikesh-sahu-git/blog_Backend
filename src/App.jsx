import React from "react";
import { ThemeProvider } from "./components/ThemeContext";
import AdvancedBillSplitter from "./components/BillSplitter";

const App = () => {
  return (
    <ThemeProvider>
      <AdvancedBillSplitter />
    </ThemeProvider>
  );
};

export default App;
