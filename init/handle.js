const mongoose=require("mongoose");
const data=require("../models/data.js");
const datalisting=require("./database.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(()=>{
    console.log("connection established");
}).catch((err)=>{
    console.log(err);
});
let addingdata=async ()=>{
  await data.deleteMany({});
  datalisting.data1=datalisting.data1.map((obj)=>({...obj,owner:"663b08bb230b6cf366d19f99"}));
  datalisting.data1=datalisting.data1.map((obj)=>({...obj,geometry:{ type: 'Point', coordinates: [ -155.134023, 19.698738 ]}}));
  
  await data.insertMany(datalisting.data1);
  console.log("data was reinitialized");
}

addingdata();