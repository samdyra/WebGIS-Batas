import { useState } from 'react';
import { GenericTable } from '../shared/components/GenericTable';
import { Modal } from '../shared/components/Modal';
import { GenericForm, FieldConfig } from '../shared/components/Form';
import { useQueryLayers, useMutationCreateLayer, useMutationUpdateLayer, useMutationDeleteLayer } from './hooks';
import { ColumnDef } from '@tanstack/react-table';
import { Layer, CreateLayerParams, UpdateLayerParams } from './hooks';

export default function LayerScreen() {
  const { data: layers } = useQueryLayers();
  const { mutate: createLayer } = useMutationCreateLayer();
  const { mutate: updateLayer } = useMutationUpdateLayer();
  const { mutate: deleteLayer } = useMutationDeleteLayer();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLayer, setEditingLayer] = useState<Layer | null>(null);

  const columns: ColumnDef<Layer>[] = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Layer Name',
      accessorKey: 'layer_name',
    },
    {
      header: 'Coordinate',
      accessorKey: 'coordinate',
      cell: ({ getValue }) => {
        const coordinate = getValue() as [number, number];
        return `[${coordinate[0]}, ${coordinate[1]}]`;
      },
    },
    {
      header: 'Color',
      accessorKey: 'layer.paint.line-color',
      cell: ({ getValue }) => {
        return (
          <div
            style={{
              backgroundColor: getValue() as string,

              border: '1px solid #000',
              width: '25px',
              height: '25px',
              borderRadius: '50%',
            }}
          />
        );
      },
    },
  ];

  const formFieldsCreate: FieldConfig<CreateLayerParams>[] = [
    {
      name: 'id',
      label: 'ID',
      type: 'text',
      required: true,
      description: 'Enter the ID of the layer.',
    },

    {
      name: 'layer_name',
      label: 'Layer Name',
      type: 'text',
      required: true,
      description: 'Enter the name of the layer.',
    },
    {
      name: 'coordinate',
      label: 'Coordinate',
      type: 'text',
      required: true,
      description: 'Enter the coordinate as a comma-separated pair of numbers (e.g., 0,0).',
    },
    {
      name: 'color',
      label: 'Color',
      type: 'text',
      required: true,
      description: 'Enter the color as a hex code (e.g., #FF0000 for red).',
    },
  ];

  const formFieldEdit: FieldConfig<UpdateLayerParams>[] = [
    {
      name: 'layer_name',
      label: 'Layer Name',
      type: 'text',
      description: 'Enter the name of the layer.',
    },
    {
      name: 'coordinate',
      label: 'Coordinate',
      type: 'text',
      description: 'Enter the coordinate as a comma-separated pair of numbers (e.g., 0,0).',
    },
    {
      name: 'color',
      label: 'Color',
      type: 'text',
      description: 'Enter the color as a hex code (e.g., #FF0000 for red).',
    },
  ];

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleEdit = (layer: Layer) => {
    setEditingLayer(layer);
    setIsEditModalOpen(true);
  };

  const handleDelete = (layer: Layer) => {
    if (window.confirm('Are you sure you want to delete this layer?')) {
      deleteLayer({ id: layer.id });
    }
  };

  const handleCreateSubmit = (data: Partial<CreateLayerParams>) => {
    const coordinateArray = (data.coordinate as unknown as string).split(',').map(Number);
    console.log(data);
    createLayer({
      ...data,
      spatial_data_id: Number(data.id),
      coordinate: coordinateArray as [number, number],
    } as any);
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = (data: Partial<Layer>) => {
    if (editingLayer) {
      const coordinateArray = (data.coordinate as unknown as string).split(',').map(Number);
      updateLayer({
        id: editingLayer.id,
        ...data,
        coordinate: coordinateArray as [number, number],
      });
    }
    setIsEditModalOpen(false);
    setEditingLayer(null);
  };

  return (
    <div>
      <GenericTable
        data={layers ?? []}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Layer">
        <GenericForm<CreateLayerParams> fields={formFieldsCreate} onSubmit={handleCreateSubmit} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Layer">
        <GenericForm<UpdateLayerParams>
          fields={formFieldEdit}
          defaultValues={{
            ...editingLayer,
            coordinate: `${editingLayer?.coordinate[0]},${editingLayer?.coordinate[1]}` as unknown as [number, number],
            color: editingLayer?.layer?.paint['line-color'] as string,
          }}
          onSubmit={handleEditSubmit}
        />
      </Modal>
    </div>
  );
}
