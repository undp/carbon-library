import React, { useState } from 'react'
import './TestComponent.scss'

export const TestComponent = () => {
  const [name] = useState('test Component');
  return (
    <div className="green">name from state {name}</div>
  )
}

