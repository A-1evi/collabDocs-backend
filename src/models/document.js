const mongoose = require("mongoose");

const defaultSlateValue = [{type: 'paragraph', children:[{text:''}]}]

const documentSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Document title is required'],
        trim: true,
        default:"Untitled Document"
    },
    data:{
        type:mongoose.Schema.Types.Mixed,
        default: defaultSlateValue
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    collabrator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lastModifiedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    visibility:{
        type: String,
        enum: ['private', 'public' ,'public-edit'],
        default: 'private'
    }
},{timestamps:true});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document