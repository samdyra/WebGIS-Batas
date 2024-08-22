import { useState } from 'react';
import { GenericTable } from '../shared/components/GenericTable';
import { Modal } from '../shared/components/Modal';
import { GenericForm, FieldConfig } from '../shared/components/Form';
import {
  useQuerySpatialData,
  useMutationCreateSpatialData,
  useMutationUpdateSpatialData,
  useMutationDeleteSpatialData,
  SpatialData,
  CreateSpatialDataParams,
} from './hooks';
import { ColumnDef } from '@tanstack/react-table';

export default function SpatialDataScreen() {
  const { data: spatialData, isLoading, error } = useQuerySpatialData();
  const { mutate: createSpatialData } = useMutationCreateSpatialData();
  const { mutate: updateSpatialData } = useMutationUpdateSpatialData();
  const { mutate: deleteSpatialData } = useMutationDeleteSpatialData();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSpatialData, setEditingSpatialData] = useState<SpatialData | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred</div>;

  const columns: ColumnDef<SpatialData>[] = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Table Name',
      accessorKey: 'table_name',
    },
    {
      header: 'Type',
      accessorKey: 'type',
    },
    {
      header: 'Created At',
      accessorKey: 'created_at',
    },
    {
      header: 'Updated At',
      accessorKey: 'updated_at',
    },
  ];

  const formFields: FieldConfig<CreateSpatialDataParams>[] = [
    {
      name: 'table_name',
      label: 'Table Name',
      type: 'text',
      required: true,
      description: 'Enter the name of the spatial data table.',
    },
    {
      name: 'type',
      label: 'Type',
      type: 'text',
      required: true,
      description: 'Enter the type of spatial data.',
    },
    {
      name: 'file',
      label: 'File',
      type: 'file',
      required: true,
      description: 'Upload the spatial data file.',
    },
  ];

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleEdit = (spatialData: SpatialData) => {
    setEditingSpatialData(spatialData);
    setIsEditModalOpen(true);
  };

  const handleDelete = (spatialData: SpatialData) => {
    if (window.confirm('Are you sure you want to delete this spatial data?')) {
      deleteSpatialData({ table_name: spatialData.table_name });
    }
  };

  const handleCreateSubmit = (data: CreateSpatialDataParams) => {
    console.log(data);
    createSpatialData(data);
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = (data: Partial<CreateSpatialDataParams>) => {
    if (editingSpatialData) {
      updateSpatialData({
        current_table_name: editingSpatialData.table_name,
        new_table_name: data.table_name,
        file: data.file as File,
      });
    }
    setIsEditModalOpen(false);
    setEditingSpatialData(null);
  };

  return (
    <div>
      <GenericTable
        data={spatialData ?? []}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Spatial Data">
        <GenericForm<CreateSpatialDataParams> fields={formFields} onSubmit={handleCreateSubmit} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Spatial Data">
        <GenericForm<CreateSpatialDataParams>
          fields={formFields}
          defaultValues={editingSpatialData || undefined}
          onSubmit={handleEditSubmit}
        />
      </Modal>
    </div>
  );
}
