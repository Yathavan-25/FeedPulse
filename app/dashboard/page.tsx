'use client';

import { useEffect, useState } from 'react';

interface FeedbackItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  ai_sentiment?: 'Positive' | 'Neutral' | 'Negative';
  ai_priority?: number;
  ai_summary?: string;
  ai_tags?: string[];
  ai_processed: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Feedback from API (Requirement 3.2)
  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback`);
      const result = await response.json();
      if (result.success) {
        setFeedbacks(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // 2. Update Status (Requirement 3.5)
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        // Refresh data to show updated status
        fetchFeedbacks();
      }
    } catch (error) {
      alert(error);
    }
  };

  if (loading) return <div className="container-custom text-center">Loading Dashboard...</div>;

  return (
    <main className="container-custom">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">Admin <span className="text-[#54afeb]">Dashboard</span></h1>
        <p className="text-sm text-gray-500">{feedbacks.length} Total Submissions</p>
      </div>

      <div className="space-y-6">
        {feedbacks.length === 0 ? (
          <div className="card text-center py-20 text-gray-500">No feedback submitted yet.</div>
        ) : (
          feedbacks.map((item) => (
            <div key={item._id} className="card border-l-4 transition-all hover:shadow-lg" 
                 style={{ borderLeftColor: item.ai_sentiment === 'Positive' ? '#22c55e' : item.ai_sentiment === 'Negative' ? '#ef4444' : '#94a3b8' }}>
              
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {/* Sentiment Badge (Requirement 3.2) */}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.ai_sentiment === 'Positive' ? 'bg-green-100 text-green-700' : 
                      item.ai_sentiment === 'Negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.ai_processed ? item.ai_sentiment : 'Processing...'}
                    </span>
                    <span className="text-xs font-medium text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-black mb-1">{item.title}</h2>
                  
                  {/* AI Summary (Requirement 2.2) */}
                  <p className="text-gray-700 text-sm italic mb-3">
                    {`"${item.ai_summary || item.description}"`}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.ai_tags?.map(tag => (
                      <span key={tag} className="bg-blue-50 text-[#54afeb] text-[10px] px-2 py-1 rounded-md font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full md:w-48 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Priority:</span>
                    <span className="font-bold text-[#54afeb]">{item.ai_priority || '?'}/10</span>
                  </div>
                  
                  {/* Status Dropdown (Requirement 3.5) */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Status</label>
                    <select 
                      value={item.status}
                      onChange={(e) => handleStatusChange(item._id, e.target.value)}
                      className="select-field text-sm mt-1"
                    >
                      <option value="New">New</option>
                      <option value="In Review">In Review</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}