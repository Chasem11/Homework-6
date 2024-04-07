import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto'; // For Chart.js v3

const Chart = ({ pokemonList }) => {
  
    const typeColors = {
        fire: 'red',
        water: '#6890F0',
        grass: '#78C850',
        poison: 'purple',
        psychic: 'gold',
        ground: 'brown',
        ice: 'lightblue',
        electric: 'yellow',
        bug: '#df8830',
        ghost: 'black',
        rock: 'grey',
        fairy: 'pink',
        dragon: 'violet',
        steel: 'slategrey',
        fighting: 'lightsalmon',
        flying: 'rgb(193, 221, 255)',
        normal: '#f2f2f2',
      };
      

      const typeCounts = pokemonList.reduce((acc, pokemon) => {
        const type = pokemon.types[0].type.name; 
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});
    
      const chartData = {
        labels: Object.keys(typeCounts),
        datasets: [{
          label: 'Pokémon Type Distribution',
          data: Object.values(typeCounts),
          backgroundColor: Object.keys(typeCounts).map(type => typeColors[type]),
          hoverOffset: 4
        }]
      };
    
    return <Doughnut data={chartData} />;
};

export default Chart;