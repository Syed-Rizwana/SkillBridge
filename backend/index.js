const express = require('express')
const app = express()
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken')
const cookie = require('cookie-parser')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');
const port = 5000

const userReg = require('./models/UsersRegistration')
const profReg = require('./models/ProfessionalsRegistration')
const book = require('./models/Bookform')

const url = "mongodb+srv://gofood:mlRWAjwjIoCKM3TP@cluster0.5qbblkc.mongodb.net/TechTalentConnectDB?retryWrites=true&w=majority&appName=Cluster0/TechTalentConnectDB";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
});
db.once('open', () => {
    console.log('Connected successfully to MongoDB');
});

app.use(express.json())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    // console.log("Hi, server is running ");
    if (res.cookie.jwt) {
        const verify = jwt.verify(req.cookies.jwt, "ThisisTechTalentConnectStartUp")
        res.send("email", verify.email)
    } else {
        res.send("Hi, server is running")
    }
})

async function hashpass(password) {
    if (!password) {
        throw new Error('Password is required');
    }
    const res = await bcrypt.hash(password, 10);
    return res;
}

async function compare(userpass, hashpass) {
    const res = await bcrypt.compare(userpass, hashpass)
    return res
}


const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

app.post('/ProfReg', upload.fields([{ name: 'demoImages' }, { name: 'demoVideos' }]), async (req, res) => {
    const { fullName, email, phone, password, skills, price, gender, about, state, district, city } = req.body;

    // Extract file names instead of full paths
    const demoImages = req.files['demoImages'] ? req.files['demoImages'].map(file => path.basename(file.path)) : [];
    const demoVideos = req.files['demoVideos'] ? req.files['demoVideos'].map(file => path.basename(file.path)) : [];

    try {
        const check = await profReg.findOne({ email: email });
        if (check) {
            return res.status(400).send("User details already exist");
        }
        const data = {
            fullName: fullName,
            email: email,
            phone: phone,
            password: await hashpass(password), // Use the hashed password here
            skills: skills,
            price: price,
            gender: gender,
            state: state,
            district: district,
            city: city,
            about: about,
            demoImages: demoImages,
            demoVideos: demoVideos
        };
        console.log(data);
        // Create and save new user
        const user = new profReg(data);
        await user.save();
        return res.status(201).send({ message: "registered successfully" });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Internal server error');
    }
});


app.post('/userReg', async (req, res) => {
    const { name, email, phone_number, InterestedAreas, password } = req.body;
    console.log(name, email, phone_number, InterestedAreas, password);

    try {
        if (!email || !password) {
            return res.status(400).send("Email and Password are required");
        }

        const check = await userReg.findOne({ email: email });
        if (check) {
            return res.status(400).send("User details already exist");
        }
        const token = jwt.sign({ email: email }, "ThisisTechTalentConnectStartUp");
        res.cookie("jwt", token, {
            maxAge: 700000,
            httpOnly: true
        });
        const hashedPassword = await hashpass(password);
        const data = {
            name: name,
            email: email,
            phone_number: phone_number,
            InterestedAreas: InterestedAreas,
            password: hashedPassword,
            token: token
        };
        console.log(data);
        const user = new userReg(data);
        await user.save();
        return res.status(201).send({ message: "User registered successfully", token: token });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).send("An error occurred during registration.");
    }
});


app.post('/ulogin', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const check = await userReg.findOne({ email: email });

        // Check if user exists and password is correct
        if (check && await compare(password, check.password)) {
            // Set the cookie with the token
            res.cookie("jwt", check.token, {
                maxAge: 700000,
                httpOnly: true
            });
            return res.status(201).send({ message: "Successfully logged in" });
        } else {
            return res.status(400).send("Invalid Credentials");
        }
    } catch (err) {
        console.log("Error during login:", err);
        return res.status(500).send("An error occurred during login.");
    }
});

