import React, { useState } from 'react';
import classNames from 'classnames';
import { USER_ID } from './api/todosMethods';
import { UserWarning } from './UserWarning';
import { useTodos } from './hooks/useTodos';
import { FilterStatus, useFilters } from './hooks/useFilters';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const todoListState = useTodos();
  const todosFilterState = useFilters(todoListState.todos, query);

  const counter = () => {
    return todoListState.todos.filter(todo => !todo.completed).length;
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const noSpaceQuery = query.trim();

    if (!noSpaceQuery) {
      return;
    }

    setQuery('');
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: todoListState.todos.every(todo => todo.completed),
            })}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={() => handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </form>
        </header>

        <TodoList
          todoListState={todoListState}
          todosFilterState={todosFilterState}
          query={query}
          setQuery={setQuery}
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
