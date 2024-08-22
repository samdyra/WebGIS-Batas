import { useState } from 'react';
import { GenericTable } from '../shared/components/GenericTable';
import { Modal } from '../shared/components/Modal';
import { GenericForm, FieldConfig } from '../shared/components/Form';
import {
  useQueryReports,
  useMutationCreateReport,
  useMutationUpdateReport,
  useMutationDeleteReport,
  Report,
  CreateReportParams,
  UpdateReportParams,
} from './hooks';
import { ColumnDef } from '@tanstack/react-table';

export default function ReportScreen() {
  const { data: reports, isLoading, error } = useQueryReports();
  const { mutate: createReport } = useMutationCreateReport();
  const { mutate: updateReport } = useMutationUpdateReport();
  const { mutate: deleteReport } = useMutationDeleteReport();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred</div>;

  const columns: ColumnDef<Report>[] = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Reporter Name',
      accessorKey: 'reporter_name',
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Description',
      accessorKey: 'description',
    },
    {
      header: 'Data URL',
      accessorKey: 'data_url',
    },
    {
      header: 'Created At',
      accessorKey: 'created_at',
    },
  ];

  const formFields: FieldConfig<Report>[] = [
    {
      name: 'reporter_name',
      label: 'Reporter Name',
      type: 'text',
      required: true,
      description: 'Enter the name of the person submitting the report.',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      description: 'Enter the email address of the reporter.',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      description: 'Enter a detailed description of the report.',
    },
    {
      name: 'data_url',
      label: 'Data URL',
      type: 'text',
      required: false,
      description: 'Enter the URL of any related data or files (optional).',
    },
  ];

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleEdit = (report: Report) => {
    setEditingReport(report);
    setIsEditModalOpen(true);
  };

  const handleDelete = (report: Report) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      deleteReport({ id: report.id });
    }
  };

  const handleCreateSubmit = (data: Partial<Report>) => {
    // Ensure data_url is undefined if it's an empty string
    const createData: CreateReportParams = {
      reporter_name: data.reporter_name || '',
      email: data.email || '',
      description: data.description || '',
      data_url: data.data_url && data.data_url !== '' ? data.data_url : undefined,
    };
    createReport(createData);
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = (data: Partial<Report>) => {
    if (editingReport) {
      const updateData: UpdateReportParams = {
        id: editingReport.id,
        reporter_name: data.reporter_name,
        email: data.email,
        description: data.description,
        data_url: data.data_url === null ? undefined : data.data_url,
      };
      updateReport(updateData);
    }
    setIsEditModalOpen(false);
    setEditingReport(null);
  };

  return (
    <div>
      <GenericTable
        data={reports ?? []}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Report">
        <GenericForm<Report> fields={formFields} onSubmit={handleCreateSubmit} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Report">
        <GenericForm<Report>
          fields={formFields}
          defaultValues={editingReport || undefined}
          onSubmit={handleEditSubmit}
        />
      </Modal>
    </div>
  );
}
