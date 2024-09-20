import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  Edge,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './sidebar';
import './style.css';

// Initial nodes state
const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'input node' },
    position: { x: 250, y: 5 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Background variant state
  const [variant, setVariant] = useState('Lines');

  // Node editing state
  const [editValue, setEditValue] = useState('');
  const [editId, setEditId] = useState(null);

  // Handle node click to set edit state
  const onNodeClick = (e, node) => {
    setEditValue(node.data.label);
    setEditId(node.id);
  };

  // Handle input change
  const handleChange = (e) => {
    e.preventDefault();
    setEditValue(e.target.value);
  };

  // Update node label
  const handleEdit = () => {
    if (editId) {
      const updatedNodes = nodes.map((node) => {
        if (node.id === editId) {
          return {
            ...node,
            data: { ...node.data, label: editValue },
          };
        }
        return node;
      });
      setNodes(updatedNodes);
      setEditValue('');
      setEditId(null);
    }
  };

  // Handle new node connection
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  // Handle drag over event
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop event to add new nodes
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
  
      // Get the type of node from the dataTransfer object
      const type = event.dataTransfer.getData('application/reactflow');
  
      if (typeof type === 'undefined' || !type) {
        return;
      }
  
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
  
      const newNode = {
        id: getId(),
        type, // Node type (e.g., 'cylinder', 'default')
        position,
        data: { label: `${type} node` },
      };
  
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );  

  return (
    <div className="dndflow">
      <div className="updatenode__controls">
        <label>Assign Attributes:</label><br />
        <input type="text" value={editValue} onChange={handleChange} /> <br />
        <button onClick={handleEdit} className="btn">Update</button>
      </div>

      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodeClick={onNodeClick}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Background color="#9b3ec" variant={variant} />
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar />
      </ReactFlowProvider>
    </div>
  );
};

export default DnDFlow;