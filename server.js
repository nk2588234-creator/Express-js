const express = require("express");
const app = express();

app.use(express.json());

let students = require("./students");

// 1. Welcome Message
app.get("/", (req, res) => {
  res.send("Welcome to Student Management API");
});

// 2. Fetch All Students
app.get("/students", (req, res) => {
  res.send(students);
});

// 3. Fetch Student By ID
app.get("/students/:id", (req, res) => {
  const student = students.find(
    s => s.id == req.params.id
  );

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
});

// 4. Add New Student
app.post("/students", (req, res) => {
  students.push(req.body);
  res.json({
    message: "Student Added",
    student: req.body
  });
});

// 5. Delete Student By ID
app.delete("/students/:id", (req, res) => {
  students = students.filter(
    s => s.id != req.params.id
  );

  res.json({
    message: "Student Deleted"
  });
});

// 6. Update Student
app.put("/students/:id", (req, res) => {
  const index = students.findIndex(
    s => s.id == req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Student not found"
    });
  }

  students[index] = {
    ...students[index],
    ...req.body
  };

  res.json({
    message: "Student Updated",
    student: students[index]
  });
});

// 7. Search Student By Name
app.get("/students/search/name/:name", (req, res) => {
  const result = students.filter(
    s =>
      s.name.toLowerCase().includes(
        req.params.name.toLowerCase()
      )
  );

  res.json(result);
});

// 8. Search Student By Course
app.get("/students/search/course/:course", (req, res) => {
  const result = students.filter(
    s =>
      s.course.toLowerCase() ===
      req.params.course.toLowerCase()
  );

  res.json(result);
});

// 9. Filter Students By City
app.get("/students/city/:city", (req, res) => {
  const result = students.filter(
    s =>
      s.city.toLowerCase() ===
      req.params.city.toLowerCase()
  );

  res.json(result);
});

// 10. Count Total Students
app.get("/students/count", (req, res) => {
  res.json({
    totalStudents: students.length
  });
});

// 11. Fees Greater Than Amount
app.get("/students/fees/greater/:amount", (req, res) => {
  const amount = Number(req.params.amount);

  res.json(
    students.filter(s => s.fees > amount)
  );
});

// 12. Fees Less Than Amount
app.get("/students/fees/less/:amount", (req, res) => {
  const amount = Number(req.params.amount);

  res.json(
    students.filter(s => s.fees < amount)
  );
});

// 13. Sort By Name
app.get("/students/sort/name", (req, res) => {
  const sorted = [...students].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  res.json(sorted);
});

// 14. Sort By Fees Low To High
app.get("/students/sort/fees/asc", (req, res) => {
  const sorted = [...students].sort(
    (a, b) => a.fees - b.fees
  );

  res.json(sorted);
});

// 15. Sort By Fees High To Low
app.get("/students/sort/fees/desc", (req, res) => {
  const sorted = [...students].sort(
    (a, b) => b.fees - a.fees
  );

  res.json(sorted);
});

// 16. Check Student Exists
app.get("/students/exists/:name", (req, res) => {
  const student = students.find(
    s =>
      s.name.toLowerCase() ===
      req.params.name.toLowerCase()
  );

  res.json({
    exists: !!student
  });
});

// 17. Total Fees Collected
app.get("/students/fees/total", (req, res) => {
  const total = students.reduce(
    (sum, s) => sum + s.fees,
    0
  );

  res.json({
    totalFees: total
  });
});

// 18. Course Wise Students
app.get("/students/coursewise", (req, res) => {
  const result = {};

  students.forEach(student => {
    if (!result[student.course]) {
      result[student.course] = [];
    }

    result[student.course].push(student);
  });

  res.json(result);
});

// 19. Add Multiple Students
app.post("/students/many", (req, res) => {
  students.push(...req.body);

  res.json({
    message: "Multiple Students Added",
    totalStudents: students.length
  });
});

// 20. Dashboard Report
app.get("/students/dashboard", (req, res) => {

  const totalStudents = students.length;

  const totalFees = students.reduce(
    (sum, s) => sum + s.fees,
    0
  );

  const courseSummary = {};

  students.forEach(student => {
    courseSummary[student.course] =
      (courseSummary[student.course] || 0) + 1;
  });

  res.json({
    totalStudents,
    totalFees,
    courseSummary
  });
});

// Server Start
app.listen(3000, () => {
  console.log(
    "Server Running at http://localhost:3000"
  );
});