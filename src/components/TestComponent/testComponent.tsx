import React, { useState } from 'react'

export const TestComponent = () => {
  const [name] = useState('test Component');
  return (
    <div className="green">name from state {name}</div>
  )
}

