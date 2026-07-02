const dataBase = require('../model/membersDataBase')
const path = require('path')

function calculateAge(birthDate) {
    if (!birthDate) return 'N/A'; // Handles missing dates gracefully
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

module.exports = {

    seeMember: async (req, res) => {
    try {
        console.log("Form Data Received:", req.body);
        
        // 1. Fetch the data exactly as you are doing now
        const rawMembers = await dataBase.find({userId: req.user.id}).sort({ memFullName: 1 }).collation({ locale: 'en', strength: 2 });
        const totalAmount = await dataBase.countDocuments({ completed: true });

        // 2. Convert Mongoose documents to plain objects and calculate age
        const memberList = rawMembers.map(doc => {
            const member = doc.toObject();
            // Replace 'dateOfBirth' with whatever your actual schema field is called
            member.age = calculateAge(member.memBirthDate); 
            return member;
        });

        // 3. Render the page with the updated list
        res.render(path.join(__dirname, '..', 'view', 'formTable.ejs'), { 
            members: memberList, 
            amount: totalAmount 
        });

    } catch (err) {
        console.error(err);
        // It's a good idea to send a response if an error occurs so the browser doesn't hang
        res.status(500).send("Internal Server Error");
    }
    
},

    // if some one specifically searching someone this function could help him

    searchAndGetByName: async (req,res)=>{

        try{
            const searchName = req.query.name
            const users = await dataBase.find({
            memFullName:{$regex: searchName, $options: "i"}
        })
            res.json(users)
        } catch(err){
            res.status(500).send(err.message)
        }
    },
    createOne: async (req,res)=>{
        try{
            await dataBase.create({
                memFullName:req.body.fullName, 
                memBirthDate:new Date (req.body.age),
                memSex:req.body.gender,
                memPhone:req.body.phone,
                memSector:req.body.sector,
                userId: req.user.id,
                completed:true,
            })
            console.log('New Member Added Successfully!') 
            res.redirect('/memberList')
        } catch(err){
            console.error(err)
            res.status(500).send("Error saving to database.")
        }
    },
    deleteMembers: async (req,res)=>{
        try{
            await dataBase.findOneAndDelete({_id:req.body.deleteMem})
            console.log('Member Removed')
            res.json('Member Removed Successfully!')

        } catch(err){
            console.error(err)
        }   
    }

//This logic could wait for a bit longer b/c i need to update the members age automatically on their barthDATE, and may be i want to update their phone number!!

    /*changeData: async (req,res)=>{
        try{
            await dataBase.findOneAndUpdate({_id:req.body.}) 
            res.json('Update successful!')
        }
       
    },*/
    
    
}