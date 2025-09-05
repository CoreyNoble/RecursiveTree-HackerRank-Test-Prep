import React, { useState, useRef, useEffect } from 'react';

export type TreeNode = {
  id: string;
  name: string;
  children: TreeNode[];
};

interface RecursiveTreeProps {
  node: TreeNode;
  subtreeState?: 'none' | 'expand' | 'collapse';
  onAttachFile?: (folderIdPath: string[], file: File) => void;
  path?: string[]; // array of IDs
}

export const RecursiveTree: React.FC<RecursiveTreeProps> = ({ node, subtreeState, onAttachFile, path = [] }) => {
  const isFolder = node.children.length > 0;
  const [open, setOpen] = useState(false);
  const [localSubtreeState, setLocalSubtreeState] = useState<'none' | 'expand' | 'collapse'>('none');

  // Recursively expand/collapse subtree using local subtreeState
  useEffect(() => {
    if (subtreeState === 'expand' && isFolder) {
      setOpen(true);
      setLocalSubtreeState('expand');
    } else if (subtreeState === 'collapse' && isFolder) {
      setOpen(false);
      setLocalSubtreeState('collapse');
    }
  }, [subtreeState, isFolder]);

  // Timer-based click/double-click handler using useRef
  const clickTimer = useRef<number | null>(null);
  const CLICK_DELAY = 250;

  const handleClick = () => {
    if (clickTimer.current) return;
    clickTimer.current = window.setTimeout(() => {
      setOpen((prev) => !prev);
      clickTimer.current = null;
    }, CLICK_DELAY);
  };

  const handleDoubleClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
    if (isFolder) {
      setLocalSubtreeState(!open ? 'expand' : 'collapse');
      setOpen((prev) => !prev);
    }
  };

  // File input state for this folder
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleAddFile = () => {
    if (selectedFile && onAttachFile) {
      onAttachFile([...path, node.id], selectedFile);
      setSelectedFile(null);
    }
  };

  return (
    <div style={{ marginLeft: 20 }}>
      {isFolder ? (
        <div>
          <span
            style={{ cursor: 'pointer', fontWeight: 'bold' }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            title="Click to toggle, double-click to expand all"
          >
            {open ? '📂' : '📁'} {node.name}
          </span>
          {/* Only show file input and button for folders */}
          <input
            type="file"
            style={{ marginLeft: 8 }}
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={handleAddFile}
            disabled={!selectedFile}
            style={{ marginLeft: 4 }}
          >
            Add File
          </button>
          {open && (
            <div>
              {node.children.map((child) => (
                <RecursiveTree
                  key={child.id}
                  node={child}
                  subtreeState={localSubtreeState}
                  onAttachFile={onAttachFile}
                  path={[...path, node.id]}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <span>📄 {node.name}</span>
        </div>
      )}
    </div>
  );
};
