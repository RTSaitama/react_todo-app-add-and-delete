import { useTodos } from '../hooks/useTodos';
import { TodoCard } from './TodoCard';

interface TodoListProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  todoListState: ReturnType<typeof useTodos>;
  loadingTodoId: number | null;
  setLoadingTodoId: (id: number | null) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todoListState,
  loadingTodoId,
  setLoadingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoListState.todosFiltered.map(todo => (
        <TodoCard
          key={todo.id}
          todoListState={todoListState}
          todo={todo}
          loadingTodoId={loadingTodoId}
          setLoadingTodoId={setLoadingTodoId}
        />
      ))}
      {todoListState.tempTodo && (
        <TodoCard
          key={0}
          todo={todoListState.tempTodo}
          loadingTodoId={loadingTodoId}
          todoListState={todoListState}
          setLoadingTodoId={setLoadingTodoId}
        />
      )}
    </section>
  );
};
