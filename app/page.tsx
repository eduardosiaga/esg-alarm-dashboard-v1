'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la página de login
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse">
          <h1 className="text-2xl font-semibold text-gray-700">Cargando...</h1>
        </div>
      </div>
    </div>
  );
}