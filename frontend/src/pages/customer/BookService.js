import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../../components/CustomerLayout';
import api from '../../services/api';
import './Customer.css';

const serviceTypes = [
    'General Service', 'Oil Change', 'Brake Inspection', 'Tyre Replacement',
    'Battery Replacement', 'AC Service', 'Engine Tune-up', 'Body Work',
    'Electrical Repair', 'Wheel Alignment', 'Other',
];

const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
    '07:00 PM'
];

const BookService = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        vehicleType: 'Car', vehicleNumber: '', serviceType: '',
        serviceDate: '', timeSlot: '', notes: '',
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [bookedSlots, setBookedSlots] = useState([]);
    const [fetchingSlots, setFetchingSlots] = useState(false);

    const fetchBookedSlots = async (date) => {
        if (!date) return;
        setFetchingSlots(true);
        try {
            const res = await api.get(`/bookings/booked-slots?date=${date}`);
            setBookedSlots(res.data);
        } catch (err) {
            console.error('Failed to fetch booked slots', err);
        } finally {
            setFetchingSlots(false);
        }
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (name === 'serviceDate') {
            fetchBookedSlots(value);
            setForm(prev => ({ ...prev, timeSlot: '' })); // Reset slot when date changes
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await api.post('/bookings', form);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Min date = today
    const today = new Date().toISOString().split('T')[0];

    return (
        <CustomerLayout>
            <div className="cb-wrap">
                <div className="cb-card">
                    {success ? (
                        <div className="cb-success">
                            <div className="cb-success-icon">🎉</div>
                            <h3>Booking Confirmed!</h3>
                            <p>Your service has been booked successfully. We'll contact you shortly to confirm your appointment.</p>
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button className="cb-success-btn" onClick={() => setSuccess(false)}>
                                    + Book Another
                                </button>
                                <button
                                    className="cb-success-btn"
                                    style={{ background: '#1a1a2e' }}
                                    onClick={() => navigate('/customer/history')}
                                >
                                    View Bookings →
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="cb-header">
                                <div className="cb-title">🔧 Book a Service</div>
                                <div className="cb-sub">Schedule your vehicle service appointment</div>
                            </div>

                            {error && <div className="cb-alert error">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="cb-grid">
                                    <div className="cb-field">
                                        <label className="cb-label">Vehicle Type</label>
                                        <input
                                            className="cb-input disabled"
                                            name="vehicleType"
                                            value="Car"
                                            readOnly
                                            disabled
                                        />
                                    </div>


                                    <div className="cb-field">
                                        <label className="cb-label">Vehicle Number *</label>
                                        <input
                                            className="cb-input"
                                            name="vehicleNumber"
                                            placeholder="e.g. WB 01 AB 1234"
                                            value={form.vehicleNumber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="cb-field full">
                                        <label className="cb-label">Service Type *</label>
                                        <select
                                            className="cb-select"
                                            name="serviceType"
                                            value={form.serviceType}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select service</option>
                                            {serviceTypes.map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>

                                    <div className="cb-field">
                                        <label className="cb-label">Preferred Date *</label>
                                        <input
                                            className="cb-input"
                                            type="date"
                                            name="serviceDate"
                                            min={today}
                                            value={form.serviceDate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="cb-field full">
                                        <label className="cb-label">Select Time Slot * {fetchingSlots && ' (Checking...)'}</label>
                                        <div className="slot-grid">
                                            {timeSlots.map(t => {
                                                const isBooked = bookedSlots.includes(t);
                                                return (
                                                    <button
                                                        key={t}
                                                        type="button"
                                                        className={`slot-btn ${form.timeSlot === t ? 'active' : ''} ${isBooked ? 'booked' : 'available'}`}
                                                        onClick={() => !isBooked && setForm({ ...form, timeSlot: t })}
                                                        disabled={isBooked || fetchingSlots}
                                                        title={isBooked ? "Already booked" : !form.serviceDate ? "Select a date first" : ""}
                                                    >
                                                        {t}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {!form.serviceDate && <p className="slot-hint" style={{ color: '#f59e0b' }}>⚠️ Please select a date first to see available slots.</p>}
                                        {form.serviceDate && bookedSlots.length > 0 && <p className="slot-hint">ℹ️ Slots in red are already booked.</p>}
                                        {form.serviceDate && bookedSlots.length === 0 && !fetchingSlots && <p className="slot-hint" style={{ color: '#10b981' }}>✅ All slots are available for this date.</p>}
                                    </div>

                                    <div className="cb-field full">
                                        <label className="cb-label">Additional Notes (optional)</label>
                                        <textarea
                                            className="cb-textarea"
                                            name="notes"
                                            placeholder="Describe the issue or any special requests..."
                                            value={form.notes}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <button
                                    className="cb-submit"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? '⏳ Booking...' : '✅ Confirm Booking'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
};

export default BookService;
