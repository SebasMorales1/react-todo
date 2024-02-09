import { v4 as uuid } from 'uuid'

import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { useTodo, Todo as TodoInterface } from "./hooks/useTodo"
import Todo from "./components/Todo"

function App() {
  const [text, setText] = useState<string>('')
  const { state, dispatch } = useTodo()
  const [ show, setShow ] = useState<number>(0)
  const [ todos, setTodos ] = useState<TodoInterface[]>([])

  function handleSubmit(event: FormEvent): void {
    event.preventDefault()
    
    dispatch({ type: 'add', data: { id: uuid() ,text, completed: false } })
    setText('')
  }

  function handleChangeShow(event: ChangeEvent<HTMLSelectElement>) {
    const value = Number(event.target.value)

    if (!isNaN(value)) 
      setShow(value)
  }

  function deleteTodosCompleted() {
    dispatch({ type: 'deleteCompleted' })
  }

  useEffect(() => {
    if (show === 0)
      setTodos(state.todo)
    else if (show === 1) {
      const filterTodos = state.todo.filter((e: TodoInterface) => e.completed)
      setTodos(filterTodos)
    }
    else if (show === 2) {
      const filterTodos = state.todo.filter((e: TodoInterface) => !e.completed)
      setTodos(filterTodos)
    }
    else {
      setTodos([...state.todo].reverse())
    }
  }, [show, state])

  return (
    <main className="py-8">
      <h1 className="italic font-thin text-5xl text-center mb-6 text-red-700">
        TODO APP
      </h1>
      <section className="w-11/12 mx-auto sm:w-[586px] max-w-[1300px]:">
        <form onSubmit={(event) => handleSubmit(event)} className="mb-4">
          <input 
            className="outline outline-2 outline-gray-300 p-1 w-full"
            type="text"
            name="todo"
            placeholder="Add a new Todo"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </form>
        <ul className="mb-4 flex flex-col gap-3 max-h-[396px] overflow-auto">
          {
            todos.map((e: TodoInterface) => (
              <Todo
                key={e.id}
                id={e.id}
                text={e.text}
                completed={e.completed}
                dispatch={dispatch}
              />
            ))
          }
        </ul>
        <footer className="grid grid-cols-1 gap-2 bg-gray-200 p-2 sm:grid-cols-2">
          <select 
            className="py-1 px-2 bg-gray-100"
            onChange={handleChangeShow}
          >
            <option value="0" defaultChecked>Show All</option>
            <option value="1" defaultChecked>Show Completed</option>
            <option value="2" defaultChecked>Show Incomplete</option>
            <option value="3" defaultChecked>Show Recent Todos</option>
          </select>
          <button 
            className="bg-red-500 text-white py-1 px-2"
            onClick={deleteTodosCompleted}
          >
            Delete Todos Completed
          </button>
        </footer>
      </section>
    </main>
  )
}

export default App