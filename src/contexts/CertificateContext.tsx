
import React, { createContext, useContext, useState } from 'react';
import { toast } from "sonner";
import { Certificate } from '@/types/user';

interface CertificateContextType {
  certificates: Certificate[];
  addCertificate: (certificate: Omit<Certificate, 'id'>) => void;
  deleteCertificate: (certificateId: string) => void;
  getUserCertificates: (userId: string) => Certificate[];
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
  },
];

const CertificateContext = createContext<CertificateContextType | undefined>(undefined);

export const CertificateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [certificates, setCertificates] = useState<Certificate[]>(SAMPLE_CERTIFICATES);

  const addCertificate = (certificateData: Omit<Certificate, 'id'>) => {
    const newCertificate: Certificate = {
      ...certificateData,
      id: `cert-${Date.now()}`,
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

  return (
    <CertificateContext.Provider value={{
      certificates,
      addCertificate,
      deleteCertificate,
      getUserCertificates,
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
