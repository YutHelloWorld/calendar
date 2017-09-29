import React from 'react'
import Calendar from '../../lib'
import { render } from 'react-dom'

const MOUNT_NODE = document.getElementById('root')

function App() {
  return (
    <div style={{ margin: '30px auto', width: '275px', height: '362px' }}>
      <Calendar
        minDate="2017-06-01"
        locale="zh"
        onSelect={(v) => console.log(v)}
      />
    </div>
  )
}
render(<App />, MOUNT_NODE)
