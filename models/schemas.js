const mongoose=require('mongoose')

const User=mongoose.model('users',{
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    uniquename:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    emails:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    dob:{
        type:String,
        required:true,
    },
    emailverify:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
    verificationcode:{
        type:String,
        required:true,
    },
    registerDate:{
        type:String,
        required:true,
    },
})

const Admin=mongoose.model('admins',{
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    contact:{
        type:String,
        required:true,
    },
    facebook:{
        type:String,
        required:true,
    },
    twitter:{
        type:String,
        required:true,
    },
    instagram:{
        type:String,
        required:true,
    }
})

const Mangas=mongoose.model('mangas',{
    mangaimage:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    artist:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true,
    },
    generes:{
        type:String,
        required:true,
    },
    summary:{
        type:String,
        required:true,
    },
    addDate:{
        type:Date,
        required:true,
    },
})

const Members=mongoose.model('members',{
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    comment:{
        type:String,
        required:true,
    },
})

const Publisher=mongoose.model('publishers',{
   profileimage:{
       type:String,
       required:true,
   },
   name:{
       type:String,
       required:true,
   },
   email:{
       type:String,
       required:true,
       unique: true,
   },
   address:{
       type:String,
       required:true,
   },
   city:{
       type:String,
       required:true,
   },
   contact:{
       type:String,
       required:true,
    },
    publisherid:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    facebook:{
        type:String,
        required:false,
    },
    twitter:{
        type:String,
        required:false,
    },
    instagram:{
        type:String,
        required:false,
    },
    registeredDate:{
        type:String,
    },
    updatedDate:{
        type:String, 
    },
    workexample:{
        type:String,
        required:true,
    },
    Role:{
        type:String,
        required:true,
    },
    status:{
        type:String, 
    }
})

const Chapter=mongoose.model('chapters',{
    mangaid:{
        type:String,
        required:true,
    },
    chapterimage:{
        type:String,
        required:true,
    },
    chaptername:{
        type:String,
        required:true,
    },
    chapterfile:{
        type:String,
        required:true,
    },
    date:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
    acceptcount:{
        type:String,
        required:true,
    },
    rejectcount:{
        type:String,
        required:true,
    }
    
})

const Favourite=mongoose.model('favourites',{
    email:{
        type:String,
        required:true,
    },
    manga:{
        type:Object,
        required:true,
    },
    
})

const Chapterapproval=mongoose.model('chapterapprovals',{
    adminid:{
        type:String,
        required:true,
    },
    chapterid:{
        type:String,
        required:true,
    },
    
})


const Carousel=mongoose.model('carousels',{
    Image1:{
        type:String,
        required:true,
    },
    Image2:{
        type:Object,
        required:true,
    },
    Image3:{
        type:Object,
        required:true,
    },
    
})

const Comment=mongoose.model('comments',{
    mangaid:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    comment:{
        type:String,
        required:true,
    },
    date:{
        type:String,
        required:true,
    }  
})

const API = mongoose.model('api', {
    last: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    dated: {
        type: String,
        required: true,
    },
});

module.exports={User,Admin,Publisher,Mangas,Chapter,Favourite,Comment,Carousel,Chapterapproval,Members,API}