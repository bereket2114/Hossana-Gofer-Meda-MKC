const dataBase = require('../model/membersDataBase')
const path = require('path')
module.exports = {
    seeMember: async (req,res)=>{
        try{
            console.log("Form Data Received:",req.body)
            const memberList = await dataBase.find()
            const totalAmount = await dataBase.countDocuments({completed:true})
            res.render(path.join(__dirname,'..','view','formTable.ejs'),{members: memberList, amount:totalAmount})
        } catch(err){
            console.error(err)
        }
    },
    createOne: async (req,res)=>{
        try{
            await dataBase.create({
                memFullName:req.body.fullName, 
                memAge:req.body.age, 
                memSex:req.body.sex,
                memPhone:req.body.phone,
                memSector:req.body.sector,
                completed:true,
            })
            console.log('New Member Added Successfully!') 
            res.redirect('/memberList')
        } catch(err){
            console.error(err)
            res.status(500).send("Error saving to database.")
        }
    },

//This logic could wait for a bit longer b/c i need to update the members age automatically on their barthDATE, and may be i want to update their phone number!!

    /*changeData: async (req,res)=>{
        try{
            await dataBase.findOneAndUpdate({_id:req.body.}) 
            res.json('Update successful!')
        }
       
    },*/
    deleteMembers: async (req,res)=>{
        try{
            await dataBase.findOneAndDelete({_id:req.body.deleteMem})
            console.log('Member Removed')
            res.json('Member Removed Successfully!')

        } catch(err){
            console.error(err)
        }   
    }
}