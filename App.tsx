
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { PdfSelector } from './components/PdfSelector';
import { PdfViewer } from './components/PdfViewer';
import { QuizView } from './components/QuizView';
import { Dashboard } from './components/Dashboard';
import { ChatView } from './components/ChatView';
import { parsePdf } from './services/pdfParser';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { StoredPdf, QuizAttempt } from './types';
import { DocumentTextIcon, ChartBarIcon, BeakerIcon, ChatBubbleLeftRightIcon } from './components/icons';

type ActiveView = 'viewer' | 'quiz' | 'chat';

export default function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');
  const [pdfs, setPdfs] = useLocalStorage<StoredPdf[]>('pdfs', []);
  const [selectedPdf, setSelectedPdf] = useState<StoredPdf | null>(null);
  const [quizAttempts, setQuizAttempts] = useLocalStorage<QuizAttempt[]>('quizAttempts', []);
  const [isUploading, setIsUploading] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('viewer');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const existingPdf = pdfs.find(p => p.name === file.name);
      if (existingPdf) {
        setSelectedPdf(existingPdf);
        setIsUploading(false);
        return;
      }

      const textContent = await parsePdf(file);
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target?.result) {
          const newPdf: StoredPdf = {
            id: `${file.name}-${Date.now()}`,
            name: file.name,
            data: e.target.result as string,
            textContent: textContent,
          };
          const updatedPdfs = [...pdfs, newPdf];
          setPdfs(updatedPdfs);
          setSelectedPdf(newPdf);
        }
        setIsUploading(false);
      };
      fileReader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing PDF:", error);
      alert("Failed to process PDF. Please try another file.");
      setIsUploading(false);
    }
  };

  const handleSelectPdf = (pdfId: string) => {
    const pdf = pdfs.find(p => p.id === pdfId);
    if (pdf) {
      setSelectedPdf(pdf);
      setActiveView('viewer');
    }
  };

  const addQuizAttempt = (attempt: QuizAttempt) => {
    setQuizAttempts(prevAttempts => [...prevAttempts, attempt]);
  };
  
  const getFileBlob = useCallback(() => {
    if (!selectedPdf) return null;
    const byteString = atob(selectedPdf.data.split(',')[1]);
    const mimeString = selectedPdf.data.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }, [selectedPdf]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-grow flex flex-col md:flex-row gap-4 p-4 lg:p-6">
        <aside className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4">
          <PdfSelector
            pdfs={pdfs}
            selectedPdfId={selectedPdf?.id}
            onSelectPdf={handleSelectPdf}
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
          />
          <Dashboard quizAttempts={quizAttempts} pdfs={pdfs} />
        </aside>
        
        <section className="flex-grow w-full md:w-2/3 lg:w-3/4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col">
          {selectedPdf ? (
            <>
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <TabButton icon={<DocumentTextIcon />} label="Viewer" isActive={activeView === 'viewer'} onClick={() => setActiveView('viewer')} />
                <TabButton icon={<BeakerIcon />} label="Quiz" isActive={activeView === 'quiz'} onClick={() => setActiveView('quiz')} />
                <TabButton icon={<ChatBubbleLeftRightIcon />} label="Chat" isActive={activeView === 'chat'} onClick={() => setActiveView('chat')} />
              </div>
              <div className="flex-grow p-4 overflow-auto">
                {activeView === 'viewer' && <PdfViewer fileBlob={getFileBlob()} />}
                {activeView === 'quiz' && <QuizView pdf={selectedPdf} addQuizAttempt={addQuizAttempt} />}
                {activeView === 'chat' && <ChatView pdf={selectedPdf} />}
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
              <ChartBarIcon className="w-16 h-16 text-indigo-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Welcome to Your Study Hub</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Upload or select a PDF to begin generating quizzes, chatting with your document, and tracking your progress.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

interface TabButtonProps {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}
const TabButton: React.FC<TabButtonProps> = ({ icon, label, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                isActive
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    )
}
