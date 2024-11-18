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
import Select from 'react-select';
import { Controller } from 'react-hook-form';
import shp from 'shpjs';

function formatString(input: string) {
  let trimmed = input.trim();
  let words = trimmed.split(/\s+/);
  let capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  return capitalizedWords.join('_');
}

export default function SpatialDataScreen() {
  const { data: spatialData, isLoading, error } = useQuerySpatialData();
  const { mutate: createSpatialData } = useMutationCreateSpatialData();
  const { mutate: updateSpatialData } = useMutationUpdateSpatialData();
  const { mutate: deleteSpatialData } = useMutationDeleteSpatialData();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSpatialData, setEditingSpatialData] = useState<SpatialData | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred</div>;

  const columns: ColumnDef<SpatialData>[] = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Table Name', accessorKey: 'table_name' },
    { header: 'Type', accessorKey: 'type' },
    { header: 'Created At', accessorKey: 'created_at' },
    { header: 'Updated At', accessorKey: 'updated_at' },
  ];

  const typeOptions = [
    { value: 'LINESTRING', label: 'LINESTRING' },
    { value: 'POLYGON', label: 'POLYGON' },
    { value: 'POINT', label: 'POINT' },
  ];

  const handleFileUpload = async (file: File): Promise<File> => {
    try {
      let geoJsonContent: any;

      if (file.name.endsWith('.geojson')) {
        // If it's already a GeoJSON file, we can return it as is
        return file;
      } else if (file.name.endsWith('.zip')) {
        // If it's a zip file (assumed to be a Shapefile), we need to convert it to GeoJSON
        const arrayBuffer = await file.arrayBuffer();
        geoJsonContent = await shp(arrayBuffer);
      } else {
        throw new Error('Unsupported file type. Please upload a GeoJSON or zipped Shapefile.');
      }

      // Convert the GeoJSON content to a File object
      const geoJsonBlob = new Blob([JSON.stringify(geoJsonContent)], { type: 'application/geo+json' });
      return new File([geoJsonBlob], file.name.replace('.zip', '.geojson'), { type: 'application/geo+json' });
    } catch (error) {
      console.error('Error processing file:', error);
      setUploadError(error instanceof Error ? error.message : 'An error occurred while processing the file.');
      throw error;
    }
  };

  const formFields: FieldConfig<CreateSpatialDataParams>[] = [
    {
      name: 'table_name',
      label: 'Data name',
      type: 'text',
      required: true,
      description: 'Enter the name of the spatial data table.',
    },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      required: true,
      description: 'Select the type of spatial data.',
      component: ({ control }) => (
        <Controller
          name="type"
          control={control}
          rules={{ required: 'Type is required' }}
          render={({ field, fieldState: { error } }) => (
            <>
              <Select
                options={typeOptions}
                isSearchable
                placeholder="Select spatial data type..."
                {...field}
                onChange={(option: any) => field.onChange(option.value)}
                value={typeOptions.find((option) => option.value === field.value)}
              />
              {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
            </>
          )}
        />
      ),
    },
    {
      name: 'file',
      label: 'File',
      type: 'file',
      required: true,
      description: 'Upload the spatial data file (GeoJSON or zipped Shapefile).',
    },
  ];

  const handleCreate = () => {
    setIsCreateModalOpen(true);
    setUploadError(null);
  };

  const handleEdit = (spatialData: SpatialData) => {
    setEditingSpatialData(spatialData);
    setIsEditModalOpen(true);
    setUploadError(null);
  };

  const handleDelete = (spatialData: SpatialData) => {
    if (window.confirm('Are you sure you want to delete this spatial data?')) {
      deleteSpatialData({ table_name: spatialData.table_name });
    }
  };

  const handleCreateSubmit = async (data: CreateSpatialDataParams) => {
    try {
      const geoJsonFile = await handleFileUpload(data.file as File);
      createSpatialData({
        ...data,
        table_name: formatString(data.table_name),
        file: geoJsonFile,
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      // Error is already set in handleFileUpload
    }
  };

  const handleEditSubmit = async (data: Partial<CreateSpatialDataParams>) => {
    if (editingSpatialData) {
      try {
        const geoJsonFile = data.file ? await handleFileUpload(data.file as File) : undefined;
        updateSpatialData({
          current_table_name: editingSpatialData.table_name,
          new_table_name: data.table_name ? formatString(data.table_name) : undefined,
          file: geoJsonFile,
        });
        setIsEditModalOpen(false);
        setEditingSpatialData(null);
      } catch (error) {
        // Error is already set in handleFileUpload
      }
    }
  };

  return (
    <div>
      <GenericTable
        data={spatialData ?? []}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={(data) => {
          deleteSpatialData({ table_name: data.table_name });
        }}
      />

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Spatial Data">
        <GenericForm<CreateSpatialDataParams> fields={formFields} onSubmit={handleCreateSubmit} />
        {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Spatial Data">
        <GenericForm<CreateSpatialDataParams>
          fields={formFields}
          defaultValues={editingSpatialData || undefined}
          onSubmit={handleEditSubmit}
        />
        {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
      </Modal>
    </div>
  );
}
