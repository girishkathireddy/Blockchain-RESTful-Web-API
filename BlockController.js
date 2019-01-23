const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockChain = require('./BlockChain.js');
/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        this.myBlockChain = new BlockChain.Blockchain();
      //  this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
      let self= this;
        self.app.get("/block/:index", (req, res,next) => {
                let index= req.params.index;
                self.myBlockChain.getBlock(index).then((blck)=>{ 
                    if(self.isEmpty(blck)){
                      next("Error: Block height out of bounds"); 
                    } else{
                      res.send(blck);
                    }
                }).catch((err)=>{
                    next(err); 
                });
          
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        let self=this;
        this.app.post("/block", (req, res,next) => {
            let reqbody= req.body;
            if(self.isEmpty(reqbody.data)){
                next("Please add the JSON content");
            } else{
                let block = new BlockClass.Block(`Test Data #${reqbody.data}`);
                self.myBlockChain.addBlock(block).then((result)=>{
                    res.format ({
                        'application/json': function() {
                           res.send(result);
                        },
                     });
                }).catch((err)=>{
                    next(err);
                });
           }
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    initializeMockData() {
        (function theLoop (i) {
            setTimeout(function () {
                let blockTest = new BlockClass.Block("Test Block - " + (i + 1));
                // Be careful this only will work if your method 'addBlock' in the Blockchain.js file return a Promise
                self.myBlockChain.addBlock(blockTest).then((result) => {
                    console.log(result);
                    i++;
                    if (i < 10) theLoop(i);
                });
            }, 10000);
        })(0);
    }

        
    isEmpty(obj) {
        return !obj || Object.keys(obj).length === 0;
    }


}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}