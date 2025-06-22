import React, { useEffect, useState, useMemo } from 'react';

function TenantList() {
    const [tenants, setTenants] = useState([]);
    const [error, setError] = useState(null);
    const [selectedTenant, setSelectedTenant] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [ledgerError, setLedgerError] = useState(null);
    const [loadingLedger, setLoadingLedger] = useState(false);

    useEffect(() => {
        fetch('/api/tenants/')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setTenants(data))
            .catch(error => {
                console.error("Error fetching tenants:", error);
                setError(error);
            });
    }, []);

    const handleViewLedger = (tenant) => {
        setSelectedTenant(tenant);
        setLoadingLedger(true);
        setLedgerError(null);
        fetch(`/api/transactions/?tenant_id=${tenant.id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setTransactions(data))
            .catch(error => {
                setLedgerError(error);
                setTransactions([]);
            })
            .finally(() => setLoadingLedger(false));
    };

    const handleCloseLedger = () => {
        setSelectedTenant(null);
        setTransactions([]);
        setLedgerError(null);
    };

    const { totalCharges, totalPayments, balance } = useMemo(() => {
        if (!transactions || transactions.length === 0) {
            return { totalCharges: 0, totalPayments: 0, balance: 0 };
        }

        const totals = transactions.reduce((acc, txn) => {
            const amount = parseFloat(txn.amount);
            if (txn.type.toLowerCase() === 'charge') {
                acc.charges += Math.abs(amount);
            } else if (txn.type.toLowerCase() === 'payment') {
                acc.payments += amount;
            }
            return acc;
        }, { charges: 0, payments: 0 });

        const currentBalance = totals.payments - totals.charges;

        return {
            totalCharges: totals.charges,
            totalPayments: totals.payments,
            balance: currentBalance
        };
    }, [transactions]);

    const formatAmount = (amount, options = { showSign: false }) => {
        const numAmount = parseFloat(amount);
        const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(Math.abs(numAmount));

        if (options.showSign && numAmount < 0) {
            return `-${formatted}`;
        }
        return formatted;
    };

    const getTransactionTypeBadge = (type) => {
        const isCharge = type.toLowerCase() === 'charge';
        return (
            <span className={`transaction-type-badge ${isCharge ? 'charge' : 'payment'}`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
        );
    };

    const getAmountColor = (amount) => {
        const numAmount = parseFloat(amount);
        return numAmount < 0 ? '#dc3545' : '#28a745';
    };

    if (error) {
        return (
            <div className="error-container">
                <div className="error-message">
                    <h3>⚠️ Error Loading Tenants</h3>
                    <p>{error.message}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="tenant-list">
            <h2>📋 Tenant Directory</h2>
            {tenants.length === 0 ? (
                <div className="empty-state">
                    <p>No tenants found.</p>
                </div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Unit</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tenants.map(tenant => (
                            <tr key={tenant.id}>
                                <td>#{tenant.id}</td>
                                <td><strong>{tenant.name}</strong></td>
                                <td><span className="unit-badge">{tenant.unit}</span></td>
                                <td>
                                    <button onClick={() => handleViewLedger(tenant)}>
                                        📊 View Ledger
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedTenant && (
                <div className="ledger-modal">
                    <div className="ledger-content">
                        <button className="close-btn" onClick={handleCloseLedger}>&times;</button>
                        <h3>💰 Ledger for {selectedTenant.name} (Unit {selectedTenant.unit})</h3>
                        
                        {transactions.length > 0 && !loadingLedger && (
                            <div className="ledger-summary">
                                <div className="balance-summary">
                                    <div className="summary-item">
                                        <span>Total Payments</span>
                                        <span className="amount payment">{formatAmount(totalPayments)}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span>Total Charges</span>
                                        <span className="amount charge">{formatAmount(totalCharges)}</span>
                                    </div>
                                    <div className="summary-item total-balance">
                                        <span>Current Balance</span>
                                        <span className={`amount ${balance >= 0 ? 'payment' : 'charge'}`}>{formatAmount(balance, { showSign: true })}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="ledger-body">
                            {loadingLedger ? (
                                <div className="loading-state">
                                    <div className="spinner"></div>
                                    <p>Loading transactions...</p>
                                </div>
                            ) : ledgerError ? (
                                <div className="error-state">
                                    <p>❌ Error loading ledger: {ledgerError.message}</p>
                                    <button onClick={() => handleViewLedger(selectedTenant)}>Retry</button>
                                </div>
                            ) : transactions.length === 0 ? (
                                <div className="empty-ledger">
                                    <p>📭 No transactions found for this tenant.</p>
                                </div>
                            ) : (
                                <table className="ledger-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Description</th>
                                            <th>Type</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map(txn => (
                                            <tr key={txn.id}>
                                                <td>{new Date(txn.date).toLocaleDateString()}</td>
                                                <td>{txn.description}</td>
                                                <td>{getTransactionTypeBadge(txn.type)}</td>
                                                <td style={{color: getAmountColor(txn.amount)}}>
                                                    {formatAmount(txn.amount)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TenantList; 