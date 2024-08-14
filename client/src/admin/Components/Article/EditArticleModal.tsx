// EditArticleModal.tsx
import React, { useState, useEffect } from 'react';

interface Article {
  id: number;
  title: string;
  content: string;
  image_url: string;
}

interface EditArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, article: Partial<Article>) => void;
  article: Article | null;
}

const EditArticleModal: React.FC<EditArticleModalProps> = ({ isOpen, onClose, onSubmit, article }) => {
  const [editedArticle, setEditedArticle] = useState<Partial<Article>>({
    title: '',
    content: '',
    image_url: '',
  });

  useEffect(() => {
    if (article) {
      setEditedArticle({
        title: article.title,
        content: article.content,
        image_url: article.image_url,
      });
    }
  }, [article]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (article) {
      onSubmit(article.id, editedArticle);
    }
  };

  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-5 border w-96 shadow-lg rounded-md">
        <h3 className="text-lg font-bold mb-4">Edit Article</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={editedArticle.title}
            onChange={(e) => setEditedArticle({ ...editedArticle, title: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <textarea
            placeholder="Content"
            value={editedArticle.content}
            onChange={(e) => setEditedArticle({ ...editedArticle, content: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
            rows={4}
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={editedArticle.image_url}
            onChange={(e) => setEditedArticle({ ...editedArticle, image_url: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded mr-2">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-main-green text-white rounded">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditArticleModal;
