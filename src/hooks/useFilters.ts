import { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';

export enum FilterStatus {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

export const useFilters = (todos: Todo[], query: string) => {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.ALL,
  );
  const [todosFiltered, setTodosFiltered] = useState<Todo[]>(todos);

  useEffect(() => {
    let filteredTodos = [...todos];
    const normalizedQuery = query.toLowerCase().trim();

    if (normalizedQuery) {
      filteredTodos = filteredTodos.filter(todo =>
        todo.title.toLowerCase().includes(normalizedQuery),
      );
    }

    switch (filterStatus) {
      case FilterStatus.ACTIVE:
        filteredTodos = filteredTodos.filter(todo => !todo.completed);
        break;
      case FilterStatus.COMPLETED:
        filteredTodos = filteredTodos.filter(todo => todo.completed);
        break;
      default:
        break;
    }

    setTodosFiltered(filteredTodos);
  }, [filterStatus, todos, query]);

  return {
    filterStatus,
    setFilterStatus,
    todosFiltered,
    setTodosFiltered,
  };
};
