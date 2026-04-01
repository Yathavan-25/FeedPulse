import express from 'express';
import { 
  createFeedback, 
  getAllFeedback, 
  updateFeedbackStatus 
} from '../controllers/feedback.controller';

const router = express.Router();


//public url for user feedback submisson
router.post('/', createFeedback);

//admin url to retrieve all feedbacks
router.get('/', getAllFeedback);

//admin url to update user feedback 
router.patch('/:id', updateFeedbackStatus);

export default router;