<<<<<<< HEAD
const Joi=require("joi");

module.exports.serverSide=Joi.object({
    listing1:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null),
        location:Joi.string().required(),
        country:Joi.string().required(),
    }).required(),
    

});

module.exports.reviewSchema=Joi.object({
    review1:Joi.object({
     rating:Joi.number().required().min(1).max(5),
     Comment:Joi.string().required(),
     date:Joi.date,
    }).required()
})

module.exports.FunserverSide=Joi.object({
    listing1:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null),
        location:Joi.string().required(),
        country:Joi.string().required(),
    }).required(),
    

});


module.exports.AgriserverSide=Joi.object({
    listing1:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null),
        location:Joi.string().required(),
        country:Joi.string().required(),
    }).required(),
    

=======
const Joi=require("joi");

module.exports.serverSide=Joi.object({
    listing1:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null),
        location:Joi.string().required(),
        country:Joi.string().required(),
    }).required(),
    

});

module.exports.reviewSchema=Joi.object({
    review1:Joi.object({
     rating:Joi.number().required().min(1).max(5),
     Comment:Joi.string().required(),
     date:Joi.date,
    }).required()
})

module.exports.FunserverSide=Joi.object({
    listing1:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null),
        location:Joi.string().required(),
        country:Joi.string().required(),
    }).required(),
    

});


module.exports.AgriserverSide=Joi.object({
    listing1:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null),
        location:Joi.string().required(),
        country:Joi.string().required(),
    }).required(),
    

>>>>>>> aace1cf54c0a401ff4d8b62faeae9eaea6702b7e
});