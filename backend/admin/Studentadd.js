import App from "../App/App.js";
import Pool from "../db/Database.js";

const Studentadd = App.post('/admin', async (req, res) => {
  try {
    const {
      std_name, father_name, mother_name, std_id, classs, mobile_number,
      parent_number, address, previous_school, class_teacher, admission_date,
      photo, result
    } = req.body;

    const check = await Pool.query(
      `INSERT INTO student (
        std_id, std_name, father_name, mother_name, class, mobile_number,
        parent_number, address, previous_school, class_teacher, admission_date,
        photo, result
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        std_id, std_name, father_name, mother_name, classs, mobile_number,
        parent_number, address, previous_school, class_teacher, admission_date,
        photo, result
      ]
    );

    res.json(check.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

export default Studentadd;