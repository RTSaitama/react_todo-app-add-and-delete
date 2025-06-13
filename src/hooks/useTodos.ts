import { useEffect, useState } from 'react';
import { Todo } from '../types/typedefs';
import { getTodos } from '../api/todosMethods';
export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');

        setTimeout(() => {
          setError('');
        }, 3000);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const errorTimer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(errorTimer);
  }, [error]);

  return {
    todos,
    setTodos,
    error,
    setError,
    isLoading,
    setIsLoading,
  };
};
