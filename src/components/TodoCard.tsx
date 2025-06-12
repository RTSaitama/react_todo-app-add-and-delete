import React from 'react';
import { Todo } from '../types/Todo';
import { useTodos } from '../hooks/useTodos';

interface TodoCardProps {
  todoListState: ReturnType<typeof useTodos>;
  todo: Todo;
}

export const TodoCard: React.FC<TodoCardProps> = ({ todoListState, todo }) => {
  const handleToggleSelectedTodo = (todoId: number) => {
    const updatedTodos = todoListState.todos.map(td =>
      td.id === todoId ? { ...td, completed: !td.completed } : td,
    );

    todoListState.setTodos(updatedTodos);
  };

  return (
    <div data-cy="Todo" className="todo">
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

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>
    </div>
  );
};
