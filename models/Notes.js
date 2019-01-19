const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const NotesSchema = new Schema({
    body: String,
    writer:String
});

const Notes = mongoose.model("Notes", NotesSchema);

module.exports=Notes;