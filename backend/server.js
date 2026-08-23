const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.get('/api/campus', (req, res) => {
  res.json({
    college: 'Smart Campus College',
    students: 500,
    faculty: 50,
    departments: 8
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Smart Campus Management',
    status: 'success'
  })
})
const PORT = 5000;


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});