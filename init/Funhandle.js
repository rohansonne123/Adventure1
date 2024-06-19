const mongoose=require("mongoose");
const dataFun=require("../models/Fun.js");
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
  await dataFun.deleteMany({});
  datalisting.data1=datalisting.data1.map((obj)=>({...obj,owner:"6562082795bca4a4053c61e2"}));
  datalisting.data1=datalisting.data1.map((obj)=>({...obj,geometry:{ type: 'Point', coordinates: [ -155.134023, 19.698738 ]}}));
  await dataFun.insertMany(datalisting.data1);
}

addingdata();