import '../node_modules/antd/dist/antd.min.js';  // This should be the correct file for styling.
import React from "react";
import "antd/dist/reset.css"; // Ant Design CSS
import DashboardPage from "./pages/DashboardPage";

const App = () => {
  return <DashboardPage />;
};

export default App;
