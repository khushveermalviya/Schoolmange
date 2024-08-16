import express from 'express';
import Pool from '../db/Database.js';
import app from "../App/App.js";


app.get('/Login', async (req, res) => {
  try {
    const Login = await Pool.query('SELECT * FROM student');
    res.json(list.rows);

    // Process and log user details
    list.rows.forEach((student) => {
      const user_country_code = student.user_country_code;
      const user_phone_number = student.user_phone_number;
      const user_first_name = student.user_first_name;
      const user_last_name = student.user_last_name;

      console.log('User Country Code:', user_country_code);
      console.log('User Phone Number:', user_phone_number);
      console.log('User First Name:', user_first_name);
      console.log('User Last Name:', user_last_name);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching students');
  }
});


export default Login;