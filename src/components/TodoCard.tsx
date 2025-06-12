/* eslint-disable no-console */
import { Todo } from '../types/typedefs';
import { useTodos } from '../hooks/useTodos';
import classNames from 'classnames';
import { deleteTodo, updateTodo } from '../api/todosMethods';

interface TodoCardProps {
  todoListState: ReturnType<typeof useTodos>;
  todo: Todo;
  isLoading: boolean;
}

export const TodoCard: React.FC<TodoCardProps> = ({
  todoListState,
  todo,
  isLoading,
}) => {
  const handleToggleSelectedTodo = async (todoId: number) => {
    const updatedTodos = todoListState.todos.map(td =>
      td.id === todoId ? { ...td, completed: !td.completed } : td,
    );

    todoListState.setTodos(updatedTodos);
    try {
      const todoCard = updatedTodos.find(td => td.id === todoId);

      await updateTodo(todoId, { completed: todoCard?.completed });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('failed to update todo Status');
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    const toDoAfterDelete = todoListState.todos.filter(td => td.id !== todoId);

    todoListState.setTodos(toDoAfterDelete);
    try {
      await deleteTodo(todoId);
    } catch (error) {
      console.log('failed to delete this todo');
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggleSelectedTodo(todo.id)}
          aria-label="todostatus-label"
        />
      </label>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay ', {
          'is-active': !isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>
    </div>
  );
};
