import React, { useContext } from 'react';
import { Download, Trash2, Eye, Box } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const FileGrid = ({ files, onView, onDelete }) => {
    const { token } = useContext(AuthContext);
    const formatSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleDateString('fr-FR', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const handleDownload = async (file) => {
        try {
            const response = await fetch(`http://localhost:14285/api/files/download/${file.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error("Erreur de téléchargement");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.originalName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error(err);
            alert("Erreur lors du téléchargement");
        }
    };

    if (files.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500 bg-[var(--color-dark-card)] rounded-xl border border-dashed border-[var(--color-dark-border)] shadow-sm">
                <Box className="w-16 h-16 mx-auto mb-4 opacity-40" />
                <p className="text-lg">Aucun modèle 3D dans le coffre-fort.</p>
                <p className="text-sm mt-2 opacity-70">Utilisez la zone ci-dessus pour importer vos premiers fichiers.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {files.map(file => (
                <div key={file.id} className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-xl overflow-hidden hover:border-gray-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 duration-300 flex flex-col group">
                    <div className="p-5 flex-grow relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 -mr-6 -mt-6 p-8 bg-gradient-to-br from-[var(--color-primary)] to-transparent opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>

                        <div className="flex items-start justify-between relative z-10">
                            <div className="flex items-center space-x-4 mb-4 w-full">
                                <div className="p-3 bg-gray-800 rounded-xl shadow-inner border border-gray-700">
                                    <Box className="w-8 h-8 text-[var(--color-primary)]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-100 truncate text-lg" title={file.originalName}>
                                        {file.originalName}
                                    </h3>
                                    <span className="inline-block mt-1 text-xs font-mono bg-gray-800 border border-gray-700 px-2 py-0.5 rounded text-gray-300">
                                        {file.extension.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-2 text-sm text-gray-400 space-y-2 relative z-10">
                            <div className="flex justify-between items-center bg-gray-900/50 p-2 rounded-lg">
                                <span>Taille</span>
                                <span className="font-medium text-gray-300">{formatSize(file.size)}</span>
                            </div>
                            <div className="flex justify-between items-center bg-gray-900/50 p-2 rounded-lg">
                                <span>Ajouté</span>
                                <span className="text-xs text-gray-300">{formatDate(file.uploadDate)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black bg-opacity-30 p-4 border-t border-[var(--color-dark-border)] flex justify-between items-center">
                        <button
                            onClick={() => onView(file)}
                            className="flex items-center space-x-2 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors bg-[var(--color-primary)]/10 px-4 py-2 rounded-lg"
                        >
                            <Eye className="w-4 h-4" />
                            <span>Voir en 3D</span>
                        </button>

                        <div className="flex space-x-1">
                            <button
                                onClick={() => handleDownload(file)}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                                title="Télécharger"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onDelete(file.id)}
                                className="p-2 text-gray-400 hover:text-[var(--color-danger)] hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Supprimer"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FileGrid;
