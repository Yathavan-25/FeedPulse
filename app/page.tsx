"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";

// 1. Define Types for Form and Fields
interface FormData {
  Name: string;
  Email: string;
  Title: string;
  Description: string;
  Category: string;
}

interface FormField {
  label: string;
  id: keyof FormData; // Ensures ID matches a key in FormData
  type: "text" | "email" | "textarea" | "select";
  required: boolean;
  minLength?: number;
  options?: string[];
}

const Home: React.FC = () => {
  // 2. Initialize Typed State
  const [formData, setFormData] = useState<FormData>({
    Name: "",
    Email: "",
    Title: "",
    Description: "",
    Category: ""
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const formFields: FormField[] = [
    { label: "Name", id: "Name", type: "text", required: true },
    { label: "Email", id: "Email", type: "email", required: true },
    { label: "Title", id: "Title", type: "text", required: true },
    { label: "Description", id: "Description", type: "textarea", required: true, minLength: 20 },
    { label: "Category", id: "Category", type: "select", options: ["Bug", "Feature Request", "Improvement"], required: true }
  ];

  // 3. Typed Change Handler
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // 4. Submit Handler with API Integration
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.Title,
          description: formData.Description,
          category: formData.Category,
          submitterName: formData.Name,
          submitterEmail: formData.Email
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: "success", text: "Feedback submitted successfully! AI is processing..." });
        setFormData({ Name: "", Email: "", Title: "", Description: "", Category: "" });
      } else {
        setMessage({ type: "error", text: result.message || "Failed to submit feedback." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Server connection error." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-custom">
      <nav className="navbar">
        <div className="logo font-bold text-xl">
          Feed<span className="text-[#54afeb]">Pulse</span>
        </div>
        <a href="/dashboard" className="button-secondary text-sm">Admin Dashboard</a>
      </nav>

      <section className="card max-w-2xl mx-auto mt-12">
        <h1 className="title">Submit Your Feedback</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {formFields.map((field) => (
            <div key={field.id} className="form-group">
              <label htmlFor={field.id} className="label flex justify-between">
                <span>
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </span>
                {field.id === "Description" && (
                  <span className={`text-[10px] ${formData.Description.length >= 20 ? 'text-green-500' : 'text-gray-400'}`}>
                    {formData.Description.length}/20 characters
                  </span>
                )}
              </label>

              {field.type === "textarea" && (
                <textarea 
                  id={field.id} 
                  required={field.required}
                  minLength={field.minLength}
                  value={formData[field.id]}
                  onChange={handleChange}
                  className="textarea-field" 
                  placeholder={`Minimum ${field.minLength} characters...`}
                />
              )}

              {field.type === "select" && (
                <select 
                  id={field.id} 
                  required={field.required}
                  value={formData[field.id]}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="">Select a category</option>
                  {field.options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {(field.type === "text" || field.type === "email") && (
                <input 
                  type={field.type} 
                  id={field.id} 
                  required={field.required}
                  value={formData[field.id]}
                  onChange={handleChange}
                  className="input-field" 
                />
              )}
            </div>
          ))}
          
          {message && (
            <div className={`p-3 rounded text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || formData.Description.length < 20}
            className={`button-primary w-full mt-4 ${(loading || formData.Description.length < 20) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Processing..." : "Submit Feedback"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Home;