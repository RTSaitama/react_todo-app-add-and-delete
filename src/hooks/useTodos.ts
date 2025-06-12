import { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { getTodos } from '../api/todos';
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

  return {
    todos,
    setTodos,
    error,
    setError,
    isLoading,
    setIsLoading,
  };
};
