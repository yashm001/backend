const express= require('express');
const router = express.Router();
const avaxController = require('../controller/avaxController');
const hbarController = require('../controller/hbarController');
const ftmController = require('../controller/ftmController');
const tokenList = require('../controller/tokenList');


router.get('/balanceOf_AVAX', avaxController.getbalance);                                   
router.get('/balanceOf_HBAR', hbarController.getbalance); 
router.get('/balanceOf_FTM', ftmController.getbalance); 


router.get('/getHbarAmountAfterFee', hbarController.getAmountAfterFee);            
router.get('/getAvaxAmountAfterFee', avaxController.getAmountAfterFee);             
router.get('/getFtmAmountAfterFee', ftmController.getAmountAfterFee);             


router.get('/getAvaxTransactionResponse',avaxController.getTransactionResponse);
router.get('/getHbarTransactionResponse',hbarController.getTransactionResponse);
router.get('/getFtmTransactionResponse',ftmController.getTransactionResponse);


router.get('/getAvaxBridgeFees', avaxController.bridgeFees );                                
router.get('/getHbarBridgeFees', hbarController.bridgeFees );                                
router.get('/getFtmBridgeFees', ftmController.bridgeFees );                                


router.get('/checkAvaxAllowance',avaxController.checkAllowance)
router.get('/checkHbarAllowance',hbarController.checkAllowance)
router.get('/checkFtmAllowance',ftmController.checkAllowance)


// router.get('/AvaxVaultBalance', avaxController.vaultBalance);                                
// router.get('/HbarVaultBalance', hbarController.vaultBalance);                                

router.get('/getContractAddress', tokenList.getTokenDetails);                              
router.get('/getTrxDetails', avaxController.getTrxDetails);

// router.get('/processTxnAvax', avaxController.processTxn);


module.exports= router