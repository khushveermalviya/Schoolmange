import App from "../App/App.js";
import Pool from "../db/Database.js"

// app.post('/admin', async (req, res) => {
//   try {
//     const { father_name, std_id, std_name } = req.body;
//     const result = await Pool.query(
//         "INSERT INTO student (std_id, std_name, father_name) VALUES ($1, $2, $3) RETURNING *", 
//         [std_id, std_name, father_name]
//     );
//     res.json(result)
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('An error occurred');
//   }
// });
// app.get('/khush' ,async(req,res)=>{
// try {
//   const td = await Pool.query("SELECT * FROM student")
//   res.send(td);
//   res.json(td);
// } catch (error) {
//   console.log(error.message);
  
// }
// })

// app.get('/st/:id',async(req,res)=>{
//   try {
//     const{id}=req.params  
//     const l=await Pool.query("SELECT * FROM student WHERE std_id =$1",[id])
//     res.json(l.rows[0])
//   } catch (error) {
//     console.error(error.message)
//   }
 
// })
// app.put('/st/:id',async(req,res)=>{
//   try {
//     const{id}=req.params  
//     const{std_name}=req.body

//     const l=await Pool.query("UPDATE student SET std_name =$1 WHERE std_id =$2",[std_name,id])

//     res.json("UPADATED")
//   } catch (error) {
//     console.error(error.message)
//   }
 
// })
const Studentadd= App.post('/admin', async (req, res) => {
  try {
    const { std_name, father_name, std_id,classs } = req.body;
    const result = await Pool.query(
        "INSERT INTO student (std_id, std_name, father_name,class) VALUES ($1, $2, $3,$4) ", 
        [std_id, std_name, father_name, classs]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});
export default Studentadd