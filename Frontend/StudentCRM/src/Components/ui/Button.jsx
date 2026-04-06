import React from 'react'

export function Button({ children, variant = 'default', size = 'md', className = '', ...props }) {
  const baseStyles = 'font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2'
  
  const variants = {
    default: 'bg-blue-600 hover:bg-blue-700 text-white',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'hover:bg-gray-100 text-gray-900',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
