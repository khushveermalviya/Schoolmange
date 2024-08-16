
import App from "../App/App.js";
import Pool from "../db/Database.js"


const Studentdelete=App.delete('/delete/:std_id', async (req, res) => {
  const { std_id } = req.params;  // Make sure this is correct
  console.log(`std_id: ${std_id}`);  // Add this for debugging
  
  if (!std_id) {
      return res.status(400).send('Student ID is required');
  }

  try {
      const result = await Pool.query('DELETE FROM student WHERE std_id = $1', [std_id]);
      if (result.rowCount === 0) {
          return res.status(404).send('Student not found');
      }
      res.status(200).send('Deletion complete');
  } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
  }
});

export default Studentdelete;