import React, { useState } from 'react';

interface CreateArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (article: Omit<Article, 'id' | 'created_at' | 'created_by'>) => void;
}

interface Article {
  id: number;
  title: string;
  content: string;
  image_url: string;
  created_by: number;
  created_at: string;
}

const CreateArticleModal: React.FC<CreateArticleModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    image_url: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newArticle);
    setNewArticle({ title: '', content: '', image_url: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-5 border w-96 shadow-lg rounded-md">
        <h3 className="text-lg font-bold mb-4">Create New Article</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={newArticle.title}
            onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <textarea
            placeholder="Content"
            value={newArticle.content}
            onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
            rows={4}
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newArticle.image_url}
            onChange={(e) => setNewArticle({ ...newArticle, image_url: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded mr-2">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-main-green text-white rounded">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateArticleModal;
