const Web3 = require("web3");
const config = require('../routes/config.json');
// var db = require('../db/db.js');
const mongoose = require('mongoose');
const { async } = require("crypto-random-string");


toChainId = {
    HBAR : "97", // HBAR chain id -> 298 
    AVAX : "43113", // avax Mainnet -> 43114
}

tokenList = {
    HBAR:
    {
        name: "HBAR",
        symbol: "HBAR",
        decimal: 18,
        tokenAddress: {
            HBAR: "0x0000000000000000000000000000000000000000",
            AVAX: "0x0b02dc9d30c1a9fdbcf07cb317334ddd8b266034"

        },
        tokenAbi: {
            BSC: require('./ABI/tokenAbi.json'),
            AVAX: require('./ABI/wrappedTokenABI.json')

        },
        bridgeAddress: {
            HBAR: "0xD0b3b3eE3c828D62d62191BBf0A4672e3defddFF",
            AVAX: "0xd41cdEEE1be56232f80b427053D41Cd9D11C051F"
        },
        bridgeAbi: {
            HBAR: require('./ABI/bridgeHBARAbi.json'),
            AVAX: require('./ABI/bridgeAVAXAbi.json')

        },
    }
    

}



module.exports = {


    tokenList: () => {
        return tokenList
    },

    toChainId: (network)=>{
        return toChainId[network]
    },

    tokenDetails: (token, network) => {
        address = tokenList[token]["tokenAddress"][network]
        decimal = tokenList[token]["decimal"]
        console.log("**************************")
        console.log(address)
        return [address, decimal]
    },

    tokenSymbol: (token) => {
        symbol = tokenList[token]["symbol"]
        return symbol
    },

    bridgeDetails: (token, network) => {
        address = tokenList[token]["bridgeAddress"][network]
        console.log("**************************")
        console.log(address)
        abi = tokenList[token]["bridgeAbi"][network]
        decimal = tokenList[token]["decimal"]
        // console.log(abi)
        return [address, abi, decimal]
    },

    getTokenDetails: async (req, res) => {
        try {
            let network = '';
            let token = ''

            if (req.query.token == null) {
                return res.send({ "status": "false", "message": "token not found" })
            } else {
                token = (req.query.token);
            }
            if (req.query.network == null) {
                tokenAddress = tokenList[token]["tokenAddress"]
                bridgeAddress = tokenList[token]["bridgeAddress"]
                bridgeAbi = tokenList[token]["bridgeAbi"]
                tokenAbi = tokenList[token]["tokenAbi"]
            } else {
                network = (req.query.network);
                tokenAddress = tokenList[token]["tokenAddress"][network]
                bridgeAddress = tokenList[token]["bridgeAddress"][network]
                bridgeAbi = tokenList[token]["bridgeAbi"][network]
                tokenAbi = tokenList[token]["tokenAbi"][network]

            }

            decimal = tokenList[token]["decimal"]

            console.log("tokenAddress", tokenAddress)

            res.send({
                "status": "true", "messgae": "Token details recieved","decimal":decimal, "TokenAddress": tokenAddress,
                "bridgeAddress": bridgeAddress, "bridgeAbi": bridgeAbi, "tokenAbi": tokenAbi
            })

        } catch (err) {
            console.log("error in getting token details", err)
            res.send({ "status": "false", "error": err })
        }
    }

}
