const { request } = require('express')
const express = require('express')
const connect = require('../Database/DB')
const router = require('express-promise-router')()
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const moment = require('moment-timezone');


dotenv.config();




//get Admin
router.get('/tbl_admin',async (req,res,next) => {
    try {
        connect.query('SELECT * FROM tbl_admin order by admin_id desc',(err,rows) => {
            if (err){
                res.send(err)
            }
            else{
                res.send(rows)
            }
        }) 
    }
    catch (e) {
        res.send(e)
    }
})


//add employee
router.post("/tbl_admin2" ,async (req,res,next) => {
    
    const admin_name = req.body.admin_name;
    const admin_designation = req.body.admin_designation;
    const admin_email = req.body.admin_email;
    const admin_password = req.body.admin_password;
    const confirmpassword = req.body.confirmpassword;
    const admin_phone = req.body.admin_phone;
    const created_timestamp = req.body.created_timestamp ;
    const updated_timestamp = req.body.updated_timestamp ;
    const admin_address = req.body.admin_address;
    const admin_id = req.body.admin_id;

    // generate salt for password
    const salt = await bcrypt.genSalt(10);
    // hash password with salt
    const encryptedPassword = await bcrypt.hash(admin_password, salt);

    console.log('data1',req.body);
    // console.log(next);
    // res.send('hello')
    connect.query('INSERT INTO tbl_admin (admin_name,admin_designation,admin_email,admin_password,admin_phone,admin_address,created_timestamp,updated_timestamp) VALUES(?,?,?,?,?,?,now(),now())',
    [admin_name,admin_designation,admin_email,encryptedPassword,admin_phone,admin_address,created_timestamp,updated_timestamp],
    (err,result) => {
        if (err){
            console.log(err);
        
        }
        else{
            res.send("Values inserted");
        }
    }
    )
})

//update dataEmployee
router.put ("/update/:admin_id" ,(req,res,next) => {
    
    const admin_name = req.body.admin_name;
    const admin_designation = req.body.admin_designation;
    const admin_email = req.body.admin_email;
    const admin_password = req.body.admin_password;
    const confirmpassword = req.body.confirmpassword;
    const admin_phone = req.body.admin_phone;
    const created_timestamp = req.body.created_timestamp ;
    const updated_timestamp = req.body.updated_timestamp ;
    const admin_address = req.body.admin_address;
    const admin_id = req.body.admin_id;
    
    console.log('edit',req.body)
    connect.query('UPDATE device_asset.tbl_admin SET admin_name=?,admin_email=?,admin_password=?,admin_phone=?,admin_address=?,admin_designation=?,created_timestamp=now(),updated_timestamp=now() WHERE admin_id = ?',[admin_name,admin_email,admin_password,admin_phone,admin_address,admin_designation,admin_id,created_timestamp,updated_timestamp],
    (err,result) => {
        if (err){
            console.log(err);
        
        }
        else{
            res.send("Values updated");
        }
    })
    console.log('Values updated2');
})

//get Employee for edit employee
router.get ("/getEmployee/:admin_id" ,(req,res,next) => {
    const admin_id = req.params.admin_id;
    console.log('555',req.params)

    connect.query('SELECT * FROM tbl_admin WHERE admin_id = ? ',admin_id,
    (err,rows) => {
        if (err){
            res.send(err)
        }
        else {
            Object.keys(rows).forEach(function (key) {
                var row = rows[key];
                res.send(row)
                
            })
            // console.log(rows);
        }
    }) 
})

//delete employee
router.delete('/delete/:admin_id',(req,res) => {
    
    const admin_id = req.params.admin_id;
    connect.query('DELETE FROM tbl_admin WHERE admin_id = ?',admin_id,(err,result) => {
        if(err){
        
            console.log(err);
        }
        else{
            res.send(result);
        }
    })
    console.log('success');
}) 


router.post("/tbl_list_repair" ,(req,res,next) => {
    
    const case_detail = req.body.case_detail.case_detail;
    const created_timestamp = req.body.created_timestamp ;
    const updated_timestamp = req.body.updated_timestamp ;
    const owner_id = req.body.owner_id;
    const admin_id = req.body.admin_id;
    const case_image = req.body.case_image
    const case_note = req.body.case_note


    console.log(req.body.case_detail.case_detail);
    // console.log(next);
    // res.send('hello')
    connect.query('INSERT INTO tbl_list_repair (case_detail,created_timestamp,updated_timestamp) VALUES(?,now(),now())',
    [case_detail,created_timestamp,updated_timestamp],
    (err,resul) => {
        if (err){
            console.log(err);
        
        }
        else{
            res.send("Values inserted");
        }
    }
    )
})


