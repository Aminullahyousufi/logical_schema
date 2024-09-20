import React, { useCallback } from 'react';

const Sidebar = () => {
  const onDragStart = useCallback((event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  // Array to store node details
  const nodes = [
    { type: 'input', label: 'Database' },
    { type: 'default', label: 'Entity' },
    { type: 'output', label: 'Attributes' },
  ];

  return (
    <aside>
      <div className="description">
        You can drag these nodes to show the types of data you have.
      </div>
      {nodes.map((node) => (
        <div
          key={node.type}
          className={`dndnode ${node.type}`}
          onDragStart={(event) => onDragStart(event, node.type)}
          draggable
        >
          {node.label}
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;