const express=require("express")
const mongoose=require('mongoose')
const morgan =require('morgan')
const fs=require("fs")



const app=express();





const courseSchema= mongoose.Schema({
    id:{type:String,required:true},
    title:{type:String,required:true},
    category:{type:String,required:true},
    difficulty:{type:String,required:true},
    description:{type:String,required:true}
})

const userSchema=mongoose.Schema({
    id:{type:String,required:true},
    username:{type:String,required:true},
    password:{type:String,required:true},
    enrolledCourses:{type:[String]}
})

const Course=mongoose.model('Course',courseSchema)
const User=mongoose.model('User',userSchema)

app.use(express.json())
app.use(morgan('combined',{stream:LogDetails}))

app.get('/courses',async(req,res)=>{
    try {
        const{page=1,limit=10,category,difficulty}=req.query
        
        const query={}
        if(category){
            query.category=category
        }
        if(difficulty){
            query.difficulty=difficulty
        }
        const courses=await Course.find(query).
        skip((page-1)*limit).
        limit(limit)
        
        const jsonCourse=json.stringfy(courses)
        res.send(jsonCourse)

    } catch (error) {
        res.send(error)
    }
})

app.get('/mycourses',async(req,res)=>{
    try {
        const{ userId }=req.query
        const user= await User.findbyId(userId)
        if(!user){return res.send("no user found")}
        const courses=await Course.find({id:{$in:user.enrolledCourses}})
        const jsonCourse=json.stringfy(courses)
        res.send(jsonCourse)
    } catch (error) {
        res.send(error)
    }
})

app.post("/enroll",async(req,res)=>{
    try {
        const {courseId,userId}=req.body
        const user=await User.findbyId(userId)
        if(!user){return res.send("no user found")}
        user.enrolledCourses.push(courseId);
        await user.save()
        res.send("user enrolled succesfully")
    } catch (error) {
        res.send(error)
    }
})

app.post("/cancel_enrollment",async(req,res)=>{
    try {
         const {userId,courseId}=req.body
         const user=await User.findbyId(userId)
         if(!user){return res.send("no user found")}
         user.enrolledCourses=user.enrolledCourses.filter(id=>id!==courseId);
         await user.save()
         res.send("enrollment cancelled")
        } catch (error) {
        res.send(error)
    }
})

const LogDetails=fs.createWriteStream(path.join('logdetails',access.log),{flags:'a'})


app.listen(8000,async()=>{
    try {
        let connection=await mongoose.connect(' mongodb://127.0.0.1:27017/course_management')
console.log("connected to db")
    console.log(`server is connected to port 3000`)
        
    } catch (error) {
        console.log(error)
    }

})