router.get('/getstatus/:id',async (req,res) => {

        const id = req.params.id

        console.log(id);
    
    try {
        const id = req.params.id;
    
        connect.query(`SELECT * FROM boi_it_smt WHERE id= '\t${id}\t'`, (err, result) => {
            if (err) {

                console.log(err);
            }
            else {
                res.send(result);
            }
        })

        
    }
    catch (e) {
        res.send(e)
    }
})


//-------post image from uplodaimage.js to database ----------------------------------------------
router.post('/tbl_list_repair2', async (req, res) => {	
    try {
        console.log(req.body.body.imgs);
        console.log(req.body);
        const image = req.body.body.imgs;
       
           const id = req.body.body.id
       
            const sql = "INSERT INTO tbl_repair (image,device_id) VALUES(?,?)"
            connect.query(sql, [image,id], (err, results) => {  if (err) throw err;
              res.setHeader('Access-Control-Allow-Origin', 'https://beautiful-blini-a9b6bb.netlify.app');
			     
                res.send(results)   
			}); 
      
    }catch (err) {console.log(err)}
})
//-----------get image from database for show RepairDetails.js-------------------------------------
router.get ("/getImage/:id" ,(req,res,next) => {
    const id = req.params.id;
    console.log(req.params)

    connect.query('SELECT * FROM tbl_repair WHERE id = ?',id,
    (err,rows) => {
        if (err){
            res.send(err)
        }
        else {
            
            Object.keys(rows).forEach(function (key) {
                var row = rows[key];
                res.send(row)
            })
        }
    }) 
})
//--------------get tastimage----------------------------------------------
router.get('/gat/tbl_tastimg/:id',async (req,res,next) => {
    const id = req.params.id;
    console.log('id11',req.params)
    try {
        connect.query('SELECT * FROM tbl_repair WHERE id = ?',id,(err,rows) => {
            if (err){
                res.send(err)
            }
            else{
                res.send(rows)
            }
        }) 
    }
    catch (e) {
        res.send(e)
    }
})
//---------put repair and send line noti----------------------------------------------------------
router.put ("/put/repair/:id" ,(req,res,next) => {

    const lineNotify = require('line-notify-nodejs')('G9lzeks0DzzT4BmXglynx3EtmyIkygN3NekiwUI1zuL');
    const id = req.body.id;
    const case_detail = req.body.case_detail;
    const device_id = req.body.device_id;
    const employee_name = req.body.employee_name;
    
    console.log('id22',req.body.id);
    console.log('id23',req.body.device_id);
    console.log('reqbody',req.body)
    connect.query('UPDATE tbl_repair SET case_detail=? WHERE id = ?',[case_detail,id],
    (err,result) => {
        lineNotify.notify({
            message:'\nแจ้งซ่อมอุปกรณ์\n'  +employee_name+ 
                    '\nรายละเอียด : ' + case_detail+ 
                    '\nDevice : ' +device_id
                     
                
          }).then(() => {
            console.log('send completed!');
          });
          
        if (err){
            console.log(err);
        
        }
        else{
            res.send("Values updated");
        }
        
    })
})

// //send noti 
// router.post("/sendNoti",(req,res,next) => {

//     const lineNotify = require('line-notify-nodejs')('G9lzeks0DzzT4BmXglynx3EtmyIkygN3NekiwUI1zuL');



// lineNotify.notify({
//   message: 'A new user has sent a request for repairing the device.',
  
  
// }).then(() => {
//   console.log('send completed!');
// });

// })

//get Activity
router.get('/get/activity',async (req,res,next) => {
    try {
        connect.query('SELECT * FROM tbl_repair',(err,rows) => {
            if (err){
                res.send(err)
            }
            else{
                res.send(rows)
            }
        }) 
    }
    catch (e) {
        res.send(e)
    }
})



