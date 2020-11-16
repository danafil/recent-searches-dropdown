import React, { useState, useEffect } from 'react';
import './App.css';
import fetchLocalSuggestions from './localSuggestions';
import SelectDropdown from './SelectDropdown';

function Search({ onSubmit, fetchSuggestions }) {
  const [ state, setState ] = useState({
    showSelect: false,
    suggestions: [],
    value: '',
  });

  function parsedSuggestions(response) {
    return response;
  }

  function handleChange(value) {
    setState((prevState) => ({
      ...prevState,
      value,
    }));
  }

  useEffect(() => {
    if (state.showSelect) {
      const fetchFn = fetchSuggestions || ((input) => Promise.resolve(fetchLocalSuggestions(input)))
      fetchFn(state.value).then((res) => {
          setState((s) => {
            return s.value === state.value ? {
              ...s,
              suggestions: parsedSuggestions(res),
            } : s
         })
      });
    }
  }, [fetchSuggestions, state.value, state.showSelect]);

  function handleFocus() {
    setState({
      ...state,
      showSelect: true,
    })
  }

  function handleBlur() {
    setState((s) => (
      s.showSelect ? {
      ...s,
      showSelect: true,
    } : s ))
  }

  function selectOption(option) {
    console.log('option', option)
    setState(prevState => ({
      ...prevState,
      showSelect: false,
      value: option,
    }))
  }

  return (
    <div className="App">
      <header className="App-header">
        <input
          type="search"
          name="search"
          placeholder="Search..."
          onChange={(e) => handleChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={state.value}
          autoComplete="off"
        />
        {state.showSelect && <SelectDropdown 
          options={state.suggestions}
          selectOption={selectOption}
        />}
      </header>
    </div>
  );
}

export default Search;
