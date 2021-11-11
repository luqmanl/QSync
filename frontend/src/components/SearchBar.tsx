import React, { useState } from 'react'
import './SearchBar.css'

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const exchanges = [
        { id: 1, name: "BTC" },
        { id: 2, name: "ETH" },
        { id: 3, name: "DOGE" },
    ];

    const filterExchanges = (exchanges: any, query: string) => {
        if (!query) {
            return exchanges;
        }
    
        return exchanges.filter((e: any) => {
            const postName = e.name.toLowerCase();
            return postName.includes(query);
        });
    };

    const filteredExchanges = filterExchanges(exchanges, query);
    
    return (
        <div className ='search-bar'>
            <input
                type='search'
                placeholder='Select an option...'
                value={query} onInput={e => setQuery((e.target as HTMLInputElement).value)}
            />
            <ul>
                {filteredExchanges.map((e: any) => (
                    <li  className='list_element' key={e.id}>
                        {e.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SearchBar;
