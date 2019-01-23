/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key){
        let self = this;
        return new Promise(function(resolve, reject) {
            // Add your code here, remember in Promises you need to resolve() or reject()
            self.db.get(key, (err, value) => {
                if(err){
                    if (err.type == 'NotFoundError') {
                        resolve(undefined);
                    }else {
                        console.log('Block ' + key + ' get failed', err);
                        reject(err);
                    }
                }else {
                    resolve(value);
                }
            });

        });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this;
        return new Promise(function(resolve, reject) {
            // Add your code here, remember in Promises you need to resolve() or reject() 
            self.db.put(key, value, function(err) {
                if (err) {
                    console.log('Block ' + key + ' submission failed', err);
                    reject(err);
                }
                resolve(value);
            });
        });
    }

    // Method that return the height
    getBlocksCount() {
        let self = this;
        let i = -1;
        return new Promise(function(resolve, reject){
            // Add your code here, remember in Promises you need to resolve() or reject()
            self.db.createReadStream()
            .on('data', function (data) {
                  // Count each object inserted
               i++;
             })
            .on('error', function (err) {
                // reject with error
               reject(err);
             })
             .on('close', function () {
                //resolve with the count value
                resolve(i);
            });
        });
    }

    //Add data to levelDB with value
    addDataToLevelDB(value) {
        let i = 0;
        let self = this;
        return new Promise(function(resolve, reject){ 
            self.db.createReadStream().on('data', function(data) {
                i++;
                }).on('error', function(err) {
                    reject(err);
                }).on('close', function() {
                 self.addLevelDBData(i, value).then((result)=>{
                    resolve(result);
                  }).catch((err)=>{  reject(err);});
                   
            });
        });
    }

    getAllBlocks(){
        let self= this;
        let dataArray=[];
        return new Promise(function(resolve,reject){
            self.db.createReadStream()
            .on('data', function (data) {
                  // Count each object inserted
                  dataArray.push(data)
             })
            .on('error', function (err) {
                // reject with error
               reject(err);
             })
             .on('close', function () {
                //resolve with the count value
                resolve(dataArray);
            });
        });
    }
        

}

module.exports.LevelSandbox = LevelSandbox;
