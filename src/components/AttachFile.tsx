import React from 'react';
interface AttachFileProps {
  onFileAttach?: (file: File) => void;
}

export const AttachFile: React.FC<AttachFileProps> = ({ onFileAttach }) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleAddFile = () => {
    if (selectedFile && onFileAttach) {
      onFileAttach(selectedFile);
      setSelectedFile(null);
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      <input
        type="file"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={handleAddFile}
        disabled={!selectedFile}
        style={{ marginLeft: 8 }}
      >
        Add File
      </button>
    </div>
  );
};
