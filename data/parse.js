var fs = require('fs');
var csv = require("csv");
var parse = require('csv-parse');

var rData = {
  maxEnergy : 95013420.95,
  minEnergy : 8525.25,
  maxDistance : 9997.63953184151,
  maxUplift : 2.47416859638631,
  maxTemp : 311.024111125345
  
  
};
var storks = {};

var xParser = parse(function(err, data){
    if (err) throw "read error";
    
     data.forEach(function iterator(row, index){
        if(index != 0){
        addRow(row);
        } 
    })
    // console.log(storks['Benjamin (DER AN867)'].energy.length)
    
    fs.createReadStream('./assets/MPIO_white_stork_lifetime_tracking_data_(2013-2014)-reference-data.csv').pipe(yParser);
    
    function addRow(row){
        var name = row[0];
        if(!(name in storks)){
            var stork = {};
            stork.population = row[11];
            stork.distance = row[13];
            stork.status = "";
            stork.uplift = [row[9]];
            stork.temp = [row[7]];
            stork.veg = [row[10]];
            stork.energy = [row[14]];
            storks[name] = stork;
        } else{
            storks[name].uplift.push(row[9]);
            storks[name].temp.push(row[7]);
            storks[name].veg.push(row[10]);
            //overwrite distance
            storks[name].distance = row[13];
            storks[name].energy.push(row[14]);
        }
    }
    
})

var yParser = parse(function(err, data){
     if (err) throw "read error";
     data.forEach(function iterator(row, index){
        if(index != 0){
         appendStatus(row);
        } 
    })
    
    rData.storks = storks;
    
     fs.writeFile('./assets/storkData.json', JSON.stringify(rData), (err) => {
        if (err) throw err;
    });
    
    
    function appendStatus(row){
        var name = row[1];
        var status = row[5];
        if(status == "confirmed dead"){
            storks[name].status = "dead"
        } else {
            storks[name].status = "alive"
        }
        
    }
})

fs.createReadStream('./assets/final_data_merged.csv').pipe(xParser);