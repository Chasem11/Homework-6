
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PokemonDetail = () => {
    const { name } = useParams();
    const [details, setDetails] = useState(null);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            const data = await response.json();
            setDetails(data);
        };

        fetchPokemonDetails();
    }, [name]);

    if (!details) return <p>Loading...</p>;

    return (
        <div>
            <div className="pokemon-card">
                <img src={details.sprites.front_default} alt={details.name} className="pokemon-sprite" />
                <h2 className="pokemon-name">{details.name}</h2>
                <div className="pokemon-types">
                    {details.types.map(typeInfo => (
                    <span key={typeInfo.type.name} className={`pokemon-type ${typeInfo.type.name}`}>
                        {typeInfo.type.name}
                    </span>
                    ))}
                </div>
                <div className="pokemon-stats">
                    {details.stats.map(statInfo => (
                    <div key={statInfo.stat.name} className="pokemon-stat">
                        {statInfo.stat.name}: {statInfo.base_stat}
                    </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PokemonDetail;
