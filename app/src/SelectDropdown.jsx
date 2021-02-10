import React from 'react'

function SelectDropdown({
	options = [],
	selectOption,
	selected,
	deleteSuggestion,
}) {
	return (
		<ul className='search__dropdown'>
			{options.map((option, i) => {
				return (
					<li
						className={i === selected ? 'search__dropdown--item-selected' :
							'search__dropdown--item'}
						key={i}
						onClick={(e) => {
							console.log('on mouse down')
							selectOption(option)
						}}
					>
						{option}
						<button onClick={(e) => {
							console.log('I am btn')
							e.stopPropagation()
							return deleteSuggestion(i, option)}}>x</button>
					</li>
				)
			})}
		</ul>
	)
}

export default SelectDropdown
