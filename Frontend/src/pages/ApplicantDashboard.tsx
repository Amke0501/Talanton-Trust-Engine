import applications from "../data/applications"
function ApplicantDashboard() {
  return (
    <div>
      <h1>Welcome, Applicant</h1>

      <h2>My Applications</h2>

{applications.map((application) => (
  <div key={application.id}>
    <h3>Application #{application.id}</h3>
    <p>Status: {application.status}</p>
  </div>
))}

      <button>Start New Application</button>
    </div>
  )
}

export default ApplicantDashboard