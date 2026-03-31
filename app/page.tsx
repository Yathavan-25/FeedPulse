"use client";

const Home = () => {
  const formFields = [
    { label: "Name", type: "text", required: true },
    { label: "Email", type: "email", required: true },
    { label: "Title", type: "text", required: true },
    { label: "Description", type: "textarea", required: true, minLength: 20 },
    { label: "Category", type: "select", options: ["Bug", "Feature Request", "Improvement"], required: true }
  ];

  return (
    <main className="container-custom">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          Feed<span className="text-[#54afeb]">Pulse</span>
        </div>
        <button className="button-secondary">Log In</button>
      </nav>

      {/* Feedback Form */}
      <section className="card">
        <h1 className="title">Submit Your Feedback</h1>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          alert("Feedback submitted!");
        }}>
          {formFields.map((field) => (
            <div key={field.label} className="form-group">
              <label htmlFor={field.label} className="label">
                {field.label} 
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === "textarea" && (
                <textarea 
                  id={field.label} 
                  required={field.required}
                  minLength={field.minLength}
                  className="textarea-field" 
                  placeholder={`Minimum ${field.minLength} characters...`}
                />
              )}

              {field.type === "select" && field.options &&(
                <select 
                  id={field.label} 
                  required={field.required}
                  className="select-field"
                >
                  <option value="">Select a category</option>
                  {field.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {(field.type === "text" || field.type === "email") && (
                <input 
                  type={field.type} 
                  id={field.label} 
                  required={field.required}
                  className="input-field" 
                />
              )}
            </div>
          ))}
          
          <button type="submit" className="button-primary mt-4">
            Submit Feedback
          </button>
        </form>
      </section>
    </main>
  )
}

export default Home