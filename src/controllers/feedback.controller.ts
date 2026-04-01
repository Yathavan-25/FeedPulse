import { Request, Response } from 'express';
import Feedback from '../models/feedback';
import { analyzeFeedback } from '../services/gemini.service';

/**
 * @route   POST /api/feedback
 * @desc    Submit new feedback & trigger Al analysis
 * @access  Public
 */
export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { title, description, category, submitterName, submitterEmail } = req.body;


    if (!title || !description || !category) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide title, description, and category." 
      });
    }

    const feedback = new Feedback({
      title,
      description,
      category,
      submitterName,
      submitterEmail,
    });

    await feedback.save();

    //save user feedback before analysing for better time management
    try {
      const aiAnalysis = await analyzeFeedback(title, description, category);

      if (aiAnalysis) {
        feedback.ai_category = aiAnalysis.category;
        feedback.ai_sentiment = aiAnalysis.sentiment;
        feedback.ai_priority = aiAnalysis.priority_score;
        feedback.ai_summary = aiAnalysis.summary;
        feedback.ai_tags = aiAnalysis.tags;
        feedback.ai_processed = true;
        
        await feedback.save();
      }
    } catch (aiError) {
      console.error("AI Analysis failed but feedback was saved:", aiError);
    }

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback
    });

  } catch (error: any) {
    console.error("Error in createFeedback:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server Error", 
      error: error.message 
    });
  }
};

/**
 * @route   GET /api/feedback
 * @desc    Get all feedback for Admin Dashboard
 * @access  Private (Admin Only)
 */
export const getAllFeedback = async (req: Request, res: Response) => {
  try {
    const { category, status } = req.query;
    let query: any = {};

    if (category) query.category = category;
    if (status) query.status = status;

    const feedbacks = await Feedback.find(query).sort({ 
      ai_priority: -1, 
      createdAt: -1 
    });

    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @route   PATCH /api/feedback/:id
 * @desc    Update feedback status
 * @access  Private (Admin Only)
 */
export const updateFeedbackStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const feedback = await Feedback.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    return res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: feedback
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
};