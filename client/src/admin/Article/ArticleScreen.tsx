import { useState } from 'react';
import { GenericTable } from '../shared/components/GenericTable';
import { Modal } from '../shared/components/Modal';
import { GenericForm, FieldConfig } from '../shared/components/Form';
import {
  useQueryArticles,
  useMutationCreateArticle,
  useMutationUpdateArticle,
  useMutationDeleteArticle,
} from './hooks';
import { ColumnDef } from '@tanstack/react-table';

import { Article } from './hooks';

export default function ArticleScreen() {
  const { data: articles, isLoading, error } = useQueryArticles();
  const { mutate: createArticle } = useMutationCreateArticle();
  const { mutate: updateArticle } = useMutationUpdateArticle();
  const { mutate: deleteArticle } = useMutationDeleteArticle();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred</div>;

  const columns: ColumnDef<Article>[] = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Title',
      accessorKey: 'title',
    },
    {
      header: 'Author',
      accessorKey: 'author',
    },
    {
      header: 'Content',
      accessorKey: 'content',
    },
    {
      header: 'Image',
      accessorKey: 'image_url',
    },
    {
      header: 'Created At',
      accessorKey: 'created_at',
    },
  ];

  const formFields: FieldConfig<Article>[] = [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      description: 'Enter the main title of the article.',
    },
    {
      name: 'content',
      label: 'Content',
      type: 'textarea',
      required: true,
      description: 'Enter the main body of the article. You can use markdown for formatting.',
    },
    {
      name: 'image_url',
      label: 'Image URL',
      type: 'text',
      required: true,
      description: 'Enter the URL of the main image for the article.',
    },
  ];

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setIsEditModalOpen(true);
  };

  const handleDelete = (article: Article) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteArticle({ id: article.id });
    }
  };

  const handleCreateSubmit = (data: Partial<Article>) => {
    createArticle(data as Article);
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = (data: Partial<Article>) => {
    if (editingArticle) {
      updateArticle({ id: editingArticle.id, ...data });
    }
    setIsEditModalOpen(false);
    setEditingArticle(null);
  };

  return (
    <div>
      <GenericTable
        data={articles ?? []}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Article">
        <GenericForm<Article> fields={formFields} onSubmit={handleCreateSubmit} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Article">
        <GenericForm<Article>
          fields={formFields}
          defaultValues={editingArticle || undefined}
          onSubmit={handleEditSubmit}
        />
      </Modal>
    </div>
  );
}
