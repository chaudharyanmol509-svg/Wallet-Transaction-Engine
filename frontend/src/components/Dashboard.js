import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getWalletBalance,
  transferFunds,
  getTransactionHistory,
  getLedgerStatus
} from '../api/walletService';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

function Dashboard() {
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState([]);
  const [ledger, setLedger] = useState(null);
  const [activeTab, setActiveTab] = useState('transfer');

  const [fromUserId] = useState(localStorage.getItem('userId') || '');
  const [toUserId, setToUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferMsg, setTransferMsg] = useState({ type: '', text: '' });

  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBalance();
    fetchHistory();
  }, []);

  const fetchBalance = async () => {
    try {
      const data = await getWalletBalance();
      setBalance(typeof data === 'object' ? data.balance ?? data : data);
    } catch (err) {
      console.error('Balance fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const data = await getTransactionHistory();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('History fetch error:', err);
    }
  };

  const fetchLedger = async () => {
    try {
      const data = await getLedgerStatus();
      setLedger(data);
    } catch (err) {
      setLedger({ error: 'Ledger not loaded. Admin access required.' });
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'ledger' && !ledger) fetchLedger();
    if (tab === 'history') fetchHistory();
  };

  const handleTransfer = async () => {
    if (!toUserId || !amount) {
      setTransferMsg({ type: 'error', text: 'Enter both Receiver ID and Amount.' });
      return;
    }
    if (parseFloat(amount) <= 0) {
      setTransferMsg({ type: 'error', text: 'Amount must be greater than 0.' });
      return;
    }
    if (!fromUserId) {
      setTransferMsg({ type: 'error', text: 'Please logout and login again — User ID not found.' });
      return;
    }
    setTransferLoading(true);
    setTransferMsg({ type: '', text: '' });
    try {
      await transferFunds(Number(fromUserId), Number(toUserId), parseFloat(amount));
      setTransferMsg({ type: 'success', text: `₹${amount} successfully transfer ho gaye User ID ${toUserId} ko!` });
      setToUserId('');
      setAmount('');
      fetchBalance();
      fetchHistory();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Transfer failed.';
      setTransferMsg({ type: 'error', text: typeof msg === 'string' ? msg : JSON.stringify(msg) });
    } finally {
      setTransferLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dash-root">
      <aside className="sidebar">
        <div className="sidebar-logo">₹ PayLedger</div>

        <div className="balance-card">
          <p className="balance-label">Wallet Balance</p>
          {loading ? (
            <p className="balance-amount">Loading...</p>
          ) : (
            <p className="balance-amount">₹ {parseFloat(balance || 0).toFixed(2)}</p>
          )}
          <button className="refresh-btn" onClick={fetchBalance}>↻ Refresh</button>
        </div>

        
        <div className="user-info">
          <p className="user-label">Logged in as</p>
          <p className="user-name">{localStorage.getItem('username') || 'User'}</p>
          <p className="user-id">User ID: <strong>{fromUserId || '—'}</strong></p>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'transfer' ? 'active' : ''}`}
            onClick={() => handleTabChange('transfer')}
          >
            💸 Transfer
          </button>
          <button
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => handleTabChange('history')}
          >
            📋 History
          </button>
          <button
            className={`nav-item ${activeTab === 'ledger' ? 'active' : ''}`}
            onClick={() => handleTabChange('ledger')}
          >
            🏦 Ledger Audit
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>Logout →</button>
      </aside>

      
      <main className="dash-main">

        {activeTab === 'transfer' && (
          <section className="panel">
            <h2 className="panel-title">Send Money</h2>
            <p className="panel-sub">Transfer funds from one wallet to another securely.</p>

            {transferMsg.text && (
              <div className={`alert ${transferMsg.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                {transferMsg.text}
              </div>
            )}

            <div className="form-group">
              <label>Your User ID (Sender)</label>
              <input
                type="number"
                value={fromUserId}
                readOnly
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label>Receiver User ID</label>
              <input
                type="number"
                placeholder="Enter the receiver's user ID..."
                value={toUserId}
                onChange={(e) => setToUserId(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                placeholder="Enter the amount..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
              />
            </div>

            <div className="idempotency-note">
              🔐 Idempotency key will be automatically generated — protected from duplicate requests.
            </div>

            <button
              className="btn-send"
              onClick={handleTransfer}
              disabled={transferLoading}
            >
              {transferLoading ? 'Processing...' : `Send ₹${amount || '0'}`}
            </button>
          </section>
        )}

        {activeTab === 'history' && (
          <section className="panel">
            <h2 className="panel-title">Transaction History</h2>
            <p className="panel-sub">A reversible record of all your transactions.</p>

            {history.length === 0 ? (
              <div className="empty-state">
                <p>No transaction received.</p>
                <span>First make a transfer or take the balance.</span>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="txn-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Timestamp</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((txn, idx) => (
                      <tr key={idx}>
                        <td>
                          <span className={`badge ${txn.type === 'CREDIT' ? 'badge-credit' : 'badge-debit'}`}>
                            {txn.type === 'CREDIT' ? '▲ CREDIT' : '▼ DEBIT'}
                          </span>
                        </td>
                        <td className={txn.type === 'CREDIT' ? 'amount-credit' : 'amount-debit'}>
                          {txn.type === 'CREDIT' ? '+' : '-'}₹{parseFloat(txn.amount).toFixed(2)}
                        </td>
                        <td className="timestamp">
                          {txn.timestamp ? new Date(txn.timestamp).toLocaleString('en-IN') : '—'}
                        </td>
                        <td className="txn-desc">{txn.description || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === 'ledger' && (
          <section className="panel">
            <h2 className="panel-title">Ledger Audit</h2>
            <p className="panel-sub">Double-entry verification — Total Credits = Total Debits must happen.</p>

            {!ledger ? (
              <p className="loading-text">Loading ledger...</p>
            ) : ledger.error ? (
              <div className="alert alert-error">{ledger.error}</div>
            ) : (
              <div className="ledger-grid">
                <div className="ledger-card credit">
                  <p className="lc-label">Total Credits</p>
                  <p className="lc-value">₹{parseFloat(ledger.totalCredits || 0).toFixed(2)}</p>
                </div>
                <div className="ledger-card debit">
                  <p className="lc-label">Total Debits</p>
                  <p className="lc-value">₹{parseFloat(ledger.totalDebits || 0).toFixed(2)}</p>
                </div>
                <div className={`ledger-card ${ledger.balanced ? 'balanced' : 'unbalanced'}`}>
                  <p className="lc-label">Status</p>
                  <p className="lc-value">{ledger.balanced ? '✅ Balanced' : '❌ Mismatch!'}</p>
                </div>
              </div>
            )}

            <button className="btn-refresh" onClick={fetchLedger}>↻ Re-check Ledger</button>
          </section>
        )}

      </main>
    </div>
  );
}

export default Dashboard;
