import { redirect } from 'next/navigation';

export default function Home() {
  // Перенаправляем пользователя на страницу дашборда при посещении корневого URL
  redirect('/dashboard');
  
  // Этот код никогда не будет выполнен из-за редиректа выше
  return null;
}
