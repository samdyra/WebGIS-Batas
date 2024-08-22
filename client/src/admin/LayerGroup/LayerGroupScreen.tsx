import { useState } from 'react';
import { GenericTable } from '../shared/components/GenericTable';
import { Modal } from '../shared/components/Modal';
import { GenericForm, FieldConfig } from '../shared/components/Form';
import { ColumnDef } from '@tanstack/react-table';
import useQueryLayerGroup, { LayerGroups } from './hooks/useQueryLayerGroup';
import useMutationCreateGroup, { CreateGroupParam } from './hooks/useMutationCreateGroup';
import useMutationDeleteGroup from './hooks/useMutationDeleteGroup';
import useMutationAssignGroup, { AssignGroupParam } from './hooks/useMutationAssignGroup';
import useMutationUnnasignGroup, { UnnasignGroupParam } from './hooks/useMutationUnnasignGroup';

export default function LayerGroupScreen() {
  const { data: layerGroups } = useQueryLayerGroup();
  const { mutate: createGroup } = useMutationCreateGroup();
  const { mutate: deleteGroup } = useMutationDeleteGroup();
  const { mutate: assignLayer } = useMutationAssignGroup();
  const { mutate: unassignLayer } = useMutationUnnasignGroup();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<LayerGroups | null>(null);

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

  const editFormFields: FieldConfig<{ layer_id: string; action: 'assign' | 'unassign' }>[] = [
    {
      name: 'layer_id',
      label: 'Layer ID',
      type: 'text',
      required: true,
    },
    {
      name: 'action',
      label: 'Action',
      type: 'select',
      required: true,
      options: [
        { value: 'assign', label: 'Assign' },
        { value: 'unassign', label: 'Unassign' },
      ],
    },
  ];

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleEdit = (group: LayerGroups) => {
    setEditingGroup(group);
    setIsEditModalOpen(true);
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

  const handleEditSubmit = (data: { layer_id: string; action: 'assign' | 'unassign' }) => {
    if (editingGroup) {
      const layerId = parseInt(data.layer_id);
      if (isNaN(layerId)) {
        alert('Invalid Layer ID');
        return;
      }

      const params: AssignGroupParam | UnnasignGroupParam = {
        layer_id: layerId,
        group_id: editingGroup.group_id,
      };

      if (data.action === 'assign') {
        assignLayer(params);
      } else {
        unassignLayer(params);
      }
    }
    setIsEditModalOpen(false);
    setEditingGroup(null);
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
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit ${editingGroup?.group_name}`}
      >
        <GenericForm fields={editFormFields} onSubmit={handleEditSubmit} />
      </Modal>
    </div>
  );
}