//update Repair_Status For damin
router.put ("/update/status/:id" ,(req,res,next) => {
    const id = req.params.id;
    const admin_id = req.body.admin_id;
    const status = req.body.status;
    const priority = req.body.priority;
    const updated_timestamp = moment().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');;


    console.log('edit55',req.body)
    connect.query('UPDATE tbl_repair SET admin_id=?,updated_timestamp=? WHERE id = ?',[admin_id,updated_timestamp,id],
    (err,result) => {
        if (err){
            console.log(err);
        
        }
        else{
            res.send("Values updated");
        }
    })
})


//update Repair_Status For IT supp
router.put ("/update/statusForIT/:id" ,(req,res,next) => {
  const id = req.params.id;
  const admin_id = req.body.admin_id;
  const status = req.body.status;
  const priority = req.body.priority;
  const updated_timestamp = moment().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');;


  console.log('edit55',req.body)
  connect.query('UPDATE tbl_repair SET status=?,priority=?,updated_timestamp=? WHERE id = ?',[status,priority,updated_timestamp,id],
  (err,result) => {
      if (err){
          console.log(err);
      
      }
      else{
          res.send("Values updated");
      }
  })
})



//update Repair_Status when user accep device 
router.put ("/update/statusComplete/:id" ,(req,res,next) => {

    const id = req.params.id;
    const status = 'Complete';

    console.log('edit55',req.body)
    connect.query('UPDATE tbl_repair SET status=? WHERE id = ?',[status,id],
    (err,result) => {
        if (err){
            console.log(err);
        
        }
        else{
            res.send("Values updated");
        }
    })
})

//get status for Repair_Status
router.get ("/get/status/:id" ,(req,res,next) => {
    const id = req.params.id;
    console.log('555',req.params)

    connect.query('SELECT * FROM device_asset.tbl_repair WHERE id = ? ',id,
    (err,rows) => {
        if (err){
            res.send(err)
        }
        else {
            Object.keys(rows).forEach(function (key) {
                var row = rows[key];
                res.send(row)
                
            })
        }
    }) 
})

//get status for Repair_Status
router.get ("/get/status/device/:device_id" ,(req,res,next) => {
    const device_id = req.params.device_id;
    console.log('555',req.params)

    connect.query('SELECT * FROM tbl_repair WHERE device_id = ? order by id desc',device_id,
    (err,rows) => {
        if (err){
            res.send(err)
        }
        else {
            Object.keys(rows).forEach(function (key) {
                var row = rows[key];
                 res.send(row)
                //console.log(rows);
                
            })
            // console.log(rows);
        }
    }) 
})

//get DataDeviece for Repair_Status
router.get ("/getDataDevice/:device_id" ,(req,res,next) => {
    const device_id = req.params.device_id;
    console.log('555',req.params)

    connect.query('SELECT * FROM tbl_device WHERE device_id = ? ',device_id,
    (err,rows) => {
        if (err){
            res.send(err)
        }
        else {
            Object.keys(rows).forEach(function (key) {
                var row = rows[key];
                res.send(row)
                
            })
            // console.log(rows);
        }
    }) 
})


//getlengh status ForAdmin
router.get("/getCountStatus/", (req, res, next) => {
 
  connect.query(
    "SELECT SUM(CASE WHEN status='success' THEN 1 ELSE 0 END) AS success_count, SUM(CASE WHEN status='In Progress' THEN 1 ELSE 0 END) AS progress_count, SUM(CASE WHEN status='Complete' THEN 1 ELSE 0 END) AS complete_count FROM tbl_repair",
    (err, rows) => {
      if (err) {
        res.send(err);
      } else {
        res.send(rows[0]);
      }
    }
  );
});

//getlengh status ForIT
router.get("/getCountStatusForIT/:admin_id", (req, res, next) => {
  const adminId = req.params.admin_id;

  connect.query(
    `SELECT SUM(CASE WHEN status='ซ่อมเสร็จแล้ว' THEN 1 ELSE 0 END) AS success_count, 
     SUM(CASE WHEN status='กำลังซ่อม' THEN 1 ELSE 0 END) AS progress_count, 
     SUM(CASE WHEN status='ส่งคืนเครื่องเรียบร้อย' THEN 1 ELSE 0 END) AS complete_count 
     FROM tbl_repair WHERE admin_id = ?`,
    [adminId],
    (err, rows) => {
      if (err) {
        res.send(err);
      } else {
        res.send(rows[0]);
      }
    }
  );
});



//get status for Repair_Status edit 16/04/2023
router.get ("/get/get/for/join" ,(req,res,next) => {
  const sql = `
      SELECT r.id, e.employee_name, e.employee_email,d.device_id,d.device_serial, d.device_model, r.case_detail,r.priority,r.status,a.admin_name,r.created_timestamp,r.updated_timestamp
      FROM tbl_repair AS r 
      LEFT JOIN tbl_device AS d ON r.device_id = d.device_id
      LEFT JOIN tbl_owner AS o ON d.device_id = o.device_id
      LEFT JOIN tbl_employee AS e ON o.employee_id = e.employee_id
      LEFT JOIN tbl_admin AS a ON r.admin_id = a.admin_id
      
      ORDER BY r.id DESC
  `;

  connect.query(sql, (error, results, fields) => {
      if (error) {
          console.log(error);
          res.status(500).json({error: 'Error fetching data from database.'});
      } else {
          const updatedResults = results.map(result => {
              const created_timestamp = moment(result.created_timestamp).tz('Asia/Bangkok').format('YYYY-MM-DD');
              const updated_timestamp = moment(result.updated_timestamp).tz('Asia/Bangkok').format('YYYY-MM-DD');
              return {...result, created_timestamp,updated_timestamp};
          });
          res.json(updatedResults);
      }
  });
});


//get status for Repair_Status test
router.get ("/get/get/for/join1/:id" ,(req,res,next) => {
    const id = req.params.id;
   
    console.log('555',req.params)
    const sql = `
        SELECT r.id, e.employee_name, e.employee_email,d.device_id,d.device_serial, d.device_model, r.case_detail,r.priority, r.status,a.admin_name,r.created_timestamp,r.updated_timestamp
        FROM tbl_repair AS r 
        LEFT JOIN tbl_device AS d ON r.device_id = d.device_id
        LEFT JOIN tbl_owner AS o ON d.device_id = o.device_id
        LEFT JOIN tbl_employee AS e ON o.employee_id = e.employee_id
        LEFT JOIN tbl_admin AS a ON r.admin_id = a.admin_id
        WHERE r.id = ?        
    `;
    connect.query(sql,id, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(500).json({error: 'Error fetching data from database.'});
        } else {
            Object.keys(results).forEach(function (key) {
                var row = results[key];
                res.send(row)
            })
 
        }
    });
    
})

//get activity for admib id
router.get("/get/repair/by/admin/:admin_id", (req, res, next) => {
  const admin_id = req.params.admin_id;

  const sql = `
    SELECT r.id, e.employee_name, e.employee_email, d.device_id, d.device_serial, d.device_model, r.case_detail, r.priority, r.status, a.admin_name
    FROM tbl_repair AS r 
    LEFT JOIN tbl_device AS d ON r.device_id = d.device_id
    LEFT JOIN tbl_owner AS o ON d.device_id = o.device_id
    LEFT JOIN tbl_employee AS e ON o.employee_id = e.employee_id
    LEFT JOIN tbl_admin AS a ON r.admin_id = a.admin_id
    WHERE r.admin_id = ?
  `;

  connect.query(sql, admin_id, (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "Error fetching data from database." });
    } else {
      const updatedResults = results.map(result => {
        const created_timestamp = moment(result.created_timestamp).tz('Asia/Bangkok').format('YYYY-MM-DD');
        const updated_timestamp = moment(result.updated_timestamp).tz('Asia/Bangkok').format('YYYY-MM-DD');
        return {...result, created_timestamp,updated_timestamp};
    });
    res.json(updatedResults);
    }
  });
});


//get for send email test
// router.get ("/get/for/sendEmail/:id" ,(req,res,next) => {
//     const id = req.params.id;
//     console.log('555',req.params)

//     connect.query('SELECT * FROM device_asset.tbl_repair WHERE id = ? ',id,
//     (err,rows) => {
//         if (err){
//             res.send(err)
//         }
//         else {
//             Object.keys(rows).forEach(function (key) {
//                 var row = rows[key];
//                 res.send(row)
                
//             })
//             // console.log(rows);
//         }
//     }) 
// })


//send email
router.post("/sendEmail",(req,res,next) => {

    console.log(req.body);
    const status = req.body.status;
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'kh.hatari@gmail.com',
          pass: 'qtyvtrqaoknhfqki'
        }
      });
      
      var mailOptions = {
        from: 'kh.hatari@gmail.co',
        to: req.body.employee_email,
        subject: 'อัปเดตสถานะการซ่อมอุปกรณ์',
        text: 'ขณะนี้อุปกรณ์ของคุณมีสถานะคือ ' +status+
              '\n*หมายเหตุ'  +
              '\nสถานะ กำลังซ่อม : อยู่ระหว่างกระบวนการซ่อม' + 
              '\nสถานะ ซ่อมเสร็จแล้ว : อุปกรณ์ซ่อมเสร็จแล้ว สารมารถรับอุปกรณ์คืนได้' +
              '\nสถานะ ส่งคืนเครื่องเรียบร้อย : สิ้นสุดกระบวนการส่งซ่อมอุปกรณ์' 
                     
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

})

//send email after register admin
router.post("/sendEmailAdmin",(req,res,next) => {

    console.log(req.body);
    const admin_password = req.body.admin_password;


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'kh.hatari@gmail.com',
          pass: 'qtyvtrqaoknhfqki'
        }
      });
      
      var mailOptions = {
        from: 'kh.hatari@gmail.co',
        to: req.body.admin_email,
        subject: 'รหัสผ่านสำหรับเข้าใช้งานระบบ cmms online asset',
        text: 'รหัสผ่านของคุณคือ '+admin_password
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

})

// //send noti 
// router.post("/sendNoti",(req,res,next) => {

//     const lineNotify = require('line-notify-nodejs')('G9lzeks0DzzT4BmXglynx3EtmyIkygN3NekiwUI1zuL');

// lineNotify.notify({
//   message: 'A new user has sent a request for repairing the device.',
  
  
// }).then(() => {
//   console.log('send completed!');
// });

// })


//login เข้ารหัส
router.post('/admin/login', async (req, res) => {

  
  const admin_email = req.body.admin_email;
  const admin_password = req.body.admin_password;

  
  connect.query('SELECT * FROM tbl_admin WHERE admin_email = ?', [admin_email], async (error, results) => {
    if (error) {
      res.send({ error: error });
    } else {
      if (results.length > 0) {
        const comparison = await bcrypt.compare(admin_password, results[0].admin_password);
        if (comparison) {
          res.send(results[0]);
        } else {
          res.status(500).send("Invalid Credentials");
        }
      } else {
        res.status(500).send("Invalid Credentials");
      }
    }
  })
  

})

//login ไม่เข้ารหัส
// router.post('/admin/login', async (req, res) => {

//   const admin_email = req.body.admin_email;
//   const admin_password = req.body.admin_password;

  
//     connect.query('SELECT * FROM tbl_admin WHERE admin_email = ? AND admin_password = ?', [admin_email, admin_password], (err, results) => {
//       if (err) {
//         res.send({ err: err })
//       }
//       if (results.length > 0) {
//         Object.keys(results).forEach(function (key) {
//           var row = results[key];
//           res.send(row)
//       })
//       } else {
//         res.status(500).send("Invalid Credentials");
         
//       }

//     })
  

// })

//change pass
router.post("/changepassword", async (req, res) => {
  const new_pass = req.body.new_pass;
  const admin_id = req.body.admin_id;
  console.log('id',admin_id);
  console.log('new',new_pass);

  try {
    // เข้ารหัสตัวแปร new_pass ด้วย bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(new_pass, salt);

    connect.query(
      "UPDATE tbl_admin SET admin_password = ? WHERE admin_id = ?;",
      [hashedPass, admin_id],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error updating password" });
        } else {
          res.status(200).json({ message: "Password updated successfully" });
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating password" });
  }
});



//-------------------------------------------------------------------------------------------gate-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------gate-------------------------------------------------------------------------------------------------

//--------------------------Users-----------------------------------------------------
//get employee
router.get("/tbl_employee", async (req, res, next) => {
    try {
      connect.query("SELECT * FROM tbl_employee", (err, rows) => {
        if (err) {
          res.send(err);
        } else {
          res.send(rows);
        }
      });
    } catch (e) {
      res.send(e);
    }
  });

  //add employee (user)
router.post("/tbl_employee2", (req, res, next) => {
    const employee_name = req.body.employee_name;
    //const admin_designation = req.body.admin_designation;
    const employee_email = req.body.employee_email;
    //const admin_password = req.body.admin_password;
    //const confirmpassword = req.body.confirmpassword;
    const employee_phone = req.body.employee_phone;
    const created_timestamp = req.body.created_timestamp;
    const updated_timestamp = req.body.updated_timestamp;
    const employee_address = req.body.employee_address;
    const employee_id = req.body.employee_id;
  
    console.log("data1", req.body);
    // console.log(next);
    // res.send('hello')
    connect.query(
      "INSERT INTO tbl_employee (employee_name,employee_email,employee_address,employee_phone,created_timestamp,updated_timestamp) VALUES(?,?,?,?,now(),now())",
      [
        employee_name,
        employee_email,
        employee_address,
        employee_phone,
        created_timestamp,
        updated_timestamp,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values inserted");
        }
      }
    );
  });


  //update dataEmployee(user)
router.put("/update/user/:employee_id", (req, res, next) => {
    const employee_name = req.body.employee_name;
    //const admin_designation = req.body.admin_designation;
    const employee_email = req.body.employee_email;
    //const admin_password = req.body.admin_password;
    //const confirmpassword = req.body.confirmpassword;
    const employee_phone = req.body.employee_phone;
    const created_timestamp = req.body.created_timestamp;
    const updated_timestamp = req.body.updated_timestamp;
    const employee_address = req.body.employee_address;
    const employee_id = req.body.employee_id;
  
    console.log("edit", req.body);
    connect.query(
      "UPDATE tbl_employee SET employee_name=?,employee_email=?,employee_address=?,employee_phone=?,created_timestamp=now(),updated_timestamp=now() WHERE employee_id = ?",
      [
        employee_name,
        employee_email,
        employee_address,
        employee_phone,
        employee_id,
        created_timestamp,
        updated_timestamp,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values updated");
        }
      }
    );
    console.log("Values updated2");
  });

  //get Employee for edit employee(user)
router.get("/getUser/:employee_id", (req, res, next) => {
    const employee_id = req.params.employee_id;
    
    console.log("555", req.params);
  
    connect.query(
      "SELECT * FROM tbl_employee WHERE employee_id = ? ",
      employee_id,
      (err, rows) => {
        if (err) {
          res.send(err);
        } else {
          Object.keys(rows).forEach(function (key) {
            var row = rows[key];
            res.send(row);
          });
          // console.log(rows);
        }
      }
    );
  });

  //delete employee (user)
router.delete("/deleteUser/:employee_id", (req, res) => {
    const employee_id = req.params.employee_id;
    connect.query(
      "DELETE FROM tbl_employee WHERE employee_id = ?",
      employee_id,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
    console.log("success");
  });


  //--------------------------------------------------------------Devices---------------------------------------------------
//get Devices
// router.get("/tbl_device", async (req, res, next) => {
//   try {
//     connect.query("SELECT * FROM tbl_device WHERE device_status <> 'Not Available' ORDER BY device_id DESC", (err, rows) => {
//       if (err) {
//         res.send(err);
//       } else {
//         res.send(rows);
//       }
//     });
//   } catch (e) {
//     res.send(e);
//   }
// });
router.get("/tbl_device", async (req, res, next) => {
  try {
    connect.query("SELECT * FROM tbl_device WHERE device_status <> 'Not Available' ORDER BY device_id DESC",
      (err, rows) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Error fetching data from database." });
        } else {
          const updatedResults = rows.map(result => {
            const created_timestamp = moment(result.created_timestamp).tz('Asia/Bangkok').format('YYYY-MM-DD');
            const updated_timestamp = moment(result.updated_timestamp).tz('Asia/Bangkok').format('YYYY-MM-DD');
            return {...result, created_timestamp,updated_timestamp};
          });
          res.json(updatedResults);
        }
      }
    );
  } catch (e) {
    res.status(500).json({ error: "Error fetching data from database." });
  }
});

//get start date end date
router.post("/startdate", async (req, res, next) => {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  
  console.log(req.body);
  try {
    connect.query("SELECT * FROM tbl_device WHERE created_timestamp BETWEEN ? AND ? ORDER BY device_id DESC",
      [startDate, endDate],
      (err, rows) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Error fetching data from database." });
        } else {
          const updatedResults = rows.map(result => {
            const created_timestamp = moment(result.created_timestamp).tz('Asia/Bangkok').format('YYYY-MM-DD');
            const updated_timestamp = moment(result.updated_timestamp).tz('Asia/Bangkok').format('YYYY-MM-DD');
            return {...result, created_timestamp,updated_timestamp};
          });
          res.json(updatedResults);
        }
      }
    );
  } catch (e) {
    res.status(500).json({ error: "Error fetching data from database." });
  }
});




  //get Devices
