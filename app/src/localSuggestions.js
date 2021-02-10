const allSuggestions = () => {
  return JSON.parse(localStorage.getItem('searchSuggestions')) || []
}

const filteredSuggestions = (list = [], input) => {
  return list.filter(( search ) => search.startsWith(input) && !!search)
}

export const setSuggestions = ( suggestion ) => {
  const filtered = allSuggestions().filter((s) => s !== suggestion)
  const suggestions = [ ...filtered,
    suggestion ]
  localStorage.setItem('searchSuggestions', JSON.stringify(suggestions))
}


export const getSuggestions = (input, n) => {
  const allSuggestion = allSuggestions()
  const matched = filteredSuggestions(allSuggestion, input)
  return matched.slice(- n);
}


export const deleteSuggestions = (suggestion) => {
  const filtered = allSuggestions().filter((s) => s !== suggestion) 
  localStorage.setItem('searchSuggestions', JSON.stringify(filtered))
}
