import React from "react"
import { ethers } from "ethers"
import Artifact from "../AliensGame.json"

import { ConnectWallet } from "./ConnectWallet.js"
import { NoWalletDetected } from "./NoWalletDetected.js"
import { Ready } from "./Ready.js"
import { Punch } from "./Punch.js"
import { Kick } from "./Kick.js"
import { Defend } from "./Defend.js"
import { Run } from "./Run.js"

const contractAddress = '0x25BaB1eA2720A44cB197E13eF579CBb5711F13E5'
const SCROLL_SEPOLIA_NETWORK_ID = '534351'

const ERROR_CODE_TX_REJECTED_BY_USER = 4001

export class Dapp extends React.Component {
    constructor(props) {
        super(props)

        this.initialState = {
            opponent: '',
            yourHp: 0,
            opponentHp: 0,
            yourArmor: 0,
            opponentArmor: 0,

            selectedAddress: undefined,

            txBeingSent: undefined,
            transactionError: undefined,
            networkError: undefined,
        }
        this.state = this.initialState
    }

    render() {
        if (window.ethereum === undefined) {
            return <NoWalletDetected />
        }

        if (!this.state.selectedAddress) {
            return (
                <ConnectWallet
                    connectWallet={() => this._connectWallet()}
                    networkError={this.state.networkError}
                    dismiss={() => this._dismissNetworkError()}
                />
            )
        }
        return (
            <div>
                <label for='hp1'>HP:</label>
                <input id='hp1' value={this.state.yourHp} disabled></input>
                <label for='ar1'>Armor:</label>
                <input id='ar1' value={this.state.yourArmor} disabled></input>
                <br></br><br></br>
                <label for='hp2'>HP:</label>
                <input id='hp2' value={this.state.opponentHp} disabled></input>
                <label for='ar2'>Armor:</label>
                <input id='ar2' value={this.state.opponentArmor} disabled></input>
                <Ready
                    _ready={opponent => this._ready(opponent)}
                />
                <Punch
                    _punch={() => this._punch()}
                />
                <Kick
                    _kick={() => this._kick()}
                />
                <Defend
                    _defend={() => this._defend()}
                />
                <Run
                    _run={() => this._run()}
                />
            </div>
        )
    }

    async _connectWallet() {
        const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' })
        this._checkNetwork()
        this._initialize(selectedAddress)

        // We reinitialize it whenever the user changes their account.
        window.ethereum.on("accountsChanged", ([newAddress]) => {
            this._stopPollingData()
            if (newAddress === undefined) {
                return this._resetState()
            }
            this._initialize(newAddress)
        })
    }

    _initialize(userAddress) {
        this.setState({
            selectedAddress: userAddress,
        })
        this._initializeEthers()
        this._startPollingData()
    }

    async _initializeEthers() {
        this._provider = new ethers.providers.Web3Provider(window.ethereum)
        this._game = new ethers.Contract(
            contractAddress,
            Artifact.abi,
            this._provider.getSigner(0)
        )
    }

    async _updateStats() {
        try {
            if (this.state.selectedAddress && this.state.opponent) {
                this.state.yourHp = await this._game.hps(this.state.selectedAddress, this.state.opponent)
                this.state.yourArmor = await this._game.armors(this.state.selectedAddress, this.state.opponent)
                this.state.opponentHp = await this._game.hps(this.state.opponent, this.state.selectedAddress)
                this.state.opponentArmor = await this._game.armors(this.state.opponent, this.state.selectedAddress)
            }
        } catch (error) {
            console.log(error)
        }
    }

    _startPollingData() {
        this._pollDataInterval = setInterval(() => this._updateStats(), 500)
        this._updateStats()
    }

    _stopPollingData() {
        clearInterval(this._pollDataInterval)
        this._pollDataInterval = undefined
    }

    async _ready(opponent) {
        try {
            this.state.opponent = String(opponent.toLowerCase())
            this._dismissTransactionError()
            const tx = await this._game.ready(opponent)
            this.setState({ txBeingSent: tx.hash })
            const receipt = await tx.wait()
            if (receipt.status === 0) {
                throw new Error("Transaction failed")
            }
        } catch (error) {
            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                return
            }
            console.error(error)
            this.setState({ transactionError: error })
        } finally {
            this.setState({ txBeingSent: undefined })
        }
    }

    async _punch() {
        try {
            this._dismissTransactionError()
            const tx = await this._game.action(this.state.opponent, true, true)
            this.setState({ txBeingSent: tx.hash })
            const receipt = await tx.wait()
            if (receipt.status === 0) {
                throw new Error("Transaction failed")
            }
        } catch (error) {
            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                return
            }
            console.error(error)
            this.setState({ transactionError: error })
        } finally {
            this.setState({ txBeingSent: undefined })
        }
    }

    async _kick() {
        try {
            this._dismissTransactionError()
            const tx = await this._game.action(this.state.opponent, true, false)
            this.setState({ txBeingSent: tx.hash })
            const receipt = await tx.wait()
            if (receipt.status === 0) {
                throw new Error("Transaction failed")
            }
        } catch (error) {
            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                return
            }
            console.error(error)
            this.setState({ transactionError: error })
        } finally {
            this.setState({ txBeingSent: undefined })
        }
    }

    async _defend() {
        try {
            this._dismissTransactionError()
            const tx = await this._game.action(this.state.opponent, false, true)
            this.setState({ txBeingSent: tx.hash })
            const receipt = await tx.wait()
            if (receipt.status === 0) {
                throw new Error("Transaction failed")
            }
        } catch (error) {
            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                return
            }
            console.error(error)
            this.setState({ transactionError: error })
        } finally {
            this.setState({ txBeingSent: undefined })
        }
    }

    async _run() {
        try {
            this._dismissTransactionError()
            const tx = await this._game.action(this.state.opponent, false, false)
            this.setState({ txBeingSent: tx.hash })
            const receipt = await tx.wait()
            if (receipt.status === 0) {
                throw new Error("Transaction failed")
            }
            this.state.opponent = ''
        } catch (error) {
            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                return
            }
            console.error(error)
            this.setState({ transactionError: error })
        } finally {
            this.setState({ txBeingSent: undefined })
        }
    }

    _dismissTransactionError() {
        this.setState({ transactionError: undefined })
    }

    _dismissNetworkError() {
        this.setState({ networkError: undefined })
    }

    _getRpcErrorMessage(error) {
        if (error.data) {
            return error.data.message
        }

        return error.message
    }

    _resetState() {
        this.setState(this.initialState)
    }

    async _switchChain() {
        const chainIdHex = `0x${SCROLL_SEPOLIA_NETWORK_ID.toString(16)}`
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainIdHex }],
        })
        await this._initialize(this.state.selectedAddress)
    }

    _checkNetwork() {
        if (window.ethereum.networkVersion !== SCROLL_SEPOLIA_NETWORK_ID) {
            this._switchChain()
        }
    }
}