router.get("/getCheck/:device_id", async (req, res, next) => {
  const device_id = req.params.device_id;
  console.log('555',req.params)

  connect.query('SELECT * FROM tbl_device WHERE device_id = ? ',[device_id],
  (err,rows) => {
      if (err){
          res.send(err)
      }
      else {
          Object.keys(rows).forEach(function (key) {
              var row = rows[key];
              res.send(row)
              
          })
          // console.log(rows);
      }
  }) 
});



  //add Devices
router.post("/tbl_device2", (req, res, next) => {
    const device_name = req.body.device_name;
    const device_warranty = req.body.device_warranty;
    const device_producer = req.body.device_producer;
    const device_cost = req.body.device_cost;
    const device_note = req.body.device_note;
    const device_status = req.body.device_status;
    const device_model = req.body.device_model;
    const device_serial = req.body.device_serial;
    const device_asset_tag = req.body.device_asset_tag;
    const device_year = req.body.device_year;
    const device_month = req.body.device_month;
    const device_date = req.body.device_date;
    const device_id = req.body.device_id;
    const device_type = req.body.device_type;
    const created_timestamp = req.body.created_timestamp;
    const updated_timestamp = req.body.updated_timestamp;
  
    console.log("data1", req.body);
    // console.log(next);
    // res.send('hello')
    connect.query(
      "INSERT INTO tbl_device (device_name,device_warranty,device_producer,device_cost,device_note,device_status,device_model,device_serial,device_asset_tag,device_type,created_timestamp,updated_timestamp) VALUES(?,?,?,?,?,?,?,?,?,?,now(),now())",
      [
        device_name,
        device_warranty,
        device_producer,
        device_cost,
        device_note,
        device_status,
        device_model,
        device_serial,
        device_asset_tag,
        device_type,
        created_timestamp,
        updated_timestamp,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values inserted");
        }
      }
    );
  });

  //update device
  router.put("/update/Device/:device_id", (req, res, next) => {
    const device_name = req.body.device_name;
    const device_warranty = req.body.device_warranty;
    const device_producer = req.body.device_producer;
    const device_cost = req.body.device_cost;
    const device_note = req.body.device_note;
    const device_status = req.body.device_status;
    const device_model = req.body.device_model;
    const device_serial = req.body.device_serial;
    const device_asset_tag = req.body.device_asset_tag;
    const device_year = req.body.device_year;
    const device_month = req.body.device_month;
    const device_date = req.body.device_date;
    const device_id = req.params.device_id;
    const device_type = req.body.device_type;
    const updated_timestamp = req.body.updated_timestamp;
  
    console.log("edit", req.body);
    console.log('name',device_note);
    connect.query(
      "UPDATE tbl_device SET device_name=?,device_warranty=?,device_producer=?,device_cost=?,device_note=?,device_status=?,device_model=?,device_serial=?,device_asset_tag=?,device_type=?,updated_timestamp=now() WHERE device_id = ?",
      [
        device_name,
        device_warranty,
        device_producer,
        device_cost,
        device_note,
        device_status,
        device_model,
        device_serial,
        device_asset_tag,
        device_type,
        device_id,
        updated_timestamp,
       
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values updated");
          console.log("Values updated2");
        }
      }
    );
    
  });

  //get Device by id
router.get("/getAsset/:device_id", (req, res, next) => {
    const device_id = req.params.device_id;
    console.log("555", req.params);
  
    connect.query(
      "SELECT * FROM tbl_device WHERE device_id = ? ",
      device_id,
      (err, rows) => {
        if (err) {
          res.send(err);
        } else {
          Object.keys(rows).forEach(function (key) {
            var row = rows[key];
            res.send(row);
          });
          // console.log(rows);
        }
      }
    );
  });

  //QR

