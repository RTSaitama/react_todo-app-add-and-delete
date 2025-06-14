/* eslint-disable no-console */
import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { deleteTodo, postTodo, updateTodo, USER_ID } from './api/todosMethods';
import { UserWarning } from './UserWarning';
import { useTodos, FilterStatus } from './hooks/useTodos';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const todoListState = useTodos();
  const { showError } = todoListState;
  const [loadingTodo, setLoadingTodo] = useState<number | null>(null);
  const allCompleted =
    todoListState.todos.length > 0 &&
    todoListState.todos.every(td => td.completed);
  const someCompleted = todoListState.todos.some(td => td.completed);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todoListState.todos, loadingTodo]);

  const counter = () => {
    return todoListState.todos.filter(todo => !todo.completed).length;
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handlePostTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const noSpaceQuery = query.trim();

    if (!noSpaceQuery) {
      todoListState.setError('Title should not be empty');

      return;
    }

    todoListState.setError(null);

    const tempTodo = {
      id: 0,
      title: noSpaceQuery,
      completed: false,
      userId: USER_ID,
    };

    todoListState.setTempTodo(tempTodo);

    setLoadingTodo(0);

    try {
      const newTodo = await postTodo({
        title: noSpaceQuery,
        completed: false,
        userId: USER_ID,
      });

      todoListState.setTodos([...todoListState.todos, newTodo]);
      setQuery('');
    } catch {
      showError('Unable to add a todo');
    } finally {
      setLoadingTodo(null);
      todoListState.setTempTodo(null);
    }
  };

  const handleClearCompleted = async () => {
    const todosDone = todoListState.todos.filter(td => td.completed === true);

    if (todosDone.length === 0) {
      return;
    }

    const deleteResults = [];

    for (const todo of todosDone) {
      try {
        await deleteTodo(todo.id);
        deleteResults.push({ id: todo.id, success: true });
      } catch (error) {
        deleteResults.push({ id: todo.id, success: false });
        showError('Unable to delete a todo');
      }
    }

    const deletedTodos = deleteResults
      .filter(result => result.success)
      .map(result => result.id);

    const stayingTodos = todoListState.todos.filter(
      todo => !deletedTodos.includes(todo.id),
    );

    todoListState.setTodos(stayingTodos);
  };

  const handleToggleAll = async () => {
    const newIfCompletedStatus = !allCompleted;

    const todosDone = todoListState.todos.map(td => ({
      ...td,
      completed: newIfCompletedStatus,
    }));

    try {
      await Promise.all(
        todoListState.todos.map(todo =>
          updateTodo(todo.id, { completed: newIfCompletedStatus }),
        ),
      );

      todoListState.setTodos(todosDone);
    } catch (error) {
      showError('Something went wrong');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              'is-active': todoListState.todos.every(todo => todo.completed),
            })}
            data-cy="ToggleAllButton"
            onClick={handleToggleAll}
          />

          <form onSubmit={event => handlePostTodo(event)}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              ref={inputRef}
              onChange={event => setQuery(event.target.value)}
              disabled={loadingTodo !== null}
            />
          </form>
        </header>

        <TodoList
          todoListState={todoListState}
          query={query}
          setQuery={setQuery}
          loadingTodoId={loadingTodo}
          setLoadingTodoId={setLoadingTodo}
        />

        {todoListState.todos.length > 0 ? (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {counter()} items left
            </span>

            <nav className="filter" data-cy="Filter">
              {Object.values(FilterStatus).map(value => (
                <a
                  key={value}
                  href="#/"
                  className={classNames('filter__link', {
                    selected: todoListState.filterStatus === value,
                  })}
                  data-cy={`FilterLink${value}`}
                  onClick={() => todoListState.setFilterStatus(value)}
                >
                  {value}
                </a>
              ))}
            </nav>
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={!someCompleted}
            >
              Clear completed
            </button>
          </footer>
        ) : (
          <>no Todos Left</>
        )}

        <ErrorNotification
          error={todoListState.error}
          setError={todoListState.setError}
        />
      </div>
    </div>
  );
};
