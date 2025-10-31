import React, { useState } from 'react'
import CarevoDashboard from './pages/notes.jsx'
import LectureCastPage from './pages/lectures.jsx'

export default function App() {
  const [page, setPage] = useState('notes')

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Render the full-page components. They include their own headers/sidebars. */}
      {page === 'notes' ? (
        <CarevoDashboard onNavigate={setPage} />
      ) : (
        <LectureCastPage onNavigate={setPage} />
      )}
    </div>
  )
}
