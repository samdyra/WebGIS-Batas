import { useState, useMemo, useEffect } from 'react';
import { GenericTable } from '../shared/components/GenericTable';
import { Modal } from '../shared/components/Modal';
import { GenericForm, FieldConfig } from '../shared/components/Form';
import { ColumnDef } from '@tanstack/react-table';
import useQueryLayerGroup, { LayerGroups } from './hooks/useQueryLayerGroup';
import useMutationCreateGroup, { CreateGroupParam } from './hooks/useMutationCreateGroup';
import useMutationDeleteGroup from './hooks/useMutationDeleteGroup';
import useMutationAssignGroup from './hooks/useMutationAssignGroup';
import useMutationUnnasignGroup from './hooks/useMutationUnnasignGroup';
import { Controller, useForm } from 'react-hook-form';
import { useQueryLayers, Layer } from '../Layer/hooks';
import Select from 'react-select';

export default function LayerGroupScreen() {
  const { data: layerGroups, refetch: refetchLayerGroups } = useQueryLayerGroup();
  const { mutate: createGroup } = useMutationCreateGroup();
  const { mutate: deleteGroup } = useMutationDeleteGroup();
  const { mutate: assignLayer } = useMutationAssignGroup();
  const { mutate: unassignLayer } = useMutationUnnasignGroup();
  const { data: layers } = useQueryLayers();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  const { control, handleSubmit, reset } = useForm();

  const editingGroup = useMemo(() => {
    return layerGroups?.find((group) => group.group_id === editingGroupId) || null;
  }, [layerGroups, editingGroupId, forceUpdate]);

  useEffect(() => {
    if (isEditModalOpen && editingGroupId) {
      refetchLayerGroups();
    }
  }, [isEditModalOpen, editingGroupId, forceUpdate]);

  const columns: ColumnDef<LayerGroups>[] = [
    {
      header: 'Group ID',
      accessorKey: 'group_id',
    },
    {
      header: 'Group Name',
      accessorKey: 'group_name',
    },
    {
      header: 'Layers',
      accessorKey: 'layers',
      cell: ({ getValue }) => {
        return (getValue() as { layer_name: string }[]).map((layer) => layer.layer_name).join(', ');
      },
    },
  ];

  const createFormFields: FieldConfig<CreateGroupParam>[] = [
    {
      name: 'group_name',
      label: 'Group Name',
      type: 'text',
      required: true,
    },
  ];

  const layerOptions = useMemo(
    () =>
      layers?.map((layer: Layer) => ({
        value: layer.id.toString(),
        label: layer.layer_name,
      })) || [],
    [layers]
  );

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleEdit = (group: LayerGroups) => {
    setEditingGroupId(group.group_id);
    setIsEditModalOpen(true);
    reset();
  };

  const handleDelete = (group: LayerGroups) => {
    if (window.confirm(`Are you sure you want to delete the group "${group.group_name}"?`)) {
      deleteGroup({
        id: group.group_id,
      });
    }
  };

  const handleCreateSubmit = (data: CreateGroupParam) => {
    createGroup(data);
    setIsCreateModalOpen(false);
  };

  const handleAssignSubmit = (data: { layer_id: string }) => {
    if (editingGroupId) {
      const layerId = parseInt(data.layer_id);
      if (isNaN(layerId)) {
        alert('Invalid Layer ID');
        return;
      }

      assignLayer(
        {
          layer_id: layerId,
          group_id: editingGroupId,
        },
        {
          onSuccess: () => {
            setForceUpdate((prev) => prev + 1);
            reset();
          },
        }
      );
    }
  };

  const handleUnassign = (layerId: number) => {
    if (editingGroupId) {
      unassignLayer(
        {
          layer_id: layerId,
          group_id: editingGroupId,
        },
        {
          onSuccess: () => {
            setForceUpdate((prev) => prev + 1);
          },
        }
      );
    }
  };

  return (
    <div>
      <GenericTable
        data={layerGroups ?? []}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Layer Group">
        <GenericForm fields={createFormFields} onSubmit={handleCreateSubmit} />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingGroupId(null);
        }}
        title={`Edit ${editingGroup?.group_name}`}
      >
        <div className="space-y-6">
          {/* @ts-ignore */}
          <form onSubmit={handleSubmit(handleAssignSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Assign Layer</label>
              <Controller
                name="layer_id"
                control={control}
                rules={{ required: 'Layer is required' }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Select
                      options={layerOptions}
                      isSearchable
                      placeholder="Search and select layer..."
                      {...field}
                      onChange={(option: any) => field.onChange(option.value)}
                      value={layerOptions.find((option) => option.value === field.value)}
                    />
                    {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
                  </>
                )}
              />
            </div>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Assign Layer
            </button>
          </form>

          <div>
            <h3 className="text-lg font-medium text-gray-900">Assigned Layers</h3>
            <ul className="mt-3 space-y-2">
              {editingGroup?.layers.map((layer) => (
                <li key={layer.layer_id} className="flex justify-between items-center">
                  <span>{layer.layer_name}</span>
                  <button
                    onClick={() => handleUnassign(layer.layer_id)}
                    className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Unassign
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}
