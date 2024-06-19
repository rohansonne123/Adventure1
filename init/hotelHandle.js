const mongoose=require("mongoose");
const dataHotel=require("../models/Hotel.js");
const Listing=require("./database.js");


async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().then(()=>{
   console.log("mongoose connected successful");
}).catch((err)=>{
    console.log(err);
})

const initDB=async ()=>{
    await dataHotel.deleteMany({});
     Listing.data1=await Listing.data1.map((obj)=>({...obj,owner:"66359328559bb1acc5526893"}));
    //  data1.data=await data1.data.map((obj)=>({...obj,geometry:{ type: 'Point', coordinates: [ -155.134023, 19.698738 ]}}));
    await dataHotel.insertMany(Listing.data1);
}

initDB();