import React, { useState, useEffect } from "react";
import API_BASE_URL from './apiConfig';
const FeedbackSummary = ({ feedbacks, isRejected = false, title = "AI Summary of Student Feedback" }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    const generateSummary = async () => {
      console.log("FeedbackSummary received feedbacks:", feedbacks);
      console.log("Is rejected feedback:", isRejected);
      
      // Better validation - check if feedbacks exist and has content
      if (!feedbacks || feedbacks.length === 0) {
        setSummary("No feedback available to summarize.");
        setLoading(false);
        return;
      }
      
      try {
        // More robust feedback text extraction
        const feedbackTexts = feedbacks.map(feedback => {
          let text = "";
          
          if (typeof feedback === 'string') {
            text = feedback;
          } else if (typeof feedback === 'object' && feedback !== null) {
            // Try multiple possible properties for feedback text
            text = feedback.feedback || 
                   feedback.text || 
                   feedback.content || 
                   feedback.message || 
                   feedback.description || 
                   "";
          }
          
          return text.toString().trim();
        });
        
        console.log("Extracted feedback texts:", feedbackTexts);
        
        // Filter out empty strings and very short texts
        const validFeedbacks = feedbackTexts.filter(text => text.length > 5);
        
        console.log("Valid feedbacks after filtering:", validFeedbacks);
        
        if (validFeedbacks.length === 0) {
          // If no valid feedback text, try to show count and basic info
          const feedbackCount = feedbacks.length;
          setSummary(isRejected 
            ? `${feedbackCount} feedback submissions were rejected due to policy violations or content guidelines.`
            : `${feedbackCount} feedback entries are available but contain insufficient text content for analysis.`
          );
          setLoading(false);
          return;
        }
        
        console.log("Sending feedbacks to AI API:", validFeedbacks);
        
        // Call the API endpoint that connects to Hugging Face
        const response = await fetch(`${API_BASE_URL}/api/ai_feedback_summary`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            feedbacks: validFeedbacks,
            isRejected: isRejected
          }),
        });
        
        // Handle model loading errors (Hugging Face specific - might return 503 when loading model)
        if (response.status === 503 && retryCount < MAX_RETRIES) {
          console.log("Model is loading, retrying in 3 seconds...");
          setRetryCount(prev => prev + 1);
          setTimeout(() => generateSummary(), 3000);
          return;
        }
        
        if (!response.ok) {
          // Get detailed error info if available
          let errorDetails = "Unknown error";
          try {
            const errorData = await response.json();
            errorDetails = errorData.message || `HTTP error! Status: ${response.status}`;
            console.error("Error details from API:", errorData);
          } catch (parseError) {
            errorDetails = `HTTP error! Status: ${response.status}`;
          }
          
          throw new Error(errorDetails);
        }
        
        const result = await response.json();
        console.log("AI API response:", result);
        
        if (result.status === "success") {
          // Check if the summary is valid and not a prompt echo
          const summaryText = result.summary.trim();
          
          if (!summaryText || summaryText.length < 15) {
            console.error("Response too short or empty");
            setSummary(generateClientSideSummary(validFeedbacks, isRejected));
          } else if (isPromptEcho(summaryText)) {
            console.error("Response appears to be returning the prompt");
            setSummary(generateClientSideSummary(validFeedbacks, isRejected));
          } else {
            setSummary(summaryText);
          }
        } else {
          throw new Error(result.message || "Failed to generate feedback summary");
        }
      } catch (err) {
        console.error("Error generating AI feedback summary:", err);
        setError("Unable to generate AI summary at this time.");
        
        // Generate client-side summary as fallback
        const validFeedbacks = feedbacks.map(f => {
          if (typeof f === 'string') return f;
          return f.feedback || f.text || f.content || '';
        }).filter(f => f.trim().length > 5);
        
        setSummary(generateClientSideSummary(validFeedbacks, isRejected));
      } finally {
        setLoading(false);
      }
    };
    
    generateSummary();
  }, [feedbacks, isRejected, retryCount]);

  // Function to detect if response is echoing the prompt
  const isPromptEcho = (text) => {
  const promptIndicators = [
    "summarize the following",
    "rejected submissions",
    "summary:",
    "these college feedback",
    "focus on main topics"
    // REMOVED: "student college reviews" and "college student reviews"
    // because HuggingFace model legitimately outputs these as prefix
  ];
  
  const lowerText = text.toLowerCase();
  return promptIndicators.some(indicator => lowerText.includes(indicator));
};

  // Client-side summary generation as fallback
  const generateClientSideSummary = (validFeedbacks, isRejected) => {
    if (!validFeedbacks || validFeedbacks.length === 0) {
      return isRejected 
        ? "No valid rejected feedback content available for analysis."
        : "No valid feedback content available for analysis.";
    }

    const count = validFeedbacks.length;
    const allText = validFeedbacks.join(" ").toLowerCase();
    
    // Analyze sentiment and topics
    const positiveWords = ["good", "great", "excellent", "nice", "amazing", "helpful", "clean", "modern"];
    const negativeWords = ["bad", "poor", "terrible", "awful", "dirty", "old", "unhelpful", "worst"];
    
    const facilityWords = ["hostel", "room", "fan", "building", "infrastructure", "facility"];
    const foodWords = ["canteen", "food", "dining", "meal"];
    const academicWords = ["academic", "teacher", "professor", "staff", "book"];
    
    const posCount = positiveWords.filter(word => allText.includes(word)).length;
    const negCount = negativeWords.filter(word => allText.includes(word)).length;
    
    const topics = [];
    if (facilityWords.some(word => allText.includes(word))) topics.push("facilities");
    if (foodWords.some(word => allText.includes(word))) topics.push("food services");
    if (academicWords.some(word => allText.includes(word))) topics.push("academics");
    
    if (isRejected) {
      let summary = `Analysis of ${count} rejected submissions shows feedback covering `;
      if (topics.length > 0) {
        summary += `${topics.join(", ")}. `;
      } else {
        summary += "various college aspects. ";
      }
      summary += "These were rejected due to policy violations despite containing ";
      summary += posCount > negCount ? "mostly positive" : negCount > posCount ? "critical" : "mixed";
      summary += " feedback.";
      return summary;
    } else {
      let summary = `Based on ${count} student reviews, feedback is `;
      summary += posCount > negCount ? "generally positive" : negCount > posCount ? "mostly critical" : "mixed";
      if (topics.length > 0) {
        summary += ` regarding ${topics.join(", ")}.`;
      } else {
        summary += " about various college aspects.";
      }
      return summary;
    }
  };

  // Function to manually retry summary generation
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryCount(0);
  };

  if (loading) {
    return (
      <div className="feedback-summary loading">
        <div className="summary-loader">
          <svg className="spinner" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
          </svg>
          {retryCount > 0 ? 
            `Loading AI model... (Attempt ${retryCount}/${MAX_RETRIES})` : 
            "Generating AI summary..."}
        </div>
      </div>
    );
  }
  
  return (
    <div className="feedback-summary">
      <h5>{title}</h5>
      <div className="summary-content">
        <svg className="ai-icon" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
        <p>{summary}</p>
        {error && (
          <div className="error-notice">
            <small>{error}</small>
            <button 
              className="retry-button" 
              onClick={handleRetry}
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackSummary;