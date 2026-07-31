import { useState } from "react";
import "./App.css";

import ApplicantDashboard from "./pages/ApplicantDashboard";
import LoanApplicationForm from "./pages/LoanApplicationForm";
import ApplicationStatus from "./pages/ApplicationStatus";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  if (currentPage === "dashboard") {
    return (
      <>
        <ApplicantDashboard />

        <br />

        <button onClick={() => setCurrentPage("form")}>
          Start New Application
        </button>
      </>
    );
  }

  if (currentPage === "form") {
    return (
      <>
        <LoanApplicationForm />

        <br />

        <button onClick={() => setCurrentPage("status")}>
          Submit Application
        </button>
      </>
    );
  }

  return <ApplicationStatus />;
}

export default App;