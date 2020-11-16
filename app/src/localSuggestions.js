const allSuggestions = (storageProvider) => {
	storageProvider.getItem("searchSuggestions")
}

const getSuggestions = input => {
	return ["a", "b", "c"]
}

export default getSuggestions