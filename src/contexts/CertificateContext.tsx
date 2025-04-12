
import React, { createContext, useContext, useState } from 'react';
import { toast } from "sonner";
import { Certificate } from '@/types/user';

interface CertificateContextType {
  certificates: Certificate[];
  isLoading: boolean;
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
  const [certificates, setCertificates] = useState<Certificate[]>(SAMPLE_CERTIFICATES);
  const [isLoading, setIsLoading] = useState(false);

  const addCertificate = (certificateData: Omit<Certificate, 'id'>) => {
    const newCertificate: Certificate = {
      ...certificateData,
      id: `cert-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
    };
    
    setCertificates(prev => [...prev, newCertificate]);
    toast.success("Certificate added successfully!");
  };

  const deleteCertificate = (certificateId: string) => {
    setCertificates(prev => prev.filter(cert => cert.id !== certificateId));
    toast.success("Certificate deleted successfully!");
  };

  const getUserCertificates = (userId: string): Certificate[] => {
    return certificates.filter(cert => cert.userId === userId);
  };

  // Simulated file upload function
  const uploadCertificateFile = async (file: File): Promise<string> => {
    setIsLoading(true);
    
    // Simulate network delay for upload
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        resolve(`file-${Date.now()}-${file.name}`);
      }, 1500);
    });
  };

  return (
    <CertificateContext.Provider value={{
      certificates,
      isLoading,
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
