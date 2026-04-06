import React, { useState } from 'react'

export function Tabs({ defaultValue, children }) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <div>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { activeTab, setActiveTab })
          : child
      )}
    </div>
  )
}

export function TabsList({ children, className = '', activeTab, setActiveTab }) {
  return (
    <div className={`flex gap-4 border-b border-gray-200 mb-6 ${className}`}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { activeTab, setActiveTab })
          : child
      )}
    </div>
  )
}

export function TabsTrigger({ value, children, activeTab, setActiveTab }) {
  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={`pb-3 px-4 font-semibold transition-colors ${
        activeTab === value
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children, activeTab }) {
  if (activeTab !== value) return null
  return <div>{children}</div>
}
