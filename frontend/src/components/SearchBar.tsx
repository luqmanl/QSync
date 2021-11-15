import React, { useState } from "react";
import "./SearchBar.css";

type queryType = {
  id: number,
  name: string
}
const SearchBar = () => {
  const [query, setQuery] = useState("");
  const exchanges: queryType[] = [
    { id: 1, name: "BTC" },
    { id: 2, name: "ETH" },
    { id: 3, name: "DOGE" },
  ];

  const filterExchanges = (exchanges: queryType[], query: string) => {
    if (!query) {
      return exchanges;
    }

    return Object.values(exchanges).filter((e) => {
      const postName = e.name.toLowerCase();
      return postName.includes(query);
    });
  };

  const filteredExchanges = filterExchanges(exchanges, query);

  return (
    <div className="search-bar">
      <input
        type="search"
        placeholder="Select an option..."
        value={query}
        onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
      />
      <ul>
        {filteredExchanges.map((e) => (
          <li className="list_element" key={e.id}>
            {e.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
