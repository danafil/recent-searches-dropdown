import React from 'react';

function SelectDropdown({ options = [], selectOption }) {
	return (
		<ul>
			{options.map((option) => {
				return (
					<li key={option}
						onMouseDown={(e) => {
							console.log('li clicked')
							selectOption(option)
						}}
					>
						{option}
					</li>
				)
			})}
		</ul>
	)
}

export default SelectDropdown;