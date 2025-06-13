/* eslint-disable no-console */
import React, { useState } from 'react';
import classNames from 'classnames';
import { deleteTodo, postTodo, updateTodo, USER_ID } from './api/todosMethods';
import { UserWarning } from './UserWarning';
import { useTodos } from './hooks/useTodos';
import { FilterStatus, useFilters } from './hooks/useFilters';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const todoListState = useTodos();
  const todosFilterState = useFilters(todoListState.todos, query);
  const [isLoading, setIsLoading] = useState(false);

  const allCompleted =
    todoListState.todos.length > 0 &&
    todoListState.todos.every(td => td.completed);

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

    todoListState.setError('');

    try {
      setIsLoading(true);
      const newTodo = await postTodo({
        title: noSpaceQuery,
        completed: false,
        userId: USER_ID,
      });

      todoListState.setTodos([...todoListState.todos, newTodo]);
      setQuery('');
    } catch (error) {
      console.log('impossible to post new todo now');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCompleted = async () => {
    if (allCompleted) {
      return;
    }

    const todosDone = todoListState.todos.filter(td => td.completed === true);

    try {
      // Спочатку видаляємо з сервера
      await Promise.all(todosDone.map(todo => deleteTodo(todo.id)));

      // Тільки після успішного видалення оновлюємо UI
      const onlyUncompletedTodos = todoListState.todos.filter(
        td => td.completed !== true,
      );

      todoListState.setTodos(onlyUncompletedTodos);
    } catch (error) {
      console.error('Failed to delete completed todos:', error);
    }
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
      console.log('Failed to toggleAll todos', error);
    }
  };

  // const handleClearCompleted = async () => {
  //   if (todoListState.todos.every(td => td.completed === false)) {
  //     return;
  //   }

  //   const todosDone = todoListState.todos.filter(td => td.completed === true);

  //   const onlyUncompletedTodos = todoListState.todos.filter(
  //     td => td.completed !== true,
  //   );

  //   todoListState.setTodos(onlyUncompletedTodos);

  //   try {
  //     todosDone.forEach(todo => deleteTodo(todo.id));
  //   } catch (error) {
  //     console.log('no todos to clear');
  //   }
  // };

  console.debug('loading:', isLoading);

  //  лінтер заглушив за "невикористання лоадінгу тимчасово"

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
              onChange={event => setQuery(event.target.value)}
              autoFocus
            />
          </form>
        </header>

        <TodoList
          todoListState={todoListState}
          todosFilterState={todosFilterState}
          query={query}
          setQuery={setQuery}
          isLoading={isLoading}
        />

        {todoListState.todos.length > 0 ? (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {counter()} items left
            </span>

            <nav className="filter" data-cy="Filter">
              {Object.entries(FilterStatus).map(([key, value]) => (
                <a
                  key={key}
                  href="#/"
                  className={classNames('filter__link', {
                    selected: todosFilterState.filterStatus === value,
                  })}
                  data-cy={`FilterLink${value}`}
                  onClick={() => todosFilterState.setFilterStatus(value)}
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
            >
              Clear completed
            </button>
          </footer>
        ) : (
          <>no Todos Left</>
        )}

        <div
          data-cy="ErrorNotification"
          className={classNames(
            'notification is-danger is-light has-text-weight-normal',
            {
              hidden: !todoListState.error,
            },
          )}
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => todoListState.setError('')}
          />
          {todoListState.error}
        </div>
      </div>
    </div>
  );
};
