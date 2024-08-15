import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const TopRunes = () => {
	const [chartData, setChartData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get('https://nodeendpoint.ngrok.app/api1/top-runes');
				const data = response.data;

				const formattedData = data.map(item => ({
					rune_name: item.rune_name,
					holders: item._count.holders
				}));

				setChartData(formattedData);
			} catch (error) {
				console.error('Error fetching top runes:', error);
			}
		};

		fetchData();
	}, []);

	return (
		<div>
			<h2>Top 10 Runes by Number of Holders</h2>
			<ResponsiveContainer width="100%" height={400}>
				<BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="rune_name" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar dataKey="holders" fill="#8884d8" />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default TopRunes;