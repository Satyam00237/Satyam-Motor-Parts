const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for seeding...');
};

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing owners and admins
        await User.deleteMany({ role: { $in: ['owner', 'admin'] } });
        await Product.deleteMany({});

        console.log('🗑️  Cleared previous seed data...');

        // Create Owner
        const owner = new User({
            name: 'Satyam - Owner',
            email: 'owner@satyam.com',
            password: 'Owner@123',
            role: 'owner',
            phone: '9876543210',
        });
        await owner.save();
        console.log('✅ Owner created');

        // Create Admin
        const admin = new User({
            name: 'Super Admin',
            email: 'admin@satyam.com',
            password: 'Admin@123',
            role: 'admin',
            phone: '9000000000',
        });
        await admin.save();
        console.log('✅ Admin created');

        // Seed Products
        const products = [
            { name: 'Bosch Spark Plug Set', description: 'High performance spark plugs compatible with most motorcycles', category: 'Engine Parts', price: 450, stock: 25, addedBy: owner._id },
            { name: 'Brembo Brake Pads', description: 'Premium sintered brake pads for superior stopping power', category: 'Brakes', price: 1200, stock: 15, addedBy: owner._id },
            { name: 'MRF REVZ Tyre 100/80-17', description: 'High grip tubeless tyre for sport bikes', category: 'Tyres', price: 3200, stock: 10, addedBy: owner._id },
            { name: 'Motul 7100 Engine Oil 1L', description: 'Full synthetic 4T engine oil for high performance bikes', category: 'Oils & Lubricants', price: 850, stock: 40, addedBy: owner._id },
            { name: 'Bajaj Pulsar Headlight Assembly', description: 'OEM replacement LED headlight for Bajaj Pulsar 150/180', category: 'Electrical', price: 1800, stock: 8, addedBy: owner._id },
            { name: 'Honda CB Hornet Air Filter', description: 'Genuine air filter for Honda CB Hornet 160R', category: 'Engine Parts', price: 320, stock: 20, addedBy: owner._id },
            { name: 'Universal Side Mirror Set', description: 'Stylish adjustable side mirrors, chrome finish, universal fit', category: 'Accessories', price: 380, stock: 30, addedBy: owner._id },
            { name: 'Exide 12V Battery 7Ah', description: 'Maintenance-free sealed lead-acid battery for bikes', category: 'Electrical', price: 2200, stock: 12, addedBy: owner._id },
            { name: 'TVS Apache Chain Sprocket Kit', description: 'OEM quality chain and sprocket set for TVS Apache RTR 160/180/200', category: 'Engine Parts', price: 980, stock: 18, addedBy: owner._id },
            { name: 'Hero Splendor Seat Cover', description: 'Waterproof seat cover with non-slip texture for Hero Splendor Plus', category: 'Accessories', price: 250, stock: 35, addedBy: owner._id },
        ];

        for (const p of products) {
            await Product.create(p);
        }
        console.log('✅ 10 Products seeded');

        console.log('\n📋 Login Credentials:');
        console.log('   Owner  → owner@satyam.com  / Owner@123');
        console.log('   Admin  → admin@satyam.com  / Admin@123');
        console.log('\n👤 Customers can self-register at /register');

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err);
        process.exit(1);
    }
};

seedData();
