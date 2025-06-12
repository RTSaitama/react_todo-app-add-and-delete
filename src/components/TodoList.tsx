import { useTodos } from '../hooks/useTodos';
import { useFilters } from '../hooks/useFilters';
import { TodoCard } from './TodoCard';

interface TodoListProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  todoListState: ReturnType<typeof useTodos>;
  todosFilterState: ReturnType<typeof useFilters>;
}

export const TodoList: React.FC<TodoListProps> = ({
  todoListState,
  todosFilterState,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosFilterState.todosFiltered.map(todo => (
        <TodoCard key={todo.id} todoListState={todoListState} todo={todo} />
      ))}
    </section>
  );
};
