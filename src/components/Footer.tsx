// import React from 'react'

// export const Footer = () => {
//   return (
//     <footer className="todoapp__footer" data-cy="Footer">
//       <span className="todo-count" data-cy="TodosCounter">
//         {counter()} items left
//       </span>

//       <nav className="filter" data-cy="Filter">
//         {Object.values(FilterStatus).map(value => (
//           <a
//             key={value}
//             href="#/"
//             className={classNames('filter__link', {
//               selected: todoListState.filterStatus === value,
//             })}
//             data-cy={`FilterLink${value}`}
//             onClick={() => todoListState.setFilterStatus(value)}
//           >
//             {value}
//           </a>
//         ))}
//       </nav>
//       <button
//         type="button"
//         className="todoapp__clear-completed"
//         data-cy="ClearCompletedButton"
//         onClick={handleClearCompleted}
//         disabled={!someCompleted}
//       >
//         Clear completed
//       </button>
//     </footer>
//   )
// }
