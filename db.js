const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDb();
    }
});

function initializeDb() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            role TEXT
        )`);

        // Students Table
        db.run(`CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            phone TEXT,
            package TEXT,
            status TEXT
        )`);

        // Instructors Table
        db.run(`CREATE TABLE IF NOT EXISTS instructors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            license TEXT,
            phone TEXT,
            specialization TEXT,
            availability TEXT
        )`);

        // Vehicles Table
        db.run(`CREATE TABLE IF NOT EXISTS vehicles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            model TEXT,
            plate TEXT,
            transmission TEXT,
            status TEXT,
            serviceDate TEXT
        )`);

        // Lessons Table
        db.run(`CREATE TABLE IF NOT EXISTS lessons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student TEXT,
            instructor TEXT,
            vehicle TEXT,
            dateTime TEXT,
            status TEXT
        )`);

        // Payments Table
        db.run(`CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student TEXT,
            amount TEXT,
            method TEXT,
            date TEXT
        )`);

        seedData();
    });
}

function seedData() {
    // Check if users exist before seeding
    db.get("SELECT count(*) as count FROM users", (err, row) => {
        if (row.count === 0) {
            console.log("Seeding mock data...");
            // Seed Users
            const insertUser = db.prepare(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`);
            insertUser.run("admin", "password", "admin");
            insertUser.run("instructor", "password", "instructor");
            insertUser.run("student", "password", "student");
            insertUser.finalize();

            // Seed Students
            const insertStudent = db.prepare(`INSERT INTO students (name, email, phone, package, status) VALUES (?, ?, ?, ?, ?)`);
            insertStudent.run("Nimlesh Perera", "nimlesh@example.com", "+94771234567", "Premium Auto Course", "Active");
            insertStudent.run("Fathima Rizna", "rizna@example.com", "+94719876543", "Regular Manual Course", "Active");
            insertStudent.finalize();

            // Seed Instructors
            const insertInstructor = db.prepare(`INSERT INTO instructors (name, license, phone, specialization, availability) VALUES (?, ?, ?, ?, ?)`);
            insertInstructor.run("Captain Ranjith Silva", "L-DMV-90142", "+94752221111", "Defensive Driving Pro", "Available");
            insertInstructor.run("Mahinda Alwis", "L-DMV-33152", "+94724449999", "Light Motor Cars", "Available");
            insertInstructor.finalize();

            // Seed Vehicles
            const insertVehicle = db.prepare(`INSERT INTO vehicles (model, plate, transmission, status, serviceDate) VALUES (?, ?, ?, ?, ?)`);
            insertVehicle.run("Toyota Vitz", "WP CAD-2291", "Automatic", "Active", "2026-04-12");
            insertVehicle.run("Suzuki Alto", "WP CAA-8831", "Manual", "Active", "2026-05-01");
            insertVehicle.finalize();

            // Seed Lessons
            const insertLesson = db.prepare(`INSERT INTO lessons (student, instructor, vehicle, dateTime, status) VALUES (?, ?, ?, ?, ?)`);
            insertLesson.run("Nimlesh Perera", "Captain Ranjith Silva", "Toyota Vitz (WP CAD-2291)", "2026-08-12T10:00", "Scheduled");
            insertLesson.finalize();

            // Seed Payments
            const insertPayment = db.prepare(`INSERT INTO payments (student, amount, method, date) VALUES (?, ?, ?, ?)`);
            insertPayment.run("Nimlesh Perera", "45000", "POS Terminals Card", "2026-06-15");
            insertPayment.run("Fathima Rizna", "35000", "Cash Transfer", "2026-06-18");
            insertPayment.finalize();
        }
    });
}

module.exports = db;
