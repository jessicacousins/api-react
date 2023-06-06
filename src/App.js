import React, { Fragment, useState } from "react";
import Pagination from "./Pagination";
import useDataApi from "./useDataApi";
import "./App.css";


function App() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "https://hp-api.onrender.com/api/characters",
    []
  );

  const handlePageChange = (e) => {
    setCurrentPage(Number(e.target.textContent));
  };

  const paginate = (items, pageNumber, pageSize) => {
    const start = (pageNumber - 1) * pageSize;
    return items.slice(start, start + pageSize);
  };

  let filteredData = data;
  if (query !== "") {
    filteredData = data.filter((character) =>
      character.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  const page = paginate(filteredData, currentPage, pageSize);

  return (
    <Fragment>
      <div className="container">
        <h1>
          <strong className="bookname">Harry Potter - </strong>
          <strong>API</strong>
        </h1>
        <form
          onSubmit={(event) => {
            doFetch(`https://hp-api.onrender.com/api/characters?name=${query}`);
            event.preventDefault();
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button className="search-button" type="submit">
            Search
          </button>
        </form>
        {isError && <div>Something went wrong ...</div>}
        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          <div className="container">
            <div className="row row-cols-4 g-4 justify-content-center">
              {page.map((character) => (
                <div key={character.name} className="col">
                  <div className="card h-100">
                    <img
                      className="card-img-top img-fluid"
                      src={character.image}
                      alt={character.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{character.name}</h5>
                      <h6 className="house-title card-subtitle mb-2">
                        {character.house}
                      </h6>
                      <p className="card-text wand ">
                        Wand: {character.wand.core}, {character.wand.wood},{" "}
                        {character.wand.length}
                      </p>
                      <p className="card-text patronus">
                        Patronus: {character.patronus}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Pagination
          items={filteredData}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </div>
    </Fragment>
  );
}

export default App;
