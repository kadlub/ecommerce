import React from 'react'

const SectionHeading = ({ title }) => {
  return (
    <div className="flex items-center px-10 my-6 gap-3">
      <div className="w-4 h-4 rounded-full bg-black"></div>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="flex-1 h-px bg-gray-300"></div>
    </div>
  )
}

export default SectionHeading
