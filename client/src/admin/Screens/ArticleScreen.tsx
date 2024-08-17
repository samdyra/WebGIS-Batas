import React, { useState, useEffect } from 'react';
import CreateArticleModal from '../Components/Article/CreateArticleModal';
import EditArticleModal from '../Components/Article/EditArticleModal';

interface Article {
  id: number;
  title: string;
  author: string;
  content: string;
  image_url: string;
  created_by: number;
  created_at: string;
}

const ArticleView: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<Article | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('http://localhost:8080/articles', {});

      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      const data = await response.json();
      setArticles(data);
    } catch (err) {
      setError('Failed to load articles');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjM3MzUzMDAsInVzZXJfaWQiOjEsInVzZXJuYW1lIjoic2FtZHlyYSJ9.Qn7XuXPDzyrkiQM4DvnyxICEdA2dG2gC3EP-mdQSvKg',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete article');
      }
      fetchArticles(); // Refresh the list after deletion
    } catch (err) {
      setError('Failed to delete article');
      console.error(err);
    }
  };

  const handleUpdateArticle = async (id: number, updatedArticle: Partial<Article>) => {
    try {
      const response = await fetch(`http://localhost:8080/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjM5MDc0NzgsInVzZXJfaWQiOjEsInVzZXJuYW1lIjoic2FtZHlyYSJ9.RsgIVvVxZ0wbkGyshYjROzU5iRphKfdC_KHA6tLYdao',
        },
        body: JSON.stringify(updatedArticle),
      });

      if (!response.ok) {
        throw new Error('Failed to update article');
      }

      fetchArticles(); // Refresh the list after update
      setIsEditModalOpen(false);
    } catch (err) {
      setError('Failed to update article');
      console.error(err);
    }
  };

  const handleCreateArticle = async (newArticle: Omit<Article, 'id' | 'created_at' | 'created_by' | 'author'>) => {
    try {
      const response = await fetch('http://localhost:8080/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjM5MDc1OTEsInVzZXJfaWQiOjEsInVzZXJuYW1lIjoic2FtZHlyYSJ9.fswmGB79yGwZR-TaO-UbUh7mSmASxhgPWSrTUaSX-3M',
        },
        body: JSON.stringify({
          ...newArticle,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create article');
      }
      fetchArticles(); // Refresh the list after creation
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to create article');
      console.error(err);
    }
  };

  const handleEdit = (article: Article | null) => {
    setArticleToEdit(article);
    setIsEditModalOpen(true);
  };

  const filteredArticles =
    articles?.filter((article) =>
      Object.values(article).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    ) ?? [];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />
        <button className="bg-main-green text-white p-2 rounded" onClick={() => setIsModalOpen(true)}>
          Create New Article
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Author</th>
            <th className="p-2 text-left">Content</th>
            <th className="p-2 text-left">Image URL</th>
            <th className="p-2 text-left">Created By</th>
            <th className="p-2 text-left">Created At</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredArticles?.map((article) => (
            <tr key={article.id} className="border-b">
              <td className="p-2">{article.id}</td>
              <td className="p-2">{article.title}</td>
              <td className="p-2">{article.author}</td>
              <td className="p-2">{article.content.substring(0, 50)}...</td>
              <td className="p-2">{article.image_url}</td>
              <td className="p-2">{article.created_by}</td>
              <td className="p-2">{new Date(article.created_at).toLocaleString()}</td>
              <td className="p-2">
                <button className="bg-main-blue text-white p-1 rounded mr-2" onClick={() => handleEdit(article)}>
                  Edit
                </button>
                <button className="bg-red-500 text-white p-1 rounded" onClick={() => handleDelete(article.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditArticleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateArticle}
        article={articleToEdit}
      />

      <CreateArticleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateArticle} />
    </div>
  );
};

export default ArticleView;
