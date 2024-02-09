import { useState, useRef, useEffect } from 'react'
import { ACTIONTYPE } from '../hooks/useTodo'
import PencilIcon from '../icons/Pencil'
import TrashIcon from '../icons/Trash'

interface props {
  id: string,
  text: string,
  completed: boolean,
  dispatch: Function
}

function Todo({ id, text, completed, dispatch }: props) {
  const [ editing, setEditing ] = useState<boolean>(false)
  const [ validate, setValidate ] = useState<boolean>(true)

  const btnRef = useRef<HTMLButtonElement>(null)
  const inpRef = useRef<HTMLInputElement>(null)
  const checkboxRef = useRef<HTMLInputElement>(null)

  function handleComplete(): void {
    if (checkboxRef.current) {
      const action: ACTIONTYPE = { 
        type: 'editComplete',
        complete: checkboxRef.current.checked,
        id: id
      }

      dispatch(action)
    }
  }

  function handleTextEdit() {
    setEditing(!editing)
    if (editing && inpRef.current) {
      if (!inpRef.current.value.length) {
        console.log('no se pudo')
        return
      }
      const action: ACTIONTYPE = {
        type: 'editText',
        id: id,
        text: inpRef.current?.value.trim()
      }

      dispatch(action)
    }
  }

  function handleDelete() {
    const action: ACTIONTYPE = {
      type: 'delete',
      id: id
    }

    dispatch(action)
  }

  useEffect(() => {
    function handleClickOut(e: MouseEvent): void {
      if (!btnRef.current?.contains(e.target as Node) && !inpRef.current?.contains(e.target as Node)) {
        setEditing(false)
        setValidate(true)
      }
    }

    document.addEventListener('click', handleClickOut)

    return () => {
      document.removeEventListener('click', handleClickOut)
    }
  }, [])

  return (
    <li className='flex items-center justify-between border-2 border-gray-400 px-2 py-3'>
      <div className='w-1/2 sm:w-2/3'>
        {
          !editing && 
          <p 
            title={text}
            className={`w-full truncate ${completed ? 'line-through decoration-red-600' : ''}`}
          >
            {text}
          </p>
        }
        {
          editing &&
          <input 
            className='w-full focus-visible:outline-none underline'
            placeholder='Write New Text'
            type="text"
            autoFocus={true}
            onFocus={(e) => e.target.value = text}
            onChange={(e) => {
              if (!e.target.value.length)
                setValidate(false)
              else
                setValidate(true)
            }}
            ref={inpRef}
          />
        }
      </div>
      <div className='grid grid-cols-3 gap-2'>
        <button 
          onClick={handleTextEdit}
          ref={btnRef}
          className={`bg-blue-500 hover:bg-blue-600 text-white py-0.5 px-1 rounded ${editing ? 'bg-green-500 hover:bg-green-600' : ''} disabled:bg-gray-600`}
          disabled={!validate}
        >
          <PencilIcon />
        </button>
        <button
          onClick={handleDelete}
          className='py-0.5 px-1 bg-red-500 hover:bg-red-600 rounded text-white'
        >
          <TrashIcon />
        </button>
        <input
          className='rounded'
          type="checkbox"
          checked={completed}
          onChange={handleComplete}
          ref={checkboxRef}
        />
      </div>
    </li>
  )
}

export default Todo