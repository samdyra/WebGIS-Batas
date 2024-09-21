import { useQuery, useMutation, useQueryClient } from 'react-query';
import useFetch from '../../../shared/hooks/useFetch';

const K_ARTICLE_QUERY_KEY = 'articles';

export function useQueryArticles() {
  const fetch = useFetch<Article[]>(() => ({
    method: 'GET',
    url: '/articles',
  }));

  return useQuery(K_ARTICLE_QUERY_KEY, fetch);
}

export function useQueryArticle(id: number) {
  const fetch = useFetch<Article>(() => ({
    method: 'GET',
    url: `/articles/${id}`,
  }));

  return useQuery([K_ARTICLE_QUERY_KEY, id], fetch);
}

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

export function useMutationUpdateArticle() {
  const queryClient = useQueryClient();
  const fetch = useFetch<Article, UpdateArticleParams>((data) => ({
    url: `/articles/${data?.id}`,
    method: 'PUT',
    data: {
      title: data?.title,
      content: data?.content,
      image_base64: data?.image_base64,
      image_extension: data?.image_extension,
    },
  }));

  return useMutation(fetch, {
    onSuccess: () => {
      queryClient.invalidateQueries(K_ARTICLE_QUERY_KEY);
    },
  });
}

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

export type Article = {
  id: number;
  title: string;
  author: string;
  content: string;
  image_url: string;
  created_by: number;
  created_at: string;
};

export type CreateArticleParams = {
  title: string;
  content: string;
  image_base64: string;
  image_extension: string;
};

export type UpdateArticleParams = {
  id: number;
  title?: string;
  content?: string;
  image_base64?: string;
  image_extension?: string;
};

type DeleteArticleParams = {
  id: number;
};

type DeleteArticleResponse = {
  message: string;
};
