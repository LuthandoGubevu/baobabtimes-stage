import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { articleService } from "../services/articleService";

/**
 * Hook to fetch published articles
 * @returns {Object}
 */
export function useArticles() {
  return useQuery({
    queryKey: ["articles", "published"],
    queryFn: articleService.getPublishedArticles,
  });
}

/**
 * Hook to fetch a single article
 * @param {string|number} id 
 * @returns {Object}
 */
export function useArticle(id) {
  return useQuery({
    queryKey: ["articles", id],
    queryFn: () => articleService.getArticleById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create an article
 * @returns {Object}
 */
export function useCreateArticle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: articleService.createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}
