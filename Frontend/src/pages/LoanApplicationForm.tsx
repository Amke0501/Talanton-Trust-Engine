function LoanApplicationForm() {
  return (
    <div>
      <h1>Loan Application</h1>

      <h2>Applicant Information</h2>

      <div>
        <label>Full Name</label><br />
        <input type="text" placeholder="Enter your full name" />
      </div>

      <br />

      <div>
        <label>Email</label><br />
        <input type="email" placeholder="Enter your email" />
      </div>

      <br />

      <div>
        <label>Phone Number</label><br />
        <input type="text" placeholder="Enter your phone number" />
      </div>

      <h2>Cooperative Information</h2>

      <div>
        <label>Cooperative Name</label><br />
        <input type="text" placeholder="Enter cooperative name" />
      </div>

      <br />

      <div>
        <label>Membership Number</label><br />
        <input type="text" placeholder="Enter membership number" />
      </div>

      <h2>Loan Information</h2>

      <div>
        <label>Loan Amount</label><br />
        <input type="number" placeholder="Enter loan amount" />
      </div>

      <br />

      <div>
        <label>Loan Purpose</label><br />
        <input type="text" placeholder="Enter loan purpose" />
      </div>

      <h2>Financial Information</h2>

      <div>
        <label>Monthly Income</label><br />
        <input type="number" placeholder="Enter monthly income" />
      </div>

      <br />

      <div>
        <label>Monthly Expenses</label><br />
        <input type="number" placeholder="Enter monthly expenses" />
      </div>

      <h2>Supporting Documents</h2>

      <div>
        <label>Upload Document</label><br />
        <input type="file" />
      </div>

      <br />

      <button>Save Draft</button>

      {" "}

      <button>Submit Application</button>
    </div>
  )
}

export default LoanApplicationForm