
import React, { useState, useEffect } from 'react';
import './App.css';
import Pokemon from "./Components/Pokemon";
import PokemonDetail from './Components/PokemonDetail';
import Chart from './Components/Chart';
import { Routes, Route, Link } from 'react-router-dom';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [hpFilter, setHpFilter] = useState(0);

  useEffect(() => {
    const fetchFirstGenPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        const detailedPokemonPromises = data.results.map(pokemon =>
          fetch(pokemon.url).then(resp => resp.json()));
        const detailedPokemonList = await Promise.all(detailedPokemonPromises);
        setPokemonList(detailedPokemonList);
        setFilteredResults(detailedPokemonList);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFirstGenPokemon();
  }, []);

  useEffect(() => {
    let results = pokemonList;
    if (searchInput) {
      results = results.filter(pokemon => pokemon.name.toLowerCase().includes(searchInput.toLowerCase()));
    }
    if (typeFilter) {
      results = results.filter(pokemon => pokemon.types.some(type => type.type.name === typeFilter));
    }
    if (hpFilter > 0) {
      results = results.filter(pokemon => pokemon.stats.find(stat => stat.stat.name === 'hp').base_stat >= hpFilter);
    }
    setFilteredResults(results);
  }, [searchInput, typeFilter, hpFilter, pokemonList]);

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
  };

  const handleHpFilterChange = (event) => {
    setHpFilter(Number(event.target.value));
  };

  const totalPokemon = filteredResults.length;
  const averageBaseExp = filteredResults.reduce((sum, pokemon) => sum + pokemon.base_experience, 0) / totalPokemon || 0;
  const typeOccurrences = filteredResults.flatMap(pokemon => pokemon.types.map(type => type.type.name));
  const mostCommonType = typeOccurrences.sort((a, b) => typeOccurrences.filter(type => type === a).length - typeOccurrences.filter(type => type === b).length).pop();

  const calculateMedian = (values) => {
    if (values.length === 0) return 0;
    values.sort((a, b) => a - b);
    const half = Math.floor(values.length / 2);
    return values.length % 2 ? values[half] : (values[half - 1] + values[half]) / 2.0;
  };
  
  const hpValues = filteredResults.map(pokemon => pokemon.stats.find(stat => stat.stat.name === 'hp').base_stat);

  return (
    <div className="App">
      <header className="header">
        <Link to="/" className="home-link">
          <h1>Pokémon Dashboard</h1>
        </Link>
      </header>
      
      <Routes>
        <Route path="/" element={
          <>
            <div className="stats-container">
              <div className="stat-card">
                <p>Total Pokémon: {totalPokemon}</p>
              </div>
              <div className="stat-card">
                <p>Average Base Experience: {averageBaseExp.toFixed(2)}</p>
              </div>
              <div className="stat-card">
                <p>Median HP: {calculateMedian(hpValues)}</p>
              </div>
              <div className="stat-card">
                <p>Most Common Type: {mostCommonType}</p>
              </div>
            </div>

            <div className="main-layout">
              <aside className="sidebar">
                <div className="search-filter-container">
                  <input
                    type="text"
                    placeholder="Search Pokémon..."
                    onChange={handleSearchChange}
                  />
                  <select onChange={handleTypeFilterChange} defaultValue="">
                    <option value="">All Types</option>
                    <option value="fire">Fire</option>
                    <option value="water">Water</option>
                    <option value="grass">Grass</option>
                    <option value="electric">Electric</option>
                    <option value="psychic">Psychic</option>
                    <option value="normal">Normal</option>
                    <option value="fighting">Fighting</option>
                    <option value="flying">Flying</option>
                    <option value="poison">Poison</option>
                    <option value="ground">Ground</option>
                    <option value="rock">Rock</option>
                    <option value="bug">Bug</option>
                    <option value="ghost">Ghost</option>
                    <option value="steel">Steel</option>
                    <option value="ice">Ice</option>
                    <option value="dragon">Dragon</option>
                    <option value="dark">Dark</option>
                    <option value="fairy">Fairy</option>
                  </select>
                  <select onChange={handleHpFilterChange} defaultValue="0">
                    <option value="0">Any HP</option>
                    <option value="50">Above 50 HP</option>
                    <option value="100">Above 100 HP</option>
                  </select>
                </div>
              </aside>
              <main className="content">
                <div className="chart-placeholder">
                  <Chart pokemonList={filteredResults} />
                </div>
                <div className="pokemon-list"> {/* This wrapper is added for list */}
                  <ul>
                    {filteredResults.map(pokemon => (
                      <li key={pokemon.id}>
                        <Link to={`/pokemon/${pokemon.name}`}>
                          <Pokemon data={pokemon} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
            </main>
            </div>
          </>
        } />
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
      </Routes>
    </div>
  );
}

export default App;
