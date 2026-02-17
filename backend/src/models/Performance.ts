//MONGOOSE SCHEMA

import mongoose from "mongoose";

const PerformanceSchema=new mongoose.Schema({
    sessionId:{type:String,required:true},
    levelId:{type:String,required:true},
    timeTaken:{type:Number,required:true},
    isCorrect:{type:Boolean,required:true},
    streak:{type:Number,required:true},
    round:{type:Number,required:true},
    aiDecision:{type:String,default:"maintain"},
    timestamp:{type:Date,default:Date.now}
})

export default mongoose.model('Performance',PerformanceSchema);