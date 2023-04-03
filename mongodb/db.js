var mongoose=require('mongoose');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://shahbazrafique429:Shahbaz_123@cluster0.ngcdcsp.mongodb.net/Mangas?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
var db=mongoose.connection;
db.on('error',()=>console.log('error'))
db.once('open',()=>console.log('Database connected'))

module.exports={db}