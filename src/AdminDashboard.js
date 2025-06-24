import React, { useState, useEffect } from 'react';
// The Supabase client will be loaded dynamically via a script tag.

// --- 1. SUPABASE CONFIGURATION ---
// IMPORTANT: Replace with your actual Supabase URL and Anon Key
// It's best practice to store these in environment variables (.env file)
const supabaseUrl = "https://ycyprrojnpactiebhqkh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljeXBycm9qbnBh…
// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
//////   export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// --- Helper UI Components ---

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${color}`}>
            <i className={`fas ${icon} text-white text-2xl`}></i>
        </div>
        <div>
            <p className="text-slate-500 font-medium">{title}</p>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const AppointmentRow = ({ appointment, onUpdate }) => (
    <tr className="border-b border-slate-200 hover:bg-slate-50">
        <td className="p-4 font-medium text-slate-800">{appointment.name}</td>
        <td className="p-4 text-slate-600">{new Date(appointment.preferred_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
        <td className="p-4 text-slate-600">{appointment.phone}</td>
        <td className="p-4 text-slate-600">{appointment.email}</td>
        <td className="p-4 text-slate-600 max-w-xs truncate">{appointment.message || 'N/A'}</td>
        <td className="p-4">
            {appointment.status === 'pending' ? (
                <div className="flex space-x-2">
                    <button 
                        onClick={() => onUpdate(appointment.id, 'confirmed')}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg font-semibold hover:bg-green-600 transition-colors text-sm"
                    >
                        Approve
                    </button>
                    <button 
                        onClick={() => onUpdate(appointment.id, 'declined')}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm"
                    >
                        Decline
                    </button>
                </div>
            ) : (
                <span className={`px-3 py-1 rounded-full font-semibold text-sm ${
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
            )}
        </td>
    </tr>
);

// --- Main Admin Page Component ---

export default function AdminDashboard() {
    const [supabase, setSupabase] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('pending'); // 'pending', 'confirmed', 'declined'

    // --- 2. DYNAMICALLY LOAD EXTERNAL SCRIPTS ---
    useEffect(() => {
        // Load Font Awesome for icons
        const fontAwesomeScriptId = 'font-awesome-script';
        if (!document.getElementById(fontAwesomeScriptId)) {
            const faScript = document.createElement('script');
            faScript.id = fontAwesomeScriptId;
            faScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js';
            faScript.crossOrigin = 'anonymous';
            document.head.appendChild(faScript);
        }

        // Load Supabase client
        const supabaseScriptId = 'supabase-js-script';
        if (document.getElementById(supabaseScriptId)) {
            if (window.supabase) {
                setSupabase(window.supabase.createClient(supabaseUrl, supabaseKey));
            }
            return;
        }

        const script = document.createElement('script');
        script.id = supabaseScriptId;
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'; 
        script.async = true;

        script.onload = () => {
            if (window.supabase) {
                const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
                setSupabase(supabaseClient);
            } else {
                console.error("Supabase script loaded but `window.supabase` is not available.");
                setError("Failed to initialize Supabase client.");
            }
        };

        script.onerror = () => {
            console.error("Failed to load the Supabase script.");
            setError("Could not load Supabase library. Check network connection.");
        };

        document.head.appendChild(script);

        // Cleanup function
        return () => {
            const supabaseScript = document.getElementById(supabaseScriptId);
            if (supabaseScript) {
                 // In a multi-page app, you might want to reconsider removing scripts.
                 // For this single component, it's fine.
                // document.head.removeChild(supabaseScript);
            }
        };
    }, []);


    // --- 3. FETCH APPOINTMENTS ---
    useEffect(() => {
        if (!supabase) {
            return;
        }

        async function fetchAppointments() {
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('appointments')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setAppointments(data);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching appointments:", err);
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchAppointments();
    }, [supabase]);

    // --- 4. UPDATE APPOINTMENT STATUS ---
    async function handleUpdateStatus(id, newStatus) {
        if (!supabase) {
            console.error("Supabase client not ready.");
            return;
        }
        
        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status: newStatus })
                .eq('id', id);
                
            if (error) throw error;

            setAppointments(currentAppointments =>
                currentAppointments.map(app =>
                    app.id === id ? { ...app, status: newStatus } : app
                )
            );

        } catch (err) {
            console.error("Error updating status:", err);
            setError("Failed to update appointment status.");
        }
    }

    const filteredAppointments = appointments.filter(app => app.status === filter);
    const pendingCount = appointments.filter(app => app.status === 'pending').length;
    const confirmedCount = appointments.filter(app => app.status === 'confirmed').length;

    // --- RENDER LOGIC ---
    if (!supabase && isLoading) {
        return <div className="text-center p-8 text-slate-600">Initializing Admin Dashboard...</div>;
    }
    
    return (
        <div className="bg-slate-100 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-800">Admin Dashboard</h1>
                    <p className="text-slate-500 mt-1">Safa Dental Center Appointment Management</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Pending Appointments" value={pendingCount} icon="fa-clock" color="bg-yellow-500" />
                    <StatCard title="Confirmed Appointments" value={confirmedCount} icon="fa-check-circle" color="bg-green-500" />
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex border-b border-slate-200 mb-4">
                        <button onClick={() => setFilter('pending')} className={`px-4 py-2 font-semibold transition-colors ${filter === 'pending' ? 'border-b-2 border-sky-500 text-sky-600' : 'text-slate-500'}`}>Pending ({pendingCount})</button>
                        <button onClick={() => setFilter('confirmed')} className={`px-4 py-2 font-semibold transition-colors ${filter === 'confirmed' ? 'border-b-2 border-sky-500 text-sky-600' : 'text-slate-500'}`}>Confirmed</button>
                        <button onClick={() => setFilter('declined')} className={`px-4 py-2 font-semibold transition-colors ${filter === 'declined' ? 'border-b-2 border-sky-500 text-sky-600' : 'text-slate-500'}`}>Declined</button>
                    </div>

                    <div className="overflow-x-auto">
                        {isLoading && supabase ? (
                            <div className="text-center p-8">Loading appointments...</div>
                        ) : error ? (
                            <div className="text-center p-8 text-red-500">Error: {error}</div>
                        ) : filteredAppointments.length > 0 ? (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-sm font-semibold text-slate-600">
                                        <th className="p-4">Name</th><th className="p-4">Date</th><th className="p-4">Phone</th><th className="p-4">Email</th><th className="p-4">Message</th><th className="p-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAppointments.map(app => (
                                        <AppointmentRow key={app.id} appointment={app} onUpdate={handleUpdateStatus} />
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                             <div className="text-center p-8 text-slate-500">No {filter} appointments found.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
