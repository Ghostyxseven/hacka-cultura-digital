'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ApplicationServiceFactory } from '@/application';
import type { Subject } from '@/application/viewmodels';

/**
 * Dashboard do Professor - Single User Application
 * Redireciona para a página principal
 */
export default function ProfessorDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Redirecionando...</p>
        <Link href="/" className="text-indigo-600 hover:text-indigo-700">
          Ir para Dashboard
        </Link>
      </div>
    </div>
  );
}
