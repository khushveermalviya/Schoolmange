import express from 'express';
import Pool from '../db/Database.js';
import app from "../App/App.js";

const logs = app.post('/studentLogin', async (req, res) => {
  const { std_name, mobile_number } = req.body;

  try {
    const log = await Pool.query(
      `SELECT * FROM student WHERE LOWER(std_name) = LOWER($1) AND mobile_number = $2`,
      [std_name, mobile_number]
    );

    if (log.rows.length > 0) {
      res.status(200).send(true);
    } else {
      res.status(200).send(false);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching students');
  }
});

export default logs;