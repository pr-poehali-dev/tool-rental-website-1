
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

// Хук для работы с API запросами
export function useApi<T, P extends any[] = any[]>(
  apiFunction: (...args: P) => Promise<T>,
  options = { showSuccessToast: false, showErrorToast: true }
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });
  
  const { toast } = useToast();

  const execute = useCallback(
    async (...args: P) => {
      try {
        setState({ data: null, isLoading: true, error: null });
        
        const result = await apiFunction(...args);
        
        setState({ data: result, isLoading: false, error: null });
        
        if (options.showSuccessToast) {
          toast({
            title: 'Успешно',
            description: 'Операция выполнена успешно',
          });
        }
        
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка';
        
        setState({
          data: null,
          isLoading: false,
          error: error instanceof Error ? error : new Error(errorMessage),
        });
        
        if (options.showErrorToast) {
          toast({
            variant: 'destructive',
            title: 'Ошибка',
            description: errorMessage,
          });
        }
        
        throw error;
      }
    },
    [apiFunction, toast, options.showSuccessToast, options.showErrorToast]
  );

  return {
    ...state,
    execute,
    reset: useCallback(() => {
      setState({ data: null, isLoading: false, error: null });
    }, []),
  };
}

// Хук для получения списка элементов с пагинацией и сортировкой
export function useApiList<T>(
  fetchFunction: (params?: any) => Promise<T[]>,
  initialParams = {}
) {
  const [items, setItems] = useState<T[]>([]);
  const [params, setParams] = useState(initialParams);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const { isLoading, error, execute } = useApi(fetchFunction, { showErrorToast: true });
  
  const loadItems = useCallback(async (page = currentPage, size = pageSize, additionalParams = {}) => {
    try {
      const newParams = {
        ...params,
        ...additionalParams,
        page,
        pageSize: size,
      };
      
      setParams(newParams);
      const data = await execute(newParams);
      
      // Предполагаем, что API возвращает массив или объект с массивом и метаданными
      if (Array.isArray(data)) {
        setItems(data);
        // Если API не возвращает общее количество, используем длину массива
        setTotalItems(data.length);
      } else if (data && 'items' in data && Array.isArray((data as any).items)) {
        setItems((data as any).items);
        setTotalItems((data as any).total || (data as any).items.length);
      }
      
      return data;
    } catch (error) {
      console.error('Error loading items:', error);
      return [];
    }
  }, [currentPage, execute, pageSize, params]);
  
  const refresh = useCallback(() => {
    return loadItems();
  }, [loadItems]);
  
  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
    loadItems(page, pageSize);
  }, [loadItems, pageSize]);
  
  const changePageSize = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении размера
    loadItems(1, size);
  }, [loadItems]);
  
  return {
    items,
    isLoading,
    error,
    totalItems,
    currentPage,
    pageSize,
    refresh,
    changePage,
    changePageSize,
    loadItems,
    setParams,
  };
}
