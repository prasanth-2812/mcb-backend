import { useState, useEffect } from 'react';

interface LoadingState {
  isLoading: boolean;
  error: string | null;
  data: any;
}

interface UseLoadingStateOptions {
  initialData?: any;
  autoLoad?: boolean;
  loadDelay?: number;
}

export const useLoadingState = (
  loadFunction: () => Promise<any>,
  options: UseLoadingStateOptions = {}
) => {
  const { initialData = null, autoLoad = true, loadDelay = 0 } = options;
  
  const [state, setState] = useState<LoadingState>({
    isLoading: autoLoad,
    error: null,
    data: initialData,
  });

  const load = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Add delay if specified
      if (loadDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, loadDelay));
      }
      
      const data = await loadFunction();
      setState(prev => ({ ...prev, isLoading: false, data, error: null }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      }));
    }
  };

  const reload = () => {
    load();
  };

  const setData = (data: any) => {
    setState(prev => ({ ...prev, data }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  useEffect(() => {
    if (autoLoad) {
      load();
    }
  }, []);

  return {
    ...state,
    load,
    reload,
    setData,
    setError,
    clearError,
  };
};

// Specialized hooks for common use cases
export const useJobLoading = (jobId: string) => {
  return useLoadingState(
    async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id: jobId, title: 'Sample Job', company: 'Sample Company' };
    },
    { autoLoad: true, loadDelay: 500 }
  );
};

export const useApplicationsLoading = () => {
  return useLoadingState(
    async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      return [];
    },
    { autoLoad: true, loadDelay: 300 }
  );
};

export const useNotificationsLoading = () => {
  return useLoadingState(
    async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      return [];
    },
    { autoLoad: true, loadDelay: 200 }
  );
};

export const useProfileLoading = () => {
  return useLoadingState(
    async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      return null;
    },
    { autoLoad: true, loadDelay: 400 }
  );
};
