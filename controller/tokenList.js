const Web3 = require("web3");
const config = require('../routes/config.json');
// var db = require('../db/db.js');
const mongoose = require('mongoose');
const { async } = require("crypto-random-string");


toChainId = {
    BSC : "97",
    CRO : "25",
}

tokenList = {
    CROGE:
    {
        name: "CROGE",
        symbol: "CROGE",
        decimal: 9,
        tokenAddress: {
            BSC: "0x0c069b40f7FD21BaE669319ca726dB6403288057",
            CRO: "0xC4a174cCb5fb54a6721e11e0Ca961e42715023F9"

        },
        tokenAbi: {
            BSC: require('./ABI/tokenAbi.json'),
            CRO: require('./ABI/tokenAbi.json')

        },
        bridgeAddress: {
            BSC: "0x9015e4c1618B441B4e5aCfaD24c51a6dc408265b",
            CRO: "0x9015e4c1618B441B4e5aCfaD24c51a6dc408265b"
        },
        bridgeAbi: {
            BSC: require('./ABI/bridgeBSCAbi.json'),
            CRO: require('./ABI/bridgeEthAbi.json')

        },
    }
    

}



module.exports = {


    // fetchAbis: async (req, res) => {
    //     try {
    //         let tokenId = ''
    //         if (req.query.tokenId == null) {
    //             return res.send({ "status": "false", "message": "tokenId not found" })
    //         } else {
    //             tokenId = (req.query.tokenId);
    //         }
    //         if (tokenId > tokenList.length - 1)
    //             return res.send({ "status": "false", "message": "tokenId out of index" })

    //         res.send({
    //             "status": "true",
    //             "message": "Contract ABIs fetched",
    //             "details": tokenList[token]

    //             // "addresses": {
    //             //     contract_address_eth: catoshiFTMContractAddress,
    //             //     contract_abi_eth: catoshiFTMAbi,
    //             //     chain_id_eth: chainId,
    //             //     rpc_url_eth: connectionURLFTM,
    //             //     contract_address_bsc: catoshiBSCContractAddress,
    //             //     contract_abi_bsc: catoshiBSCAbi,
    //             //     chain_id_bsc: chainId1,
    //             //     rpc_url_bsc: connectionURLBSC,
    //             //     admin_address: adminAddresses
    //             // }
    //         })
    //     } catch (err) {
    //         console.log("error in fetching Contract ABIs !", err)
    //         res.send({ "status": "false", "error": err, "message": 'Error in fetching Contract ABIs !' })
    //     }
    // },

    tokenList: () => {
        return tokenList
    },

    toChainId: (network)=>{
        return toChainId[network]
    },

    tokenAddress: (token, network) => {
        token = tokenList[token]["tokenAddress"][network]
        console.log("**************************")
        console.log(token)
        return token
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
        return [address, abi,decimal]
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
            // bridgeDetails = token.bridgeDetails(tokenId, networkId);
            // bridgeAddress = bridgeDetails[0]
            // bridgeAbi = bridgeDetails[0]

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