router.get("/getQR/:device_id", (req, res, next) => {
  const device_id = req.params.device_id;
  console.log("555", req.params);

  connect.query(
    `SELECT td.device_id, td.device_asset_tag, td.device_name, td.device_model, td.device_serial, te.employee_name FROM tbl_device as td 
    left join tbl_owner as tow on tow.device_id = td.device_id
    left join tbl_employee as te on tow.employee_id = te.employee_id
    WHERE td.device_id = ? `,
    device_id,
    (err, rows) => {
      if (err) {
        res.send(err);
      } else {
        Object.keys(rows).forEach(function (key) {
          var row = rows[key];
          console.log(row);
          res.send(row);
        });
        // console.log(rows);
      }
    }
  );
});


  //delete device
router.delete("/delete/:device_id", (req, res) => {
    const device_id = req.params.device_id;
    connect.query(
      "DELETE FROM tbl_device WHERE device_id = ?",
      device_id,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
    console.log("success");
  });

  //Dvice
  router.post("/tbl_device3", async (req, res) => {
    try {
      console.log(req.body.body.userInfo.filepreview);
      console.log(req.body);
      const image = req.body.body.userInfo.filepreview;
  
      const id = req.body.body.id;
  
      const sql = "INSERT INTO tbl_repair (device_image,device_id) VALUES(?,?)";
      connect.query(sql, [image, id], (err, results) => {
        if (err) throw err;
  
        res.send(results);
      });
    } catch (err) {
      console.log(err);
    }
  });


    //add owner
router.post("/update/ownner", async (req, res, next) => {
  const device_id = req.body.device_id;
  const employee_id = req.body.employee_id;
  const owner_note = req.body.owner_note;
  const device_status = req.body.device_status;

  console.log('555',req.body)

  

    // query ข้อมูลลงในตาราง tbl_owner
    connect.query('INSERT INTO tbl_owner (device_id, employee_id,owner_note,created_timestamp,updated_timestamp) VALUES (?, ?, ?,now(),now())', [device_id, employee_id,owner_note], (error, results) => {
      if (error) {
        connect.rollback(() => {
          throw error;
        });
      }

      console.log('Data inserted into tbl_owner table');

      // query ข้อมูลเพื่อ update device_status ในตาราง tbl_device
      connect.query('UPDATE tbl_device SET device_status = ? WHERE device_id = ?', [device_status, device_id], (error, results) => {
        if (error) {
          connect.rollback(() => {
            throw error;
          });
        }
        console.log('Data updated in tbl_device table');
          console.log('Transaction completed.');
          res.send('Data inserted into tbl_owner and updated in tbl_device');
        });
      });
    });



//get owner
router.get("/get/employee_name", (req, res, next) => {
  const sql = `SELECT d.device_id, d.device_name, d.device_producer, d.device_status, e.employee_name, d.device_note, d.device_serial, d.device_model, o.owner_id
               FROM tbl_device AS d
               LEFT JOIN tbl_owner AS o ON o.device_id = d.device_id 
               LEFT JOIN tbl_employee AS e ON o.employee_id = e.employee_id
               WHERE d.device_status != 'Not Available'
               ORDER BY d.device_id DESC`;

  connect.query(sql, (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "Error fetching data from database." });
    } else {
      res.json(results);
    }
  });
});

 
router.put("/updateOwner_id", (req, res, next) => {
  const owner_id = req.body.owner_id;
  const device_status = req.body.device_status; // เปลี่ยนตรงนี้
  const device_id = req.body.device_id;
  const employee_id = null;
  const note = null;
  const created_timestamp = req.body.created_timestamp;
  const updated_timestamp = req.body.updated_timestamp;

  console.log("help", owner_id);
  console.log('device_status:', device_status); // ใส่ console.log เพื่อดูค่า device_status ที่ส่งมา

  console.log('555',req.body)

  // Update tbl_owner
  connect.query(
    "DELETE FROM tbl_owner  WHERE owner_id = ?",
    [owner_id,],
    (err, result) => {
      if (err) {
        console.log(err);
        return connect.rollback(() => {
          res.status(500).send("Error updating owner");
        });
      } else {
        res.json(result)
      }
    }
  );

  // Update tbl_device
  connect.query(
    "UPDATE tbl_device SET device_status=?, updated_timestamp=now() WHERE device_id = ?",
    [device_status,device_id,],
    (err, result) => {
      if (err) {
        console.log(err);

      } else {
        console.log("Device updated");
      }
    }
  );
});



module.exports = router;