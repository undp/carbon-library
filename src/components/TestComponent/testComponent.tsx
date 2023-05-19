import React, { useState } from 'react'

export const TestComponent = () => {
  const [name,setName] = useState('');
  setName('test Component');
  return (
    <div className='test'>name from state {name}</div>
  )
}

