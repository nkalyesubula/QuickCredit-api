

class User{
    constructor(email, firstName, lastName, hashedPassword, address, isAdmin){
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = hashedPassword;
        this.address = address;
        this.status = 'unverified';
        this.isAdmin = 'true';
    }
}

module.exports = User;


// app.post('/student', (req, res) => {
//     const data = {
//       name : req.body.studentName,
//       age : req.body.studentAge,
//       classroom : req.body.studentClass,
//       parents : req.body.parentContact,
//       admission : req.body.admissionDate,
//     }
  
//     pool.connect((err, client, done) => {
//       const query = 'INSERT INTO students(student_name,student_age, student_class, parent_contact, admission_date) VALUES($1,$2,$3,$4,$5) RETURNING *';
//       const values = [data.name, data.age, data.classroom, data.parents, data.admission];
  
//       client.query(query, values, (error, result) => {
//         done();
//         if (error) {
//           res.status(400).json({error});
//         }
//         res.status(202).send({
//           status: 'SUccessful',
//           result: result.rows[0],
//         });
//       });
//     });
//   });


