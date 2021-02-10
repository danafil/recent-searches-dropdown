import React, { useState, useEffect } from 'react'
import './App.css'
import {
  getSuggestions,
  setSuggestions,
  deleteSuggestions
} from './localSuggestions'
import SelectDropdown from './SelectDropdown'

// FIXME Move to util

function hasClass(component, clazz) {
  const classes = component.className || ''
  return classes.split(' ').includes(clazz)
}

function Search({ onSubmit, fetchSuggestions }) {
  const [ state, setState ] = useState({
    showSuggestions: false,
    suggestions: [],
    value: '',
    selected: -1,
    lastKey: null,
  })

  const debug = { pinSuggestionList: false}

  const [ userInput, setUserInput ] = useState('')


  function parsedSuggestions(response) {
    return response
  }

  function inferSuggestionsState(val) {
    return debug.pinSuggestionList || val
  }

  function handleChange(e) {
    e.persist()
    if (userInput) {
      setUserInput(e.target.value)
    }
    setState((prevState) => ({
      ...prevState,
      value: e.target.value,
      lastKey: e.keyCode,
      showSuggestions: inferSuggestionsState(true),
    }))
  }

  function deleteSuggestion(index, option) {
    setState(prevState => ({
      ...prevState,
      suggestions: [...prevState.suggestions.slice(0, index),
        ...prevState.suggestions.slice(index + 1)]
    }))
    deleteSuggestions(option)
  }

  useEffect(() => {
    const shouldFetch = state.lastKey !== 13 &&
      state.lastKey !== 40 &&
      state.lastKey !== 38
    if (state.showSuggestions && shouldFetch) {
      const fetchFn = fetchSuggestions || ((input) => Promise.resolve(getSuggestions(input)))
      const value = state.value
      fetchFn(value).then((res) => {
        console.log('suggestions fetched')
          setState((s) => {
            return s.value === value ? {
              ...s,
              suggestions: parsedSuggestions(res),
            } : s
         })
      })
    }
  }, [fetchSuggestions, state.value, state.showSuggestions, state.lastKey])

  function handleFocus(e) {
    e.stopPropagation()
    setState({
      ...state,
      showSuggestions: inferSuggestionsState(true),
    })
  }

  function handleBlur(e) {
    console.log("BLURRR")
    console.log(e.target.className)
    if (hasClass(e.target, "js-outer")) {
      setUserInput('')
      setState((s) => (
        s.showSuggestions ? {
        ...s,
        showSuggestions: inferSuggestionsState(false),
        selectMode: false,
        selected: -1,
        lastKey: null,
      } : s ))
  
      if (state.value) {
        setSuggestions(state.value)
      }
    }
  }

  function selectOption(option) {
    console.log('option', option)
    setUserInput('')
    setState(prevState => ({
      ...prevState,
      showSuggestions: inferSuggestionsState(false),
      value: option,
    }))
    if (option) {
      setSuggestions(option)
    }
  }

  function handleKeyDown(event) {
    event.persist()
    console.log('onKeyDown', event.keyCode, state.selected, state)
    if (event.keyCode === 13) {
      setUserInput('')
      console.log('selected', state.selected)
      setState((s) => ({
        ...s,
        showSuggestions: inferSuggestionsState(false),
        selectMode: false,
        selected: -1,
        lastKey: event.keyCode,
      }))
      if (state.value) {
        setSuggestions(state.value)
      }
    } else if (event.keyCode === 40) {
      if (state.selected < 0 && !userInput)
      {
        setUserInput(state.value)
      }
      setState((s) => {
        const selectedItem = s.selected < (s.suggestions.length - 1) ?
          (s.selected + 1) % (s.suggestions.length) :
          -1

          return {
        ...s,
        selected: selectedItem,
        value: selectedItem === -1 ? userInput : s.suggestions[selectedItem],
        selectMode: true,
        lastKey: event.keyCode,
      }})
    } else if (event.keyCode === 38) {
      if (state.selected < 0 && !userInput)
      {
        setUserInput(state.value)
      }
      setState((s) => {
        const selectedItem = s.selected < 0 ? (s.suggestions.length - 1) :
          (s.selected - 1) % (s.suggestions.length)

        return {
          ...s,
          selected: selectedItem,
          value: selectedItem < 0 ? userInput : s.suggestions[selectedItem],
          selectMode: true,
          lastKey: event.keyCode,
      }})
    }
  }

  return (
    <div className="App js-outer" onClick={(e) => handleBlur(e)  }>
      <div
        className="search__container"
        onKeyDown ={(e) => handleKeyDown(e)}
        >
        <input
          type="search"
          name="search"
          placeholder="Search..."
          onChange={(e) => handleChange(e)}
          onFocus={(e) => handleFocus(e)}
          value={state.value}
          autoComplete="off"
          className="search__value"
        />
        {state.showSuggestions && <SelectDropdown 
          options={state.suggestions}
          selectOption={selectOption}
          selected={state.selected}
          deleteSuggestion={deleteSuggestion}
        />}
      </div>
    </div>
  )
}

export default Search
