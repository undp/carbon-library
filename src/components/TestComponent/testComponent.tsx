import React, { useState } from 'react'

export const TestComponent = () => {
  const [name] = useState('test Component');
  return (
    <div className='test'>name from state {name}</div>
  )
}

