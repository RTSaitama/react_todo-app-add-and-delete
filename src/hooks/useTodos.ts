import { useEffect, useState } from 'react';
import { Todo } from '../types/typedefs';
import { getTodos } from '../api/todosMethods';
import { TodoError } from '../types/typedefs';

export enum FilterStatus {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

export const ToDoServiceErrors = {
  Unknown: 'Something went wrong',
  UnableToLoad: 'Unable to load todos',
  Title: 'Title should not be empty',
  UnableToAddTodo: 'Unable to add a todo',
  UnableToDeleteTodo: 'Unable to delete a todo',
  UnableToUpdateTodo: 'Unable to update todos',
} as const;

const ERROR_DURATION = 3000;

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<TodoError | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.ALL,
  );

  const showError = (todoError: TodoError) => {
    setError(todoError);
    setTimeout(() => {
      setError(null);
    }, ERROR_DURATION);
  };

  let todosFiltered = [...todos];

  switch (filterStatus) {
    case FilterStatus.ACTIVE:
      todosFiltered = todosFiltered.filter(todo => !todo.completed);
      break;
    case FilterStatus.COMPLETED:
      todosFiltered = todosFiltered.filter(todo => todo.completed);
      break;
    default:
      break;
  }

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => {
        showError('Unable to load todos');
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
    filterStatus,
    setFilterStatus,
    todosFiltered,
    showError,
    tempTodo,
    setTempTodo,
  };
};
