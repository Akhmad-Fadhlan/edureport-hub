// 6. BACKEND API EXAMPLE (Node.js/Express)

// models/User.js
const userSchema = {
  id: String,
  name: String,
  email: String,
  password: String,
  role: String, // 'admin' or 'teacher'
  cabang: String // 'Surabaya', 'Jakarta', etc.
};

// routes/students.js
router.get('/students', authenticateToken, async (req, res) => {
  try {
    let query = {};
    
    // Jika bukan admin, hanya tampilkan data cabangnya sendiri
    if (req.user.role !== 'admin') {
      query.cabang = req.user.cabang;
    }
    
    const students = await Student.find(query);
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/students', authenticateToken, async (req, res) => {
  try {
    const studentData = req.body;
    
    // Set cabang berdasarkan user yang login jika bukan admin
    if (req.user.role !== 'admin') {
      studentData.cabang = req.user.cabang;
    }
    
    const student = new Student(studentData);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// middleware/auth.js
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};
