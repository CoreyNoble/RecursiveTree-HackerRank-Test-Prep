

import React, { useEffect } from 'react';
import './App.css';
import { RecursiveTree } from './components/RecursiveTree';
import type { TreeNode } from './components/RecursiveTree';

// Helper to generate unique IDs
const uuid = () => '_' + Math.random().toString(36).substr(2, 9);



function App() {
  const [treeData, setTreeData] = React.useState<TreeNode>({
    id: uuid(),
    name: 'root',
    children: [
      {
        id: uuid(),
        name: 'Folder 1',
        children: [
          { id: uuid(), name: 'File 1-1', children: [] },
          { id: uuid(), name: 'File 1-2', children: [] }
        ]
      },
      {
        id: uuid(),
        name: 'Folder 2',
        children: [
          { id: uuid(), name: 'File 2-1', children: [] }
        ]
      },
      {
        id: uuid(),
        name: 'File 3',
        children: []
      }
    ]
  });

  useEffect(() => {
    console.log('[treeData]: ', treeData);
  }, [treeData]);


  // Helper to add a file to a folder by id path (recursive)
  const addFileToFolder = (folderIdPath: string[], file: File) => {
    function addFile(node: TreeNode, path: string[]): TreeNode {
      // If path includes root, skip it
      if (path.length > 0 && node.id === path[0]) {
        return addFile(node, path.slice(1));
      }
      if (path.length === 0) {
        return {
          ...node,
          children: [...node.children, { id: uuid(), name: file.name, children: [] }]
        };
      }
      let found = false;
      const newChildren = node.children.map(child => {
        if (child.id === path[0]) {
          found = true;
          return addFile(child, path.slice(1));
        }
        return child;
      });
      // If no child matched, fallback: add to current node
      if (!found) {
        return {
          ...node,
          children: [...node.children, { id: uuid(), name: file.name, children: [] }]
        };
      }
      return {
        ...node,
        children: newChildren
      };
    }
    setTreeData(prev => addFile(prev, folderIdPath));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Recursive Tree Example</h2>
      <RecursiveTree node={treeData} onAttachFile={addFileToFolder} path={[]} />
    </div>
  );
}

export default App;
