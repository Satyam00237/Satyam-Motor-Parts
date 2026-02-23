const http = require('http');

async function test() {
    // 1. Get all bookings to find a valid ID
    const getOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/bookings',
        method: 'GET',
    };

    http.get(getOptions, (res) => {
        let data = '';
        res.on('data', d => data += d);
        res.on('end', () => {
            try {
                const bookings = JSON.parse(data);
                if (bookings.length === 0) {
                    console.log('No bookings found to test with.');
                    return;
                }
                const testId = bookings[0]._id;
                console.log('Testing with ID:', testId);

                // 2. Try to update status
                const patchData = JSON.stringify({ status: 'confirmed' });
                const patchOptions = {
                    hostname: 'localhost',
                    port: 5000,
                    path: `/api/bookings/${testId}/status`,
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': patchData.length
                    }
                };

                const req = http.request(patchOptions, (res2) => {
                    console.log('PATCH STATUS:', res2.statusCode);
                    let body = '';
                    res2.on('data', d => body += d);
                    res2.on('end', () => console.log('PATCH BODY:', body));
                });
                req.write(patchData);
                req.end();

            } catch (e) {
                console.log('Error parsing bookings:', e.message);
                console.log('Raw data:', data);
            }
        });
    });
}

test();
