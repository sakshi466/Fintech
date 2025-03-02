import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { realtimeDB } from './firebase';
import './Dashboard.css';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mutualFunds, setMutualFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredFunds, setFilteredFunds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(realtimeDB, 'mutualFunds'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log('Fetched Data:', data);
          const fundList = Object.values(data);
          setMutualFunds(fundList);
          setFilteredFunds(fundList);
          setLoading(false);
        } else {
          console.log('No mutual fund data found.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching mutual fund data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const results = mutualFunds.filter(fund =>
      Object.values(fund).some(val => 
        val.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredFunds(results);
  }, [searchTerm, mutualFunds]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="loading-spinner">Loading...</div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search"
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <table className="funds-table">
        <thead>
          <tr>
            <th>Scheme Name</th>
            <th>NAV</th>
            <th>Date</th>
            <th>ISIN Div Payout</th>
            <th>ISIN Growth</th>
          </tr>
        </thead>
        <tbody>
          {filteredFunds.map((fund, index) => (
            <tr key={index}>
              <td>{fund.schemeName}</td>
              <td>₹{fund.nav}</td>
              <td>{fund.date}</td>
              <td>{fund.isinDivPayout}</td>
              <td>{fund.isinGrowth}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;