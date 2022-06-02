const Web3 = require("web3");
const config = require('../routes/config.json');
var db = require('../db/db.js');
const mongoose = require('mongoose');
const tokenAbi = require('./ABI/tokenAbi.json')
const tokenList = require('./tokenList')
const { bridgeDetails } = require("./tokenList");
const transactionDetails = mongoose.model('transactionDetails');
var Tx = require('ethereumjs-tx');


const httpEndPointInfura = config.connectionURLAVAX;
const connectionURLHBAR = config.connectionURLHBAR;

const HBAR_CHAIN_ID = config.HbarChainId

const OWNER_ADDRESS = config.adminAddress


// const chainId1 = config.chainId1;
var web3 = new Web3(new Web3.providers.HttpProvider(httpEndPointInfura));
var web3Hbar = new Web3(new Web3.providers.HttpProvider(connectionURLHBAR));


let pKey

getPKey()
    .then((data) => { pKey = data['privKey']; })
    .catch((e) => console.log(e));


module.exports = {

    getbalance: async (req, res) => {
        try {
            let userAddress = '';
            let token = ''
            if (req.query.userAddress == null) {
                return res.send({ "status": "false", "message": "address not found" })
            } else {
                userAddress = (req.query.userAddress);
            }
            if (req.query.token == null) {
                return res.send({ "status": "false", "message": "token not found" })
            } else {
                token = (req.query.token);
            }
            console.log("token", token)
            tokenAddress = tokenList.tokenAddress(token, "BSC");
            // console.log("tokenDetails*****************",tokenDetails)
            // tokenAddress = tokenDetails[tokenId]

            console.log("tokenAddress", tokenAddress)
            var tokenContract = await new web3.eth.Contract(tokenAbi, tokenAddress)
            let output = await tokenContract.methods.balanceOf(userAddress).call()
            let decimal = await tokenContract.methods.decimals().call()
            output = output / (10 ** decimal)
            res.send({ "status": "true", "messgae": "user balance recieved", "Tokens": output })

        } catch (err) {
            console.log("error in getting user balance", err)
            res.send({ "status": "false", "error": err })
        }
    },

    vaultBalance: async (req, res) => {
        try {
            let token = ''
            if (req.query.token == null) {
                return res.send({ "status": "false", "message": "token not found" })
            } else {
                token = (req.query.token);
            }
            tokenAddress = tokenList.tokenAddress(token, "BSC");
            bridgeDetail = tokenList.bridgeDetails(token, "BSC");
            bridgeAddress = bridgeDetail[0]

            var tokenContract = await new web3.eth.Contract(tokenAbi, tokenAddress)
            let output = await tokenContract.methods.balanceOf(bridgeAddress).call()
            let decimal = await tokenContract.methods.decimals().call()
            output = output / (10 ** decimal)
            res.send({
                "status": "true",
                "messgae": "Vault Balance recieved",
                "vault_balance": output
            })

        } catch (err) {
            console.log("error in getting vault balance", err)
            res.send({ "status": "false", "error": err })
        }
    },

    getAmountAfterFee: async (req, res) => {
        try {
            let amount = '';
            let token = ''
            if (req.query.amount == null) {
                return res.send({ "status": "false", "message": "amount not found" })
            } else {
                amount = (req.query.amount);
            }
            if (req.query.token == null) {
                return res.send({ "status": "false", "message": "token not found" })
            } else {
                token = (req.query.token);
            }
            bridgeDetail = tokenList.bridgeDetails(token, "BSC");
            bridgeAddress = bridgeDetail[0]
            bridgeAbi = bridgeDetail[1]
            decimal = bridgeDetail[2]

            amount = BigInt(amount * (10 ** decimal))
            console.log("amount", amount)
            // console.log("**********************")
            // console.log(bridgeAddress)
            // console.log("**********************")
            // console.log(bridgeDetail)
            var bridgeContract = await new web3.eth.Contract(bridgeAbi, bridgeAddress)
            var output = await bridgeContract.methods.feeCalculation(amount).call()
            output = output / (10 ** decimal)
            res.send({ "status": "true", "output": output })

        } catch (err) {
            console.log("error in getting amount details", err)
            res.send({ "status": "false", "error": err })
        }
    },

    checkAllowance: async (req, res) => {
        try {
            let token = ''
            let userAddress = ''
            let amount = ''
            if (req.query.userAddress == null) {
                return res.send({ "status": "false", "message": "userAddress not found" })
            } else {
                userAddress = (req.query.userAddress);
            }
            if (req.query.token == null) {
                return res.send({ "status": "false", "message": "token not found" })
            } else {
                token = (req.query.token);
            }
            if (req.query.amount == null) {
                return res.send({ "status": "false", "message": "amount not found" })
            } else {
                amount = (req.query.amount);
            }

            tokenAddress = tokenList.tokenAddress(token, "BSC");
            bridgeDetail = tokenList.bridgeDetails(token, "BSC");
            bridgeAddress = bridgeDetail[0]
            decimal = bridgeDetail[2]

            var tokenContract = await new web3.eth.Contract(tokenAbi, tokenAddress)
            let output = await tokenContract.methods.allowance(userAddress, bridgeAddress).call()
            amount = amount * (10 ** decimal)
            let response = false;
            if (amount <= output)
                response = true;

            res.send({ "status": "true", "response": response })

        } catch (err) {
            console.log("error in getting allowance details", err)
            res.send({ "status": "false", "error": err })
        }
    },

    getTransactionResponse: async (req, res) => {
        try {
            let txHash = '';
            if (req.query.txHash == null) {
                return res.send({ "status": "false", "message": "hash not found" })
            } else {
                txHash = (req.query.txHash);
            }
            let token = '';
            if (req.query.token == null) {
                return res.send({ "status": "false", "message": "token not found" })
            } else {
                token = (req.query.token);
            }

            let swapAmount = '';
            if (req.query.swapAmount == null) {
                return res.send({ "status": "false", "message": "swapAmount not found" })
            } else {
                swapAmount = (req.query.swapAmount);
            }


            let fromTimestamp = '';
            if (req.query.fromTimestamp == null) {
                return res.send({ "status": "false", "message": "fromTimestamp not found" })
            } else {
                fromTimestamp = (req.query.fromTimestamp);
            }

            let toChain = '';
            if (req.query.toChain == null) {
                return res.send({ "status": "false", "message": "toChain not found" })
            } else {
                toChain = (req.query.toChain);
            }

            var receipt = await web3.eth.getTransactionReceipt(txHash)
            while (receipt == null) {
                console.log("re", receipt)
                receipt = await web3.eth.getTransactionReceipt(txHash)
            }
            // console.log(receipt)
            const status = receipt['status']
            tokenSymbol = tokenList.tokenSymbol(token);
            console.log("888888888888888888")


            const obj = {
                fromChain: 'BSC',
                fromTransactionHash: txHash,
                fromTransactionStatus: status,
                fromBlockNumber: receipt['blockNumber'],
                walletAddress: receipt['from'],
                token: tokenSymbol,
                swapAmount: swapAmount,
                fromTimestamp: fromTimestamp,
                swapId: null,
                toChain: toChain,
                toTransactionHash: '',
                toTransactionStatus: false,
                toTimestamp: '',
                nonce: null,
                rawData: null
            }

            const data = new transactionDetails(obj);
            try {
                await data.save();
                let response = {
                    status: status,
                    message: `transaction ${status ? 'confirmed' : 'failed'}`,
                    data: 'Transaction Saved in db Successfully'
                };
                res.send(response);
                console.log("Transaction details Saved in db Successfully")
            }
            catch (err) {
                let response = {
                    status: status,
                    message: `transaction ${status ? 'confirmed' : 'failed'}`,
                    data: 'Error in saving Transaction details in DB'
                };
                res.send(response);
                console.log("Error in saving Transaction details in DB, ", err)
            };
        }
        catch (err) {
            console.log("error in getting transaction details", err)
            res.send({ "status": "false", "error": err, "message": 'Error in getting Transaction Details...' })
        }
    },

    bridgeFees: async (req, res) => {
        try {
            let token = '';
            if (req.query.token == null) {
                return res.send({ "status": "false", "message": "token not found" })
            } else {
                token = (req.query.token);
            }
            let toChain = '';
            if (req.query.toChain == null) {
                return res.send({ "status": "false", "message": "toChain not found" })
            } else {
                toChain = (req.query.toChain);
            }

            let toChainId = tokenList.toChainId(toChain)

            bridgeDetail = tokenList.bridgeDetails(token, "BSC");
            bridgeAddress = bridgeDetail[0]
            bridgeAbi = bridgeDetail[1]
            decimal = bridgeDetail[2]


            var bridgeContract = await new web3.eth.Contract(bridgeAbi, bridgeAddress)
            var gasUsed = await bridgeContract.methods.getProcessedFees(toChainId).call();

            res.send({ "status": "true", "bridgeFees": gasUsed, "decimal": decimal })
        } catch (err) {
            console.log("error in getting fees details", err)
            res.send({ "status": "false", "error": err })
        }
    },

    // triggerEvents: async (req, res) => {
    //     try{
    //         let blockNumber = '';
    //             if(req.query.blockNumber === null || blockNumber < 0){
    //                 return res.send({"status": "false", "message": "Invalid Block Number!!"})
    //             } else {
    //                 blockNumber = (req.query.blockNumber);
    //             }    
    //         ``
    //         const web3Bsc = new Web3(new Web3.providers.HttpProvider(httpEndPointInfura));
    //         var latestBlock = await web3Bsc.eth.getBlockNumber();
    //         if(latestBlock <= parseInt(blockNumber)) {
    //             return res.send({
    //                 "status": "false", 
    //                 "message": "Provided block number is not yet mined!!"
    //             })
    //         }
    //         catoshiBSCEventCall(blockNumber);
    //         res.send({ 
    //             "status": 'true', 
    //             "message": "API to call events has been trigerred",
    //             "blockNumber": blockNumber    
    //         })                 
    //     }catch(err){
    //         console.log("error in fetching BSC Events",err)
    //         res.send({"status":"false", "error": err})
    //     }
    // },

    getTrxDetails: async (req, res) => {
        try {
            let params = {}
            let token = '';
            if (req.query.token == null) {
                return res.send({ "status": "false", "message": "token not found" })
            } else {
                token = (req.query.token);
                if (token != "None") {
                    params.token = token;
                }
            }

            let toChain = '';
            if (req.query.toChain == null) {
                return res.send({ "status": "false", "message": "toChain not found" })
            } else {
                toChain = (req.query.toChain);
                if (toChain != "None") {
                    params.toChain = toChain;
                }
            }
            let fromChain = '';
            if (req.query.fromChain == null) {
                return res.send({ "status": "false", "message": "fromChain not found" })
            } else {
                fromChain = (req.query.fromChain);
                if (fromChain != "None") {
                    params.fromChain = fromChain;
                }
            }
            // let params = req.query;
            // console.log(params)
            // if (!!req.query.walletAddress) {
            //     params.walletAddress = req.query.walletAddress;
            // }
            // const transactionDetailsData = await transactionDetails.find(params).sort({'_id':-1}).limit(20)
            const transactionDetailsData = await transactionDetails.find(params).sort({ '_id': -1 })
            let response = {
                status: true,
                data: transactionDetailsData.map(data => ({
                    amount: data.swapAmount, ...data._doc
                }))
            };
            res.send(response);
        }
        catch (err) {
            console.log(err)
        }
    },

    processTxn: async (req, res) => {
        try {
            let token = ''
            let txnHash = ''
            if (req.query.txnHash == null) {
                return res.send({ "status": "false", "message": "txnHash not found" })
            } else {
                txnHash = (req.query.txnHash);
            }
            if (req.query.token == null) {
                return res.send({ "status": "false", "message": "token not found" })
            } else {
                token = (req.query.token);
            }

            avaxbridgeDetail = tokenList.bridgeDetails(token, "AVAX");
            avaxbridgeAddress = avaxbridgeDetail[0]
            avaxbridgeABI = avaxbridgeDetail[1]

            var avaxbridgeContract = await new web3.eth.Contract(avaxbridgeABI, avaxbridgeAddress)

            hbarbridgeDetail = tokenList.bridgeDetails(token, "HBAR");
            hbarbridgeAddress = hbarbridgeDetail[0]
            hbarbridgeABI = hbarbridgeDetail[1]

            var hbarbridgeContract = await new web3Hbar.eth.Contract(hbarbridgeABI, hbarbridgeAddress)

            isAlreadyProcessed = await hbarbridgeContract.methods.getBridgeStatus(id, 56).call();

            if (isAlreadyProcessed) {
                console.log("Txn already processed")
                return res.send({ "status": "false", "response": "Txn already processed" })
            }

            let mongoData = await transactionDetails.findOne({ fromChain: 'AVAX', fromTransactionHash: txnHash })
            if (mongoData == undefined) {
                console.log("no transaction found in db")
                return res.send({ "status": "false", "response": "no transaction found in db" })
            }


            let gasPrice = await web3.eth.getGasPrice();
            gasPrice = Math.floor(gasPrice * 1.1) // to speed up the txn
            let rawData
            if (mongoData.rawData == "") {

                const receipt = await web3.eth.getTransactionReceipt(txnHash)
                const blockNumber = receipt.blockNumber

                events = avaxbridgeContract.getPastEvents('SwapRequest', {

                    fromBlock: blockNumber,
                    toBlock: blockNumber
                })
                for (let i = 0; i < events.length; i++) {
                    if (resp[i].event === "SwapRequest" && resp[i].transactionHash == txnHash && resp[i].address == avaxbridgeAddress) {
                        // await SwapRequest(resp[i])
                        requiredEvent = resp[i].returnValues
                        break;
                    }

                }

                var encodeABI = bridgeContract.methods.swapBack(requiredEvent.to, requiredEvent.amount, requiredEvent.nonce, 25).encodeABI();

                var nonce = await web3Hbar.eth.getTransactionCount(OWNER_ADDRESS, "pending")

                rawData = await getRawTransactionApp(
                    nonce,
                    gasPrice,
                    GAS_LIMIT,
                    BSC_CROSS_SWAP_ADDRESS,
                    null,
                    encodeABI
                );

            } else {
                rawData = mongoData.rawData
                rawData.gasPrice = web3.utils.toHex(Math.floor(gasPrice * 1.22));
            }

            var tx = new Tx(rawData);
            let privateKey = new Buffer.from(pKey, 'hex');


            tx.sign(privateKey);
            var serializedTx = tx.serialize();

            let params = {
                fromChain: 'AVAX',
                fromTransactionHash: fromTransactionHash
            }

            var new_obj = {}

            // changing web3 instance
            await web3Hbar.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), async (error, hash) => {
                if (error) {
                    console.log("Tx Error : ", error);
                    // await bscBridgeBack(user, amount, id, fromTransactionHash);
                } else {
                    console.log("Tx Success : ", hash)
                    new_obj.toTimestamp = new Date().toISOString()
                    new_obj.swapId = id
                    new_obj.nonce = nonce
                    new_obj.rawData = rawData
                    new_obj.toTransactionHash = hash

                    transactionDetails.updateOne(params, { $set: new_obj }, function (err, result) {
                        if (err) {
                            console.log('DB update error', err);
                        } else {
                            console.log('DB updated successfully');
                        }
                    });
                }
            })




            res.send({ "status": "true", "response": "txn updated sucessfull" })

        } catch (err) {
            console.log("error in getting allowance details", err)
            res.send({ "status": "false", "error": err })
        }
    },

}

async function getPKey() {
    let myPromise = new Promise(async function (myResolve, myReject) {
        var AWS = require('aws-sdk'),
            region = "us-east-2",
            secretName = 'crogeBridge',
            secret,
            decodedBinarySecret;
        // Create a Secrets Manager client
        AWS.config.loadFromPath('./awsConfig.json');
        var client = new AWS.SecretsManager({
            region: region
        });

        await client.getSecretValue({ SecretId: secretName }, async function (err, data) {
            if (err) {
                console.log(err);
                if (err.code === 'DecryptionFailureException')
                    // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
                    // Deal with the exception here, and/or rethrow at your discretion.
                    throw err;
                else if (err.code === 'InternalServiceErrorException')
                    // An error occurred on the server side.
                    // Deal with the exception here, and/or rethrow at your discretion.
                    throw err;
                else if (err.code === 'InvalidParameterException')
                    // You provided an invalid value for a parameter.
                    // Deal with the exception here, and/or rethrow at your discretion.
                    throw err;
                else if (err.code === 'InvalidRequestException')
                    // You provided a parameter value that is not valid for the current state of the resource.
                    // Deal with the exception here, and/or rethrow at your discretion.
                    throw err;
                else if (err.code === 'ResourceNotFoundException')
                    // We can't find the resource that you asked for.
                    // Deal with the exception here, and/or rethrow at your discretion.
                    throw err;

                myResolve(pKey);
            }
            else {
                // Decrypts secret using the associated KMS CMK.
                // Depending on whether the secret is a string or binary, one of these fields will be populated.
                if ('SecretString' in data) {
                    secret = data.SecretString;
                    // pKey=JSON.parse(secret).pkey;
                    myResolve(JSON.parse(secret));
                } else {
                    let buff = new Buffer(data.SecretBinary, 'base64');
                    decodedBinarySecret = buff.toString('ascii');
                    myResolve(pKey);
                }
            }
        });
    });
    return myPromise;
}

const getRawTransactionApp = function (_nonce, _gasPrice, _gasLimit, _to, _value, _data) {
    return {

        nonce: web3.utils.toHex(_nonce),
        gasPrice: _gasPrice === null ? '0x098bca5a00' : web3.utils.toHex(_gasPrice),
        // gasPrice: web3Bsc.utils.toHex(web3Bsc.utils.toWei('200', 'gwei')),
        gasLimit: _gasLimit === null ? '0x96ed' : web3.utils.toHex(_gasLimit),
        // gasLimit: web3Bsc.utils.toHex(1000000),

        to: _to,
        value: _value === null ? '0x00' : web3.utils.toHex(_value),
        // value: web3.utils.toHex(web3.utils.toWei('0.01', 'ether')),
        data: _data === null ? '' : _data,
        chainId: HBAR_CHAIN_ID
    }
}