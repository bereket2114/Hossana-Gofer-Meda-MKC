const dataBase = require('../model/youthDataBase')
const path = require('path')

module.exports = {
    getYouthDashboard: async (req,res)=> {
        try{
            const under19 = await dataBase.find({youthAge: { $lt: 19 } })
            const above19 = await dataBase.find({youthAge:{ $gte: 19 } })
         // const countYouth = await dataBase.countDocuments({completed: false})
            res.render(path.join(__dirname, '..', 'view', 'youthPage.ejs'), {
                under19Youth: under19,
                above19Youth: above19,
                amountUnder: under19.length,
                amountAbove: above19.length
            })
        } catch (err){
            res.status(500).send(err.message)
        }
    },
    searchYouth: async(req,res)=> {
       try{
            const searchName = req.query.name
            const users = await dataBase.find({youthFullName:{$regex: searchName, $options: "i"}})
            res.json(users)
        } catch(err){
            res.status(500).send(err.message)
        }
    }, 
    addYouth: async (req,res)=> {
        try{
            await dataBase.create({
                youthFullName: req.body.fullName,
                youthAge: req.body.age,
                youthGender: req.body.gender,
                youthPhone: req.body.phone,
                completed: false
            })
            console.log('New page Added Successfully.')
            res.redirect('/youthPage')
        } catch(err){
            res.status(500).send(err.message)
        }
    },
    deleteOne: async (req,res)=>{
        try{
            console.log(req.body)
            await dataBase.findOneAndDelete({_id: req.body.deleteOneYouth})
            res.json('One Youth Member is Deleted Successfully.')
        } catch(err){
            res.status(500).send(err.message)
        }
    }
}