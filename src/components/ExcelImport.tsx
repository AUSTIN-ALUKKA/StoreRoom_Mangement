import React, { useRef } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { read, utils } from 'xlsx';
import { MaterialFormData } from '../types';

interface ExcelImportProps {
  onImport: (materials: MaterialFormData[]) => void;
}

export function ExcelImport({ onImport }: ExcelImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json<any>(worksheet);

      const materials: MaterialFormData[] = jsonData.map((row: any) => ({
        name: row.name || row.Name || '',
        requiredQuantity: Number(row.requiredQuantity || row['Required Quantity'] || 0),
        siteQuantity: Number(row.siteQuantity || row['Site Quantity'] || 0),
        threshold: Number(row.threshold || row.Threshold || 0),
      }));

      onImport(materials);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error importing Excel file:', error);
      alert('Error importing Excel file. Please check the file format and try again.');
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx,.xls"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <FileSpreadsheet className="h-5 w-5 mr-2" />
        Import Excel
      </button>
    </div>
  );
}