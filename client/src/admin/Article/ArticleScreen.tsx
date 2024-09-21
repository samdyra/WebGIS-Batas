import { useState } from 'react';
import { GenericTable } from '../shared/components/GenericTable';
import { Modal } from '../shared/components/Modal';
import { GenericForm, FieldConfig } from '../shared/components/Form';
import {
  useQueryArticles,
  useMutationCreateArticle,
  useMutationUpdateArticle,
  useMutationDeleteArticle,
  Article,
  CreateArticleParams,
  UpdateArticleParams,
} from './hooks';
import { ColumnDef } from '@tanstack/react-table';

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
    { header: 'ID', accessorKey: 'id' },
    { header: 'Title', accessorKey: 'title' },
    { header: 'Author', accessorKey: 'author' },
    { header: 'Content', accessorKey: 'content' },
    {
      header: 'Image',
      accessorKey: 'image_url',
      cell: ({ getValue }) => <img src={getValue() as string} alt="Article" className="w-20 h-20 object-cover" />,
    },
    { header: 'Created At', accessorKey: 'created_at' },
  ];

  const formFields: FieldConfig<CreateArticleParams | UpdateArticleParams>[] = [
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
      name: 'image_base64',
      label: 'Image',
      type: 'file',
      description: 'Upload an image for the article.',
    },
  ];

  const handleCreate = () => setIsCreateModalOpen(true);

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setIsEditModalOpen(true);
  };

  const handleDelete = (article: Article) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteArticle({ id: article.id });
    }
  };

  const handleCreateSubmit = async (data: CreateArticleParams) => {
    const imageFile = data.image_base64 as unknown as File;
    const imageBase64 = await convertToBase64(imageFile);
    const strippedBase64 = imageBase64.substring(imageBase64.indexOf(',') + 1);

    const imageExtension = imageFile.name.split('.').pop() || '';

    createArticle({
      ...data,
      image_base64: strippedBase64,
      image_extension: imageExtension,
    });
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = async (data: UpdateArticleParams) => {
    if (editingArticle) {
      let imageBase64 = undefined;
      let imageExtension = undefined;
      let strippedBase64 = undefined;

      if (data.image_base64) {
        const imageFile = data.image_base64 as unknown as File;
        imageBase64 = await convertToBase64(imageFile);
        strippedBase64 = imageBase64.substring(imageBase64.indexOf(',') + 1);
        imageExtension = imageFile.name.split('.').pop() || '';
      }

      updateArticle({
        ...data,
        image_base64: strippedBase64,
        image_extension: imageExtension,
      });
    }
    setIsEditModalOpen(false);
    setEditingArticle(null);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
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
        <GenericForm<CreateArticleParams> fields={formFields} onSubmit={handleCreateSubmit} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Article">
        <GenericForm<UpdateArticleParams>
          fields={formFields}
          defaultValues={editingArticle || undefined}
          onSubmit={handleEditSubmit}
        />
      </Modal>
    </div>
  );
}
