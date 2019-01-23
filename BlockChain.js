/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.bd = new LevelSandbox.LevelSandbox();
        this.generateGenesisBlock();
    }

    // Helper method to create a Genesis Block (always with height= 0)
    // You have to options, because the method will always execute when you create your blockchain
    // you will need to set this up statically or instead you can verify if the height !== 0 then you
    // will not create the genesis block
    generateGenesisBlock(){
        // Add your code here
        let self= this;
        self.getBlockHeight().then((height)=>{
           if(height=== -1){
               let genesisBlock= new Block.Block("Genesis block");
               self.addBlock(genesisBlock).then((block)=>{
                   //console.log(block);
               });
           }
        }).catch((err)=>{console.log(err)});
    }

    // Get block height, it is a helper method that return the height of the blockchain
    getBlockHeight() {
        let self= this;
        return new Promise(function(resolve, reject) {
            self.bd.getBlocksCount().then((count) => {
                resolve(count);
            }).catch((err) => { resolve(-1); });
        });
    }

    // Add new block
    addBlock(block) {
         // block height
        let self= this;
        return new Promise(function(resolve, reject) {
          self.getBlockHeight().then((height)=>{
                block.height=height+1;
                return self.bd.getLevelDBData(height);
          }).then((previousBlockData)=>{
              if(previousBlockData){
                  let previousBlock= JSON.parse(previousBlockData);
                  block.previousBlockHash=previousBlock.hash;
                  block.hash=  SHA256(JSON.stringify(block)).toString();
              }else{
                block.hash=  SHA256(JSON.stringify(block)).toString();
              }
              return self.bd.addLevelDBData(block.height,JSON.stringify(block).toString());
          }).then((result)=>{
              if(!result){
                  console.log("Error");
                  reject(new TypeError("Error adding block"));
              }
              resolve(result);
          }).catch((err)=>{console.log(err);reject(err)  });
        });
    
    }

    // Get Block By Height
    getBlock(height) {
        let self= this;
        return new Promise(function(resolve, reject) {
            self.bd.getLevelDBData(height).then((blckdb)=>{
                if(blckdb){
                    let blck=JSON.parse(blckdb);
                    resolve(blck);
                }else{
                    resolve(undefined);  
                }
            }).catch((err) => { console.log(err);reject(err) }); 
        });
    }

       // Get all BlockChain Data
    getBlockChain(){
        let self= this;
        let chain=[];
        return new Promise(function(resolve,reject){
            self.bd.getAllBlocks().then((blocks)=>{
                for(let i=0;i<blocks.length;i++){
                    let block= JSON.parse(blocks[i].value);
                    chain.push(block);
                }
                resolve(chain.sort((a,b)=>{return a.height-b.height}));
            }).catch((err)=>{reject(err)});
        });
    }

    // Validate if Block is being tampered by Block Height
    validateBlock(height) {
        let self= this;
        return new Promise(function(resolve, reject) {

            self.getBlock(height).then((block)=>{
                const blockHash= block.hash;
                block.hash="";
                const validBlockHash=SHA256(JSON.stringify(block)).toString();
                if(validBlockHash===blockHash){
                    resolve(true);
                }else{
                    resolve(false);
                }
            }).catch((err)=>{
                reject(err);
            });

      });

    }

    // Validate Blockchain
    validateChain() {
        let self= this;
        let errorLog=[];
        return new Promise((resolve,reject)=>{
            self.getBlockChain().then((chain)=>{
                let promises=[];
                let chainIndex=0;

                chain.forEach(block=>{
                   promises.push(self.validateBlock(chainIndex));
                   if(chainIndex >0){
                       let previousBlockHash= block.previousBlockHash;
                       let blockHash= chain[chainIndex-1].hash;
                       if(blockHash!=previousBlockHash){
                           errorLog.push(`Error -Block Height :${chainIndex}- Previous Hash Doesn't Match ${previousBlockHash}-${blockHash}`);
                       }
                   }
                   chainIndex++;
                });

                Promise.all(promises).then((results)=>{
                    chainIndex=0;
                    results.forEach(valid=>{
                        if(!valid){
                            errorLog.push(`Error- BlockHeight :${chain[chainIndex].height}- Has been Tampered`);
                        }
                        chainIndex++;
                            
                    });
                    resolve(errorLog);
                }).catch((err)=>{console.log(err); reject(err)});
            }).catch((err)=>{console.log(err);reject(err)});
        });

    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err)});
        });
    }
   
}

module.exports.Blockchain = Blockchain;
