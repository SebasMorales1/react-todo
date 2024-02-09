import { useReducer, useEffect, useState } from 'react'
import Todo from '../components/Todo'

export interface Todo {
  id: string,
  text: string,
  completed: boolean
}

interface State {
  todo: Todo[]
}

const initialState: State = { todo: [] }

export type ACTIONTYPE = 
  | { type: 'load'; todoStored: Todo[] }
  | { type: 'add'; data: Todo }
  | { type: 'editText'; text: string; id: string }
  | { type: 'editComplete'; complete: boolean; id: string }
  | { type: 'delete'; id: string}
  | { type: 'deleteCompleted' }

function reducer(state: typeof initialState, action: ACTIONTYPE) {
  switch(action.type) {
    case 'load':
      return { todo: action.todoStored }
    case 'add':
      return { todo: [...state.todo, action.data] }
    case 'editText':
      const todotext = state.todo.map((e: Todo) => {
        if (e.id === action.id)
          e.text = action.text
        return e
      })

      return { todo: todotext }
    case 'editComplete':
      const todocomplete = state.todo.map((e: Todo) => {
        if (e.id === action.id)
          e.completed = action.complete
        return e
      })

      return { todo: todocomplete }
    case 'delete':
      return { todo: state.todo.filter((e: Todo) => e.id !== action.id) }
    case 'deleteCompleted':
      return { todo: state.todo.filter((e: Todo) => !e.completed) }
    default:
      throw new Error('Unknown action.')
  }
}

export function useTodo() {
  const [ state, dispatch ] = useReducer(reducer, initialState)
  const [ loaded, setLoaded ] = useState<boolean>(false)
  
  useEffect(() => {
    const exists = localStorage.getItem('todo')

    if (exists) {
      const todoStored: Todo[] = JSON.parse(exists)
      dispatch({ type: 'load', todoStored })
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded)
      localStorage.setItem('todo', JSON.stringify(state.todo))
  }, [state])

  return { state, dispatch }
}