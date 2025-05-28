import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
          C-Level Mobile App
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Login to access your C-Level dashboard and tasks
        </p>
      </div>

      <LoginForm />
    </div>
  );
}
