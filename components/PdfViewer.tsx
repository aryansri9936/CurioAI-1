
import React, { useState, useEffect } from 'react';

interface PdfViewerProps {
  fileBlob: Blob | null;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ fileBlob }) => {
    const [objectUrl, setObjectUrl] = useState<string | null>(null);

    useEffect(() => {
        if (fileBlob) {
            const url = URL.createObjectURL(fileBlob);
            setObjectUrl(url);

            return () => {
                URL.revokeObjectURL(url);
            };
        }
    }, [fileBlob]);

    if (!objectUrl) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                <p>Loading PDF...</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full">
            <embed src={objectUrl} type="application/pdf" className="h-full w-full" />
        </div>
    );
};
