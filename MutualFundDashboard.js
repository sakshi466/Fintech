import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { mutualFundData } from './mutualFundData';

const MutualFundDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [funds, setFunds] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFund, setNewFund] = useState({ name: '', link: '' });

  useEffect(() => {
    const initializedFunds = mutualFundData.map(fund => ({
      ...fund,
      status: '',
      timestamp: ''
    }));
    setFunds(initializedFunds);
  }, []);

  // Live timestamp update for "Successful" funds
  useEffect(() => {
    const interval = setInterval(() => {
      setFunds(prevFunds =>
        prevFunds.map(fund => {
          if (fund.status === 'Successful') {
            return {
              ...fund,
              timestamp: new Date().toLocaleString('sv-SE').slice(0, 16)
            };
          }
          return fund;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const statusOptions = ["Select Status", "Applied", "Pursuing", "Successful"];

  const handleStatusChange = (index, newStatus) => {
    const updatedFunds = [...funds];
    updatedFunds[index] = {
      ...updatedFunds[index],
      status: newStatus,
      timestamp: newStatus === 'Successful' ? new Date().toLocaleString('sv-SE').slice(0, 16) : ''
    };
    setFunds(updatedFunds);
  };

  const handleTimestampChange = (index, newTimestamp) => {
    const updatedFunds = [...funds];
    updatedFunds[index] = {
      ...updatedFunds[index],
      timestamp: newTimestamp
    };
    setFunds(updatedFunds);
  };

  const handleAddFund = () => {
    if (newFund.name && newFund.link) {
      const newFundEntry = {
        name: newFund.name,
        link: newFund.link,
        status: '',
        timestamp: ''
      };
      setFunds([...funds, newFundEntry]);
      setNewFund({ name: '', link: '' });
      setShowAddForm(false);
    }
  };

  const filteredFunds = funds.filter(fund =>
    fund.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <style>{`
        /* Scrollbar Styles */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: #4285f4;
          border-radius: 4px;
          transition: background 0.2s ease;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #356ac3;
        }

        * {
          scrollbar-width: thin;
          scrollbar-color: #4285f4 #f1f1f1;
        }

        /* Global Styles */
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #f8f9fa;
        }

        .dashboard-container {
          height: 100vh;
          overflow-y: auto;
          padding: 20px;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        h1 {
          color: #1a1a1a;
          font-size: 28px;
          font-weight: bold;
          text-align: center;
          margin: 20px 0 30px;
          position: static;
          top: 0;
          background: #f8f9fa;
          padding: 20px 0;
          z-index: 1;
        }

        .search-container {
          position: static;
          top: 90px;
          z-index: 1;
        
          padding: 10px 0;
          max-width: 800px;
          margin: 0 auto 20px;
        }

        .search-input {
          width: 100%;
          padding: 12px 40px 12px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
          background-color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .search-input:focus {
          outline: none;
          border-color: #4285f4;
          box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.1);
        }

        .search-icon {
          position: relative;
       
          top: -15px;
          left:800px;
          transform: translateY(-50%);
          color: #757575;
        }

        .table-container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-top: 20px;
          overflow-x: auto;
        }

        .funds-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        thead {
          background: linear-gradient(to right, #4285f4, #356ac3);
          position: relative;
          top: 0px;
          z-index: 1;
        }

        thead th {
          color: white;
          font-weight: 600;
          padding: 16px;
          text-align: left;
          font-size: 14px;
        }

        tbody tr {
          border-bottom: 1px solid #f0f0f0;
        }

        tbody tr:last-child {
          border-bottom: none;
        }

        tbody tr:hover {
          background-color: #f8f9fa;
        }

        td {
          padding: 16px;
          color: #333;
          font-size: 14px;
          vertical-align: middle;
        }

        td a {
          color: #4285f4;
          text-decoration: none;
          font-weight: 500;
        }

        td a:hover {
          text-decoration: underline;
        }

        select {
          padding: 8px 32px 8px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          font-size: 14px;
          color: #333;
          background-color: white;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          appearance: none;
          cursor: pointer;
        }

        select:focus {
          outline: none;
          border-color: #4285f4;
          box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.1);
        }

        input[type="datetime-local"] {
          padding: 8px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          font-size: 14px;
          color: #333;
          background-color: #f8f9fa;
          width: 100%;
          max-width: 200px;
        }

        input[type="datetime-local"]:not([disabled]) {
          background-color: white;
          cursor: pointer;
        }

        input[type="datetime-local"]:focus {
          outline: none;
          border-color: #4285f4;
          box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.1);
        }

        .add-fund-form {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .add-fund-form input {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          font-size: 14px;
        }

        .add-fund-form button {
          padding: 10px 20px;
          background-color: #4285f4;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .add-fund-form button:hover {
          background-color: #356ac3;
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 10px;
          }

          h1 {
            font-size: 24px;
            margin: 15px 0 20px;
            padding: 15px 0;
          }

          thead th,
          td {
            padding: 12px 8px;
            font-size: 13px;
          }

          select,
          input[type="datetime-local"] {
            padding: 6px 8px;
            font-size: 13px;
          }

          .search-container {
            top: 80px;
          }

          thead {
            top: 160px;
          }
        }
      `}</style>

      <h1>Mutual Fund House Dashboard</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search mutual fund houses..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="search-icon">
          <Search size={20} />
        </div>
      </div>

      <button
        onClick={() => setShowAddForm(!showAddForm)}
        style={{
          display: 'block',
          margin: '0 auto 20px',
          padding: '10px 20px',
          backgroundColor: '#4285f4',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        <Plus size={16} style={{ marginRight: '8px' }} />
        Add New Fund House
      </button>

      {showAddForm && (
        <div className="add-fund-form">
          <input
            type="text"
            placeholder="Fund House Name"
            value={newFund.name}
            onChange={(e) => setNewFund({ ...newFund, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Empanelment Link"
            value={newFund.link}
            onChange={(e) => setNewFund({ ...newFund, link: e.target.value })}
          />
          <button onClick={handleAddFund}>Save Fund House</button>
        </div>
      )}

      <div className="table-container">
        <table className="funds-table">
          <thead>
            <tr>
              <th>Mutual Fund House</th>
              <th>Empanelment Link</th>
              <th>Status</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredFunds.map((fund, index) => (
              <tr key={index}>
                <td>{fund.name}</td>
                <td>
                  <a href={fund.link} target="_blank" rel="noopener noreferrer">
                    Empanel Now
                  </a>
                </td>
                <td>
                  <select 
                    value={fund.status} 
                    onChange={(e) => handleStatusChange(index, e.target.value)}
                  >
                    {statusOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="datetime-local"
                    value={fund.timestamp}
                    onChange={(e) => handleTimestampChange(index, e.target.value)}
                    disabled={fund.status !== 'Successful'}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MutualFundDashboard;