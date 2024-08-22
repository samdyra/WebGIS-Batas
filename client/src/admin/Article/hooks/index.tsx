import { useQuery, useMutation, useQueryClient } from 'react-query';
import useFetch from '../../../shared/hooks/useFetch';

// Key for article-related queries
const K_ARTICLE_QUERY_KEY = 'articles';

// Hook for fetching all articles
export function useQueryArticles() {
  const fetch = useFetch<Article[]>(() => ({
    method: 'GET',
    url: '/articles',
  }));

  return useQuery(K_ARTICLE_QUERY_KEY, fetch);
}

// Hook for fetching a specific article
export function useQueryArticle(id: number) {
  const fetch = useFetch<Article>(() => ({
    method: 'GET',
    url: `/articles/${id}`,
  }));

  return useQuery([K_ARTICLE_QUERY_KEY, id], fetch);
}

// Hook for creating a new article
export function useMutationCreateArticle() {
  const queryClient = useQueryClient();
  const fetch = useFetch<Article, CreateArticleParams>((data) => ({
    url: '/articles',
    method: 'POST',
    data,
  }));

  return useMutation(fetch, {
    onSuccess: () => {
      queryClient.invalidateQueries(K_ARTICLE_QUERY_KEY);
    },
  });
}

// Hook for updating an existing article
export function useMutationUpdateArticle() {
  const queryClient = useQueryClient();
  const fetch = useFetch<Article, UpdateArticleParams>((data) => ({
    url: `/articles/${data?.id}`,
    method: 'PUT',
    data: {
      title: data?.title,
      content: data?.content,
      image_url: data?.image_url,
    },
  }));

  return useMutation(fetch, {
    onSuccess: () => {
      queryClient.invalidateQueries(K_ARTICLE_QUERY_KEY);
    },
  });
}

// Hook for deleting an article
export function useMutationDeleteArticle() {
  const queryClient = useQueryClient();
  const fetch = useFetch<DeleteArticleResponse, DeleteArticleParams>((params) => ({
    url: `/articles/${params?.id}`,
    method: 'DELETE',
  }));

  return useMutation(fetch, {
    onSuccess: () => {
      queryClient.invalidateQueries(K_ARTICLE_QUERY_KEY);
    },
  });
}

// Types
export type Article = {
  id: number;
  title: string;
  author: string;
  content: string;
  image_url: string;
  created_by: number;
  created_at: string;
};

type CreateArticleParams = {
  title: string;
  content: string;
  image_url: string;
};

type UpdateArticleParams = {
  id: number;
  title?: string;
  content?: string;
  image_url?: string;
};

type DeleteArticleParams = {
  id: number;
};

type DeleteArticleResponse = {
  message: string;
};
