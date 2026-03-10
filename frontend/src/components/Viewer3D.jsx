import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Center } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader';
import { X } from 'lucide-react';

const ModelParams = ({ url, extension }) => {
    let Loader;
    switch (extension) {
        case '.stl':
            Loader = STLLoader;
            break;
        case '.obj':
            Loader = OBJLoader;
            break;
        case '.3mf':
            Loader = ThreeMFLoader;
            break;
        default:
            Loader = STLLoader;
    }

    const result = useLoader(Loader, url);

    const geometry = useMemo(() => {
        if (extension === '.stl') {
            return result;
        }
        return null;
    }, [result, extension]);

    return (
        <Center>
            {extension === '.stl' ? (
                <mesh geometry={geometry}>
                    <meshStandardMaterial color="#3b82f6" roughness={0.3} metalness={0.2} />
                </mesh>
            ) : (
                <primitive object={result} />
            )}
        </Center>
    );
};

const Viewer3D = ({ file, onClose }) => {
    if (!file) return null;

    const url = `http://localhost:14285/uploads/${file.filename}`;
    const ext = file.extension;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4 sm:p-8">
            <div className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] w-full max-w-6xl h-[80vh] rounded-2xl flex flex-col shadow-2xl relative overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-[var(--color-dark-border)] bg-gray-900/50">
                    <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                        <span className="text-[var(--color-primary)]">3D View:</span> {file.originalName}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-800 text-gray-300 hover:text-white hover:bg-red-500 transition-colors rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* 3D Canvas */}
                <div className="flex-1 relative bg-gradient-to-b from-gray-900 to-black rounded-b-xl overflow-hidden cursor-move">
                    <Suspense fallback={
                        <div className="absolute inset-0 flex items-center justify-center text-[var(--color-primary)] font-medium animate-pulse">
                            Chargement du modèle 3D...
                        </div>
                    }>
                        <Canvas camera={{ position: [0, 0, 100], fov: 50 }}>
                            <color attach="background" args={['#0a0a0a']} />

                            <Stage adjustCamera intensity={0.5} environment="city">
                                <ModelParams url={url} extension={ext} />
                            </Stage>

                            <OrbitControls makeDefault />
                        </Canvas>
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default Viewer3D;
