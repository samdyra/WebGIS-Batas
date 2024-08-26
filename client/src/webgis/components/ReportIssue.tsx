import React, { useState } from 'react';
import { useMutationCreateReport } from '../../admin/Reports/hooks';

const ReportIssue: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [supportingData, setSupportingData] = useState<string | null>(null);
  const [fileExtension, setFileExtension] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const createReportMutation = useMutationCreateReport();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const extension = file.name.split('.').pop();
      setFileExtension(extension || null);

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        const strippedBase64 = base64String.substring(base64String.indexOf(',') + 1);
        setSupportingData(strippedBase64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const reportData = {
        reporter_name: name,
        email,
        description,
        data_file: supportingData ?? '',
        file_extension: fileExtension ?? '',
      };

      await createReportMutation.mutateAsync(reportData);

      // Reset form after successful submission
      setName('');
      setEmail('');
      setDescription('');
      setSupportingData(null);
      setFileExtension(null);
      setFileName(null);

      alert('Report submitted successfully!');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  return (
    <div className="border-2 mx-sm pt-sm rounded-md h-full mb-2 p-4">
      <h2 className="text-lg font-bold mb-4">Lapor Isu Batas Daerah</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="supportingData">
            Supporting Data
          </label>
          <input
            id="supportingData"
            type="file"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {fileName && <p className="mt-2 text-sm text-gray-600">File selected: {fileName}</p>}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-main-green hover:bg-main-green-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={createReportMutation.isLoading}
          >
            {createReportMutation.isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportIssue;