app.post('/Plogin', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const check = await profReg.findOne({ email: email });

        // Check if user exists and password is correct
        if (check && await compare(password, check.password)) {
            // Set the cookie with the token
            res.cookie("jwt", check.token, {
                maxAge: 700000,
                httpOnly: true
            });
            return res.status(201).send({ message: "Successfully logged in" });
        } else {
            return res.status(400).send("Invalid Credentials");
        }
    } catch (err) {
        console.log("Error during login:", err);
        return res.status(500).send("An error occurred during login.");
    }
});

// Set up Nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ssyedmahaboobsubani@gmail.com',  // Your Gmail address
        pass: 'dnlj ffjo cyfc jxyr'     // Use the app password you generated
    }
});

app.post('/book', async (req, res) => {
    const { handType, numberOfHands, address, startTime, endTime, userEmail, profEmail } = req.body;

    if (!handType || !numberOfHands || !address || !startTime || !endTime || !userEmail) {
        return res.status(400).send('All fields are required.');
    }

    // Calculate total price
    const price = handType === 'half' ? 50 : 100;
    const totalPrice = price * numberOfHands;
    const data = {
        handType: handType,
        numberOfHands: numberOfHands,
        address: address,
        startTime: startTime,
        endTime: endTime,
        userEmail: userEmail,
        totalPrice: totalPrice,
        profEmail: profEmail,
        status: "pending"
    }
    // console.log(data);
    const notificationMessage = data;

    // Send confirmation email to user
    const mailOptions = {
        from: 'ssyedmahaboobsubani@gmail.com',
        to: userEmail,
        subject: 'Booking Confirmation',
        text: `Thank you for booking with us! Here are the details of your booking:
      
      Hand Type: ${handType}
      Number of Hands: ${numberOfHands}
      Address: ${address}
      Start Time: ${startTime}
      End Time: ${endTime}
      Total Price: ₹${totalPrice}
    
      We will get in touch with you within 2-3 days to confirm your booking.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email');
        }
        res.status(200).send('Booking confirmed! You will receive a confirmation email shortly.');
    });
    try {
        const professional = await profReg.findOneAndUpdate(
            { email: profEmail },
            { $push: { notifications: notificationMessage } },
            { new: true }
        );
        console.log(professional);

        // Check if professional exists
        if (!professional) {
            return res.status(404).send('Professional not found');
        }
        const user = new book(data);
        await user.save();
        return res.status(201).send({ message: "Succesfully Booked" });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).send("An error occurred during registration.");
    }
});

app.get('/getNotifications/:email', async (req, res) => {
    const { email } = req.params;
    console.log(email);  // Make sure email is coming correctly from the frontend
    try {
        // Find the user by email and retrieve their notifications
        const user = await profReg.findOne({ email: email }, 'notifications');

        if (user && user.notifications) {
            res.json(user.notifications);  // Send back the notifications array
        } else {
            res.status(404).json({ message: 'No notifications found for this user.' });
        }
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).send('Server error');
    }
});

const transporter1 = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ssyedmahaboobsubani@gmail.com',
        pass: 'dnlj ffjo cyfc jxyr',
    },
});

// Accept Booking - send email with payment link
app.post('/acceptBooking', async (req, res) => {
    const { userEmail } = req.body;
    console.log("User email:", userEmail);

    if (!userEmail) {
        return res.status(400).send('User email is required');
    }

    try {
        const booking = await book.findOne({ userEmail: userEmail });
        console.log("Booking found:", booking);

        if (!booking) {
            return res.status(404).send('Booking not found for this email.');
        }

        const { profEmail } = booking;
        console.log("Professional email:", profEmail);

        if (!profEmail) {
            return res.status(400).send('Professional email not found in booking.');
        }

        // Step 3: Update notification status
        const updatedProf = await profReg.findOneAndUpdate(
            { email: profEmail, 'notifications.userEmail': userEmail },
            { $set: { 'notifications.$.status': 'accepted' } },
            { new: true }
        );
        console.log("Updated professional:", updatedProf);

        if (!updatedProf) {
            return res.status(404).send('Professional or notification not found.');
        }

        const paymentUrl = `http://localhost:3000/payment/${booking._id}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Booking Confirmed - Proceed to Payment',
            html: `<h3>Your booking is confirmed!</h3>
                   <p>Please proceed with the payment by clicking the link below:</p>
                   <a href="${paymentUrl}">Pay Now</a><p>Thank you for choosing our service.</p>`,
        };

        // Send confirmation email
        await transporter1.sendMail(mailOptions);
        console.log("Confirmation email sent.");

        res.status(200).send('Booking confirmation email sent and status updated to accepted');
    } catch (error) {
        console.error('Error during acceptance:', error);
        res.status(500).send('Error during acceptance');
    }
});


