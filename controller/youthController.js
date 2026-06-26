const dataBase = require('../model/youthDataBase')
const path = require('path')

module.exports = {
    
    getYouthUnder18: async (req, res) => {
        try {
        // Calculate the date exactly 18 years ago from right now
                const eighteenYearsAgo = new Date();
                eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

        // Under 18 means their birth date must be GREATER than (after) 18 years ago
                const under18 = await dataBase.find({ youthBirthDate: { $gt: eighteenYearsAgo } 
                })
                .sort({youthFullName: 1})
                .collation({locale: 'en',strength : 2})

        // Map through items to dynamically calculate their age display string for EJS
                const processedYouth = under18.map(member => {
                const ageDiff = new Date() - member.youthBirthDate;
                const currentAge = Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
                return {
                    ...member._doc,
                    calculatedAge: currentAge
                };

                });

                res.render(path.join(__dirname, '..', 'view', 'under18.ejs'), {
                    under18Youth: processedYouth,
                    amountUnder: processedYouth.length
                });
        } catch (err) {
            res.status(500).send(err.message);
        }
},

getYouthAbove18: async (req, res) => {
        try {
            const eighteenYearsAgo = new Date();
            eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

        // 18 or older means their birth date must be LESS THAN OR EQUAL TO (before) 18 years ago
                const above18 = await dataBase.find({ youthBirthDate: { $lte: eighteenYearsAgo } 
                })
                .sort({youthFullName: 1})
                .collation({locale: 'en',strength : 2})

                const processedYouth = above18.map(member => {
                const ageDiff = new Date() - member.youthBirthDate;
                const currentAge = Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
                return {
                    ...member._doc,
                    calculatedAge: currentAge
                };
                });

                res.render(path.join(__dirname, '..', 'view', 'above18.ejs'), {
                    above18Youth: processedYouth,
                    amountAbove: processedYouth.length
                });
        } catch (err) {
               res.status(500).send(err.message);
        }
},

    searchYouthUnder18: async(req,res)=> {
       try{
            const searchName = req.query.under18
            const users = await dataBase.find({youthFullName:{$regex: searchName, $options: "i"}})
            res.json(users)
        } catch(err){
            res.status(500).send(err.message)
        }
    },

    searchYouthAbove18: async(req,res)=> {
       try{
            const searchName = req.query.above18
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
                youthBirthDate: new Date (req.body.birthDate),
                youthGender: req.body.gender,
                youthPhone: req.body.phone,
                completed: false
            })
            console.log('New member Added Successfully.')
            const age = Math.floor(new Date() - new Date(req.body.birthDate) / (1000 * 60 * 60 * 24 * 365.25) )
    // use conditional to redirect the member based on their ages
        if( age >= 18){
            res.redirect('/youth/above18')
        }else{
            res.redirect('/youth/under18')
        }
            
        } catch(err){
            res.status(500).send(err.message)
        }
    },

    deleteUnder18: async (req,res)=>{
        try{
            console.log(req.body)
            await dataBase.findOneAndDelete({_id: req.body.deleteUnder18Youth})
            res.json('One Youth Member is Deleted Successfully.')
        } catch(err){
            res.status(500).send(err.message)
        }
    },

    deleteAbove18: async (req,res)=>{
        try{
            console.log(req.body)
            await dataBase.findOneAndDelete({_id: req.body.deleteAbove18Youth})
            res.json('One Youth Member is Deleted Successfully.')
        } catch(err){
            res.status(500).send(err.message)
        }
    }

    /*  getYouthUnder18: async (req,res)=> {
        try{
            const under18 = await dataBase.find({youthBirthDate: { $lt: 18 } }).sort({youthFullName:1})
         // const countYouth = await dataBase.countDocuments({completed: false})
            res.render(path.join(__dirname, '..', 'view', 'under18.ejs'), {
                under18Youth: under18,
                amountUnder: under18.length,
            })
        } catch (err){
            res.status(500).send(err.message)
        }
    },

    getYouthAbove18: async (req,res)=> {
        try{
            const above18 = await dataBase.find({youthBirthDate:{ $gte: 18 } }).sort({youthFullName:1})
         // const countYouth = await dataBase.countDocuments({completed: false})
            res.render(path.join(__dirname, '..', 'view', 'above18.ejs'), {
                above18Youth: above18,
                amountAbove: above18.length
            })
        } catch (err){
            res.status(500).send(err.message)
        }
    },  */
}