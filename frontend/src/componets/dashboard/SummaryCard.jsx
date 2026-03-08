import React, { useState, useEffect } from 'react'

const SummaryCard = ({icon, text, number, color = "teal"}) => {
  const colorClasses = {
    teal: "bg-teal-600",
    yellow: "bg-yellow-500", 
    red: "bg-red-500",
    green: "bg-green-500"
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center space-x-4">
      <div className={`${colorClasses[color]} p-4 rounded-lg text-white flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-gray-700 text-lg font-semibold">{text}</p>
        <p className="text-gray-900 text-2xl font-bold">{number}</p>
      </div>
    </div>
  )
}

export default SummaryCard