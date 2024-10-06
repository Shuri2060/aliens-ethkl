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
            // this._stopPollingData()
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
        // this._startPollingData()
    }

    async _initializeEthers() {
        this._provider = new ethers.providers.Web3Provider(window.ethereum)
        this._game = new ethers.Contract(
            contractAddress,
            Artifact.abi,
            this._provider.getSigner(0)
        )
    }

    // _startPollingData() {
    //     this._pollDataInterval = setInterval(() => this._updateBalance(), 1000)
    //     this._updateBalance()
    // }

    // _stopPollingData() {
    //     clearInterval(this._pollDataInterval)
    //     this._pollDataInterval = undefined
    // }

    async _ready(opponent) {
        try {
            this._dismissTransactionError()
            const tx = await this._game.ready(opponent)
            this.setState({ txBeingSent: tx.hash })
            const receipt = await tx.wait()
            if (receipt.status === 0) {
                throw new Error("Transaction failed")
            }
            this.state.opponent = opponent
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

    async _punch(opponent) {
        try {
            this._dismissTransactionError()
            const tx = await this._game.punch()
            this.setState({ txBeingSent: tx.hash })
            const receipt = await tx.wait()
            if (receipt.status === 0) {
                throw new Error("Transaction failed")
            }
            this.state.opponent = opponent
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

    async _kick(opponent) {
        try {
            this._dismissTransactionError()
            const tx = await this._game.kick()
            this.setState({ txBeingSent: tx.hash })
            const receipt = await tx.wait()
            if (receipt.status === 0) {
                throw new Error("Transaction failed")
            }
            this.state.opponent = opponent
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

    async _defend(opponent) {
        try {
            this._dismissTransactionError()
            const tx = await this._game.defend()
            this.setState({ txBeingSent: tx.hash })
            const receipt = await tx.wait()
            if (receipt.status === 0) {
                throw new Error("Transaction failed")
            }
            this.state.opponent = opponent
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

    async _run(opponent) {
        try {
            this._dismissTransactionError()
            const tx = await this._game.run()
            this.setState({ txBeingSent: tx.hash })
            const receipt = await tx.wait()
            if (receipt.status === 0) {
                throw new Error("Transaction failed")
            }
            this.state.opponent = opponent
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