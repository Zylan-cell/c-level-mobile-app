import React from 'react';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';

export default function FeedbackPage() {
  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Feedback</h1>
      
      <FeedbackForm />
    </div>
  );
}
