const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testOrder() {
    try {
        console.log('1. Registering a new user...');
        const registerRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Customer',
            email: `test${Date.now()}@example.com`,
            password: 'Password123',
            phone: '1234567890'
        });

        const token = registerRes.data.token;
        console.log('✅ Registered! Token obtained.');

        console.log('2. Placing an order...');
        const orderData = {
            items: [
                {
                    product: '65d1234567890abcdef12345', // Dummy ID, will likely fail in controller but we want to see if it passes middleware
                    quantity: 1,
                    price: 100
                }
            ],
            shippingAddress: {
                fullName: 'Test Customer',
                phone: '1234567890',
                street: 'Test Street',
                city: 'Test City',
                state: 'Rajasthan',
                zip: '302001'
            },
            paymentMethod: 'COD',
            totalAmount: 100
        };

        const orderRes = await axios.post(`${API_URL}/orders`, orderData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('✅ Order placed!', orderRes.data);
    } catch (error) {
        console.error('❌ Error:', error.response?.status, error.response?.data?.message || error.message);
    }
}

testOrder();
