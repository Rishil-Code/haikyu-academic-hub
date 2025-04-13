
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { Certificate } from '@/types/user';

interface CertificateContextType {
  certificates: Certificate[];
  isLoading: boolean;
  error: string | null;
  addCertificate: (certificate: Omit<Certificate, 'id'>) => void;
  deleteCertificate: (certificateId: string) => void;
  getUserCertificates: (userId: string) => Certificate[];
  uploadCertificateFile: (file: File) => Promise<string>;
}

// Sample initial data
const SAMPLE_CERTIFICATES: Certificate[] = [
  {
    id: 'cert1',
    userId: 'student1',
    name: 'Python Programming',
    issuingAuthority: 'Coursera',
    issueDate: '2023-05-15',
    fileUrl: '',
    uploadDate: '2023-05-20',
    description: 'Completed an advanced Python programming course covering data structures, algorithms, and machine learning concepts.'
  },
];

const CertificateContext = createContext<CertificateContextType | undefined>(undefined);

export const CertificateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    try {
      const savedCertificates = localStorage.getItem('certificates');
      return savedCertificates ? JSON.parse(savedCertificates) : SAMPLE_CERTIFICATES;
    } catch (error) {
      console.error("Error loading certificates from storage:", error);
      return SAMPLE_CERTIFICATES;
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save certificates to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('certificates', JSON.stringify(certificates));
    } catch (error) {
      console.error("Error saving certificates to storage:", error);
      setError("Failed to save certificates. Please try again.");
    }
  }, [certificates]);

  const addCertificate = (certificateData: Omit<Certificate, 'id'>) => {
    try {
      const newCertificate: Certificate = {
        ...certificateData,
        id: `cert-${Date.now()}`,
        uploadDate: new Date().toISOString().split('T')[0],
      };
      
      setCertificates(prev => [...prev, newCertificate]);
      toast.success("Certificate added successfully!");
    } catch (error) {
      console.error("Error adding certificate:", error);
      setError("Failed to add certificate. Please try again.");
      toast.error("Failed to add certificate. Please try again.");
    }
  };

  const deleteCertificate = (certificateId: string) => {
    try {
      setCertificates(prev => prev.filter(cert => cert.id !== certificateId));
      toast.success("Certificate deleted successfully!");
    } catch (error) {
      console.error("Error deleting certificate:", error);
      setError("Failed to delete certificate. Please try again.");
      toast.error("Failed to delete certificate. Please try again.");
    }
  };

  const getUserCertificates = (userId: string): Certificate[] => {
    try {
      return certificates.filter(cert => cert.userId === userId);
    } catch (error) {
      console.error("Error fetching user certificates:", error);
      setError("Failed to fetch certificates. Please try again.");
      return [];
    }
  };

  // Simulated file upload function with improved error handling
  const uploadCertificateFile = async (file: File): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate network delay for upload
      return new Promise((resolve) => {
        setTimeout(() => {
          setIsLoading(false);
          const fileUrl = `file-${Date.now()}-${file.name}`;
          toast.success("File uploaded successfully!");
          resolve(fileUrl);
        }, 1500);
      });
    } catch (error) {
      setIsLoading(false);
      const errorMessage = "Failed to upload file. Please try again.";
      console.error("Error uploading file:", error);
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return (
    <CertificateContext.Provider value={{
      certificates,
      isLoading,
      error,
      addCertificate,
      deleteCertificate,
      getUserCertificates,
      uploadCertificateFile,
    }}>
      {children}
    </CertificateContext.Provider>
  );
};

export const useCertificates = () => {
  const context = useContext(CertificateContext);
  if (context === undefined) {
    throw new Error('useCertificates must be used within a CertificateProvider');
  }
  return context;
};
