import React from 'react'

export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white rounded-lg shadow border border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardContent({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>
}

export function CardHeader({ children, className = '' }) {
  return <div className={`p-6 pb-0 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = '' }) {
  return <h2 className={`text-2xl font-bold ${className}`}>{children}</h2>
}

export function CardDescription({ children, className = '' }) {
  return <p className={`text-gray-600 mt-1 ${className}`}>{children}</p>
}
