import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBankAccounts } from '../hooks/useBankAccounts';
import { ChevronLeft, Link2, Trash2, RefreshCw } from 'lucide-react';

export const Settings = () => {
  const navigate = useNavigate();
  const { accounts, loading, connectBank, deleteBank, syncBankTransactions } = useBankAccounts();
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [bankForm, setBankForm] = useState({
    bankName: 'Chase',
    accountType: 'checking' as 'checking' | 'savings',
    lastFour: '',
  });
  const [syncing, setSyncing] = useState<string | null>(null);

  const handleConnect = async () => {
    if (bankForm.lastFour.length !== 4) {
      alert('Please enter last 4 digits');
      return;
    }
    await connectBank(bankForm.bankName, bankForm.accountType, bankForm.lastFour);
    setBankForm({ bankName: 'Chase', accountType: 'checking', lastFour: '' });
    setShowConnectForm(false);
  };

  const handleSync = async (accountId: string) => {
    setSyncing(accountId);
    await syncBankTransactions(accountId);
    setSyncing(null);
  };

  const banks = ['Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'US Bank', 'Capital One'];

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-32 pt-4">
      <div className="max-w-[390px] mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-syne font-bold">Settings</h1>
        </div>

        <div className="mb-6">
          <h2 className="text-white font-syne font-bold text-lg mb-3 flex items-center gap-2">
            <Link2 size={20} className="text-accent-purple" />
            Connected Banks
          </h2>

          {accounts.length === 0 && (
            <p className="text-white/60 text-sm mb-4">No connected bank accounts yet</p>
          )}

          <div className="space-y-3 mb-4">
            {accounts.map((account) => (
              <div key={account.id} className="glass-card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold text-sm">{account.bank_name}</p>
                    <p className="text-white/60 text-xs">
                      {account.account_type === 'checking' ? 'Checking' : 'Savings'} ••••{account.last_four}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    account.is_connected
                      ? 'bg-accent-green/20 text-accent-green'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {account.is_connected ? '✓ Connected' : 'Disconnected'}
                  </span>
                </div>

                {account.last_synced && (
                  <p className="text-white/50 text-xs mb-3">
                    Last synced: {new Date(account.last_synced).toLocaleDateString()}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSync(account.id)}
                    disabled={syncing === account.id || !account.is_connected}
                    className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={16} />
                    {syncing === account.id ? 'Syncing...' : 'Sync'}
                  </button>
                  <button
                    onClick={() => deleteBank(account.id)}
                    className="flex-shrink-0 bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!showConnectForm && (
            <button
              onClick={() => setShowConnectForm(true)}
              className="glass-card-hover w-full p-4 text-white font-semibold flex items-center justify-center gap-2"
            >
              <Link2 size={20} className="text-accent-purple" />
              Connect Bank Account
            </button>
          )}

          {showConnectForm && (
            <div className="glass-card p-5 space-y-4">
              <div>
                <label className="text-white/70 text-xs font-medium block mb-2">Bank</label>
                <select
                  value={bankForm.bankName}
                  onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                  className="input-field"
                >
                  {banks.map((bank) => (
                    <option key={bank} value={bank} className="bg-dark-card text-white">
                      {bank}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-white/70 text-xs font-medium block mb-2">Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['checking', 'savings'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setBankForm({ ...bankForm, accountType: type })}
                      className={`py-2 px-3 rounded-lg font-medium transition-all duration-300 text-sm ${
                        bankForm.accountType === type
                          ? 'bg-accent-purple text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {type === 'checking' ? 'Checking' : 'Savings'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-white/70 text-xs font-medium block mb-2">Last 4 Digits</label>
                <input
                  type="text"
                  placeholder="1234"
                  maxLength={4}
                  value={bankForm.lastFour}
                  onChange={(e) => setBankForm({ ...bankForm, lastFour: e.target.value.replace(/\D/g, '') })}
                  className="input-field"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleConnect}
                  disabled={loading}
                  className="btn-primary flex-1 text-sm py-2"
                >
                  {loading ? 'Connecting...' : 'Connect'}
                </button>
                <button
                  onClick={() => {
                    setShowConnectForm(false);
                    setBankForm({ bankName: 'Chase', accountType: 'checking', lastFour: '' });
                  }}
                  className="btn-secondary flex-1 text-sm py-2"
                >
                  Cancel
                </button>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-blue-400 text-xs">
                  <span className="font-semibold">Demo Mode:</span> Enter any bank and last 4 digits to simulate connection. In production, this would connect to Plaid or similar service.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="glass-card p-4">
          <h3 className="text-white font-semibold text-sm mb-2">Auto-Sync Transactions</h3>
          <p className="text-white/60 text-xs mb-3">
            Automatically import transactions from connected banks to keep your balance accurate
          </p>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="autosync"
              defaultChecked
              className="w-4 h-4 rounded cursor-pointer"
            />
            <label htmlFor="autosync" className="text-white text-sm cursor-pointer">
              Enable auto-sync (recommended)
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
