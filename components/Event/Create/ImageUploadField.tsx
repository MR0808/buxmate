'use client';

import { useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteImage, uploadImage } from '@/actions/supabase';
import Image from 'next/image';

interface ImageUploadProps {
    name?: string;
    bucket?: string;
    type?: string;
    setUrl: React.Dispatch<React.SetStateAction<string>>;
    url: string;
}

type ProgressStage = 'preparing' | 'uploading' | 'complete' | 'error';

interface ProgressState {
    stage: ProgressStage;
    percentage: number;
    message: string;
}

const ImageUploadField = ({
    name = 'image',
    bucket = 'images',
    type = 'EVENT',
    setUrl,
    url
}: ImageUploadProps) => {
    const { setValue, watch } = useFormContext();
    const value = watch(name);

    const [isDragOver, setIsDragOver] = useState(false);
    // const [url, setUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState<ProgressState>({
        stage: 'preparing',
        percentage: 0,
        message: 'Preparing...'
    });
    const [error, setError] = useState<string | null>(null);

    const simulateUploadProgress = useCallback(() => {
        let currentProgress = 20; // Start after file preparation

        const interval = setInterval(() => {
            currentProgress += Math.random() * 15 + 5; // Random increment between 5-20%

            if (currentProgress >= 95) {
                currentProgress = 95;
                clearInterval(interval);
            }

            setProgress({
                stage: 'uploading',
                percentage: Math.min(currentProgress, 95),
                message: 'Uploading to server...'
            });
        }, 200);

        return interval;
    }, []);

    const handleFile = useCallback(
        async (file: File) => {
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }

            setIsUploading(true);
            setError(null);

            // Stage 1: File preparation with real progress
            setProgress({
                stage: 'preparing',
                percentage: 0,
                message: 'Preparing file...'
            });

            try {
                // Simulate file reading progress
                const reader = new FileReader();

                reader.onprogress = (e) => {
                    if (e.lengthComputable) {
                        const percentLoaded = Math.round(
                            (e.loaded / e.total) * 20
                        ); // 0-20% for preparation
                        setProgress({
                            stage: 'preparing',
                            percentage: percentLoaded,
                            message: 'Reading file...'
                        });
                    }
                };

                reader.onload = async () => {
                    // Stage 2: Start upload simulation
                    const progressInterval = simulateUploadProgress();

                    try {
                        // Create FormData for server action
                        const formData = new FormData();
                        formData.append('image', file);
                        formData.append('bucket', bucket);
                        formData.append('type', type);

                        // Call server action
                        const result = await uploadImage(formData);

                        // Clear progress simulation
                        clearInterval(progressInterval);

                        if (result.error) {
                            setProgress({
                                stage: 'error',
                                percentage: 0,
                                message: result.error
                            });
                            setError(result.error);
                        } else if (result.success && result.publicUrl) {
                            // Stage 3: Complete
                            setProgress({
                                stage: 'complete',
                                percentage: 100,
                                message: 'Upload complete!'
                            });

                            // Update form with the returned URL
                            setValue(name, result.imageId);
                            setUrl(result.publicUrl);

                            // Clear progress after a short delay
                            setTimeout(() => {
                                setProgress({
                                    stage: 'preparing',
                                    percentage: 0,
                                    message: 'Preparing...'
                                });
                            }, 1500);
                        }
                    } catch (uploadError) {
                        clearInterval(progressInterval);
                        const errorMessage = 'Upload failed. Please try again.';
                        setProgress({
                            stage: 'error',
                            percentage: 0,
                            message: errorMessage
                        });
                        setError(errorMessage);
                    }
                };

                reader.onerror = () => {
                    setError('Failed to read file');
                    setProgress({
                        stage: 'error',
                        percentage: 0,
                        message: 'Failed to read file'
                    });
                };

                reader.readAsArrayBuffer(file);
            } catch (error) {
                console.error('Upload failed:', error);
                setError('Upload failed. Please try again.');
                setProgress({
                    stage: 'error',
                    percentage: 0,
                    message: 'Upload failed'
                });
            } finally {
                setIsUploading(false);
            }
        },
        [bucket, simulateUploadProgress, setValue, name]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(false);

            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                handleFile(files[0]);
            }
        },
        [handleFile]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleFileSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                handleFile(files[0]);
            }
        },
        [handleFile]
    );

    const handleRemove = useCallback(async () => {
        const data = await deleteImage(url, bucket, value);
        if (data.success) {
            setError(null);
            setUrl('');
            setValue(name, '');
        }
    }, [setValue, name, url]);

    const getProgressBarColor = () => {
        switch (progress.stage) {
            case 'preparing':
                return 'bg-blue-500';
            case 'uploading':
                return 'bg-green-500';
            case 'complete':
                return 'bg-green-600';
            case 'error':
                return 'bg-red-500';
            default:
                return 'bg-blue-500';
        }
    };

    const getStatusIcon = () => {
        switch (progress.stage) {
            case 'complete':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'error':
                return <AlertCircle className="h-4 w-4 text-red-600" />;
            default:
                return null;
        }
    };

    // Show uploaded image if we have a URL and not uploading
    if (url && !isUploading) {
        return (
            <div className="relative">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image
                        src={url || '/images/assets/profile.jpg'}
                        alt="Uploaded image"
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                    />
                </div>
                <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="rounded-full p-0 mt-2 cursor-pointer"
                    onClick={handleRemove}
                >
                    <X className="h-5 w-5" /> Remove
                </Button>
                <div className="mt-2 text-xs text-green-600 text-center flex items-center justify-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Image uploaded successfully
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div
                className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'pointer-events-none' : ''}
        `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() =>
                    !isUploading &&
                    document.getElementById('image-upload')?.click()
                }
            >
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                />

                <div className="flex flex-col items-center space-y-2">
                    {isUploading ? (
                        <>
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <p className="text-sm text-gray-600">
                                {progress.message}
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                                <Upload className="h-6 w-6 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG, GIF up to 5MB
                                </p>
                                <p className="text-xs text-blue-500 mt-1">
                                    Uploads to Supabase Storage
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            {isUploading && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 flex items-center gap-1">
                            {getStatusIcon()}
                            {progress.message}
                        </span>
                        <span className="text-gray-500">
                            {progress.percentage}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
                            style={{ width: `${progress.percentage}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && !isUploading && (
                <div className="text-xs text-red-600 text-center flex items-center justify-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {error}
                </div>
            )}
        </div>
    );
};

export default ImageUploadField;
