import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layers } from 'lucide-react';
import UploadZone from './components/UploadZone';
import FileGrid from './components/FileGrid';
import Viewer3D from './components/Viewer3D';

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchFiles = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/files');
      setFiles(res.data);
    } catch (err) {
      console.error("Erreur de chargement", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUploadSuccess = (newFile) => {
    setFiles([newFile, ...files]);
  };

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Voulez-vous vraiment supprimer ce fichier ?")) return;
      await axios.delete(`http://localhost:3001/api/files/${id}`);
      setFiles(files.filter(f => f.id !== id));
    } catch (err) {
      console.error("Erreur suppression", err);
    }
  };

  return (
    <div className="min-h-screen p-8 text-gray-100 flex flex-col bg-[var(--color-dark-bg)]">
      <header className="max-w-7xl mx-auto w-full mb-10 mt-6 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-[var(--color-primary)] to-blue-700 rounded-2xl shadow-lg shadow-blue-500/20">
            <Layers className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight">
            3D<span className="text-[var(--color-primary)]">-Vault</span>
          </h1>
        </div>
        <p className="text-gray-400 font-medium tracking-wide">
          Votre coffre-fort personnel de fichiers d'impression 3D
        </p>
      </header>

      <main className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        <UploadZone onUploadSuccess={handleUploadSuccess} />

        <div className="mt-12 mb-6 flex items-center justify-between border-b border-[var(--color-dark-border)] pb-4">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
            Fichiers stockés
          </h2>
          <div className="text-sm font-semibold text-gray-300 bg-[var(--color-dark-card)] px-4 py-2 rounded-full border border-[var(--color-dark-border)] shadow-inner">
            {files.length} fichier{files.length !== 1 ? 's' : ''}
          </div>
        </div>

        <FileGrid
          files={files}
          onView={(file) => setSelectedFile(file)}
          onDelete={handleDelete}
        />
      </main>

      <footer className="mt-16 text-center text-sm text-gray-500 pb-4 flex items-center justify-center space-x-2">
        <Layers className="w-4 h-4 opacity-50" />
        <span>3D-Vault &copy; {new Date().getFullYear()} - Hébergé localement</span>
      </footer>

      {selectedFile && (
        <Viewer3D
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
}

export default App;
