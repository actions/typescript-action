// ChipyUI.jsx (Frontend Component)
import { useConnectWallet } from '@coinbase/onchainkit';

function ChipyWalletButton() {
  const { connect } = useConnectWallet();
  
  return (
    <button onClick={connect} className="cowboy-button">
      <img src="chip_icon.png" alt="Chipy" />
      Connect Wallet
    </button>
  );
}
