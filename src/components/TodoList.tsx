import { useTodos } from '../hooks/useTodos';
import { TodoCard } from './TodoCard';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
const TRANSITION_DELAY = 300; // m

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
      <TransitionGroup>
        {todoListState.todosFiltered.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={TRANSITION_DELAY}
            classNames="item"
          >
            <TodoCard
              key={todo.id}
              todoListState={todoListState}
              todo={todo}
              loadingTodoId={loadingTodoId}
              setLoadingTodoId={setLoadingTodoId}
            />
          </CSSTransition>
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
      </TransitionGroup>
    </section>
  );
};