app.post('/rejectBooking', async (req, res) => {
    const { userEmail } = req.body; // Get userEmail from the request body

    if (!userEmail) {
        return res.status(400).send('User email is required');
    }

    try {
        // Find the booking associated with the user email
        const booking = await book.findOne({ userEmail: userEmail });

        if (!booking) {
            return res.status(404).send('Booking not found for this email.');
        }
        const { profEmail } = booking;
        console.log("Professional email:", profEmail);

        if (!profEmail) {
            return res.status(400).send('Professional email not found in booking.');
        }

        // Step 3: Update notification status
        const updatedProf = await profReg.findOneAndUpdate(
            { email: profEmail, 'notifications.userEmail': userEmail },
            { $set: { 'notifications.$.status': 'rejected' } },
            { new: true }
        );
        console.log("Updated professional:", updatedProf);

        if (!updatedProf) {
            return res.status(404).send('Professional or notification not found.');
        }
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Booking Rejected',
            text: 'Unfortunately, your booking has been rejected. Please contact us for further assistance.',
            html: `<h3>Your booking was rejected</h3><p>We're sorry, but your booking has been rejected. Please <a href="http://localhost:3000/select-professional">click here</a> to choose another professional.</p><p>We apologize for inconvenience caused and appreciate your understanding.</p>`,
        };

        // Send rejection email
        await transporter1.sendMail(mailOptions);

        // Update the booking status to 'rejected'
        const updatedBooking = await book.findOneAndUpdate(
            { userEmail: userEmail },  // Find booking by userEmail
            { status: 'rejected' },    // Update status to 'rejected'
            { new: true }              // Return the updated document
        );

        if (!updatedBooking) {
            return res.status(404).send('Booking status update failed.');
        }

        res.status(200).send('Booking rejection email sent and status updated to rejected');
    } catch (error) {
        console.error('Error during rejection:', error);
        res.status(500).send('Error during rejection');
    }
});

app.get('/service/:name', async (req, res) => {
    try {
        const serviceName = req.params.name;
        console.log(serviceName);
        const services = await profReg.find({ skills: serviceName }); // Query by the 'skills' field to get all matching documents
        console.log(services)
        if (services.length === 0) {
            return res.status(404).send('Services not found');
        }

        res.json(services); // Send back all matching services
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.post('/myworks', async (req, res) => {
    try {
        const { profEmail } = req.body; // Get the profEmail from the query parameters
        const prof = await profReg.findOne({ email: profEmail });
        if (!prof) {
            return res.status(404).json({ message: 'Professional not found' });
        }
        const acceptedWorks = prof.notifications.filter(notification => notification.status === 'accepted');
        console.log(acceptedWorks);
        res.status(200).send(acceptedWorks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

const upload1 = multer({ dest: 'uploads/' });
app.post('/upload', upload1.fields([{ name: 'demoImages' }, { name: 'demoVideos' }]), (req, res) => {
    const files = req.files;
    console.log(files);
    // Save file info to the database and return response
    res.send('Files uploaded');
});

app.get('/api/demovideos', async (req, res) => {
    try {
        const demoVideos = await profReg.find({}, 'demoVideos'); // Fetch only the demoVideos field for all records
        res.status(200).json(demoVideos);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
})