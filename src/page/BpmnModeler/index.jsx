import React from 'react';
import FlowDiagram from './components/FlowDiagram/FlowDiagram'

const BpmnModeler = () => {

  return <div style={{
    width: '100%',
    height: '100vh'
  }}>
    <FlowDiagram />
  </div>
}

export default BpmnModeler