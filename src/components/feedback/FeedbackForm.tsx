import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FeedbackService } from '@/lib/api/services';

interface FeedbackFormProps {
  taskId?: string;
  briefId?: string;
  onSuccess?: () => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ 
  taskId, 
  briefId, 
  onSuccess 
}) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content) {
      setError('Please provide feedback content');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await FeedbackService.sendFeedback({
        taskId,
        briefId,
        content,
        rating
      });
      
      // Reset form
      setContent('');
      setRating(3);
      
      // Call success callback or redirect
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(taskId ? `/tasks/${taskId}` : briefId ? `/briefs/${briefId}` : '/dashboard');
      }
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error('Failed to submit feedback:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Provide Feedback</h2>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
            {error}
            <button 
              className="ml-2 text-sm underline" 
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label 
              htmlFor="rating" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Rating
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    rating >= value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label 
              htmlFor="content" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Feedback
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Please provide your feedback about the AI's performance..."
              required
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                isSubmitting
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
