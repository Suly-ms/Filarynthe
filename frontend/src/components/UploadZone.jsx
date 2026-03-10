import React, { useCallback, useState, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const UploadZone = ({ onUploadSuccess }) => {
    const { token } = useContext(AuthContext);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
        setError('');

        if (rejectedFiles.length > 0) {
            setError('Certains fichiers ont été rejetés. Seuls .stl, .obj et .3mf sont autorisés.');
            return;
        }

        if (acceptedFiles.length === 0) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', acceptedFiles[0]);

        try {
            const response = await fetch('http://localhost:14285/api/files/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Erreur lors de l'upload");
            }

            const data = await response.json();
            onUploadSuccess(data.file);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setUploading(false);
        }
    }, [onUploadSuccess]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'model/stl': ['.stl'],
            'model/obj': ['.obj'],
            'model/3mf': ['.3mf'],
            'application/vnd.ms-pki.stl': ['.stl'],
            'text/plain': ['.obj']
        },
        multiple: false
    });

    return (
        <div className="w-full max-w-2xl mx-auto my-8">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-200
          ${isDragActive ? 'border-[var(--color-primary)] bg-[var(--color-dark-card)] bg-opacity-80 scale-105 shadow-xl shadow-blue-900/20' : 'border-[var(--color-dark-border)] bg-[var(--color-dark-card)] hover:border-gray-500 shadow-lg'}`}
            >
                <input {...getInputProps()} />
                <UploadCloud className={`w-16 h-16 mb-4 transition-colors ${isDragActive ? 'text-[var(--color-primary)]' : 'text-gray-400'}`} />
                <p className="text-lg font-semibold mb-2 text-center">
                    {isDragActive ? 'Relâchez pour uploader...' : 'Glissez-déposez un fichier 3D ici'}
                </p>
                <p className="text-sm text-gray-500">
                    Formats supportés : .stl, .obj, .3mf (Max 100MB)
                </p>

                {uploading && (
                    <div className="mt-6 flex items-center justify-center space-x-2 text-[var(--color-primary)] font-medium animate-pulse">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Upload en cours...</span>
                    </div>
                )}
            </div>
            {error && (
                <div className="mt-4 p-4 bg-[var(--color-danger)] bg-opacity-20 border border-[var(--color-danger)] rounded-lg text-red-400 font-medium">
                    {error}
                </div>
            )}
        </div>
    );
};

export default UploadZone;
