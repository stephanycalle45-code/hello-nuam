import React, { useState, useEffect } from 'react';

import { 

  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line 

} from 'recharts';

import { 

  LayoutDashboard, FileText, Users, Shield, LogOut, Upload, Search, 

  Bell, Settings, ChevronRight, CheckCircle, AlertTriangle, FileCheck, 

  Database, Lock, Eye, Download, Filter, Plus, UserPlus, Mail, ArrowLeft, Send, Trash2, Edit, WifiOff

} from 'lucide-react';

import { initializeApp } from "firebase/app";

import { getAuth, signInAnonymously } from "firebase/auth";

import { 

  getFirestore, collection, addDoc, onSnapshot, 

  updateDoc, doc, deleteDoc 

} from "firebase/firestore";



// --- TUS CLAVES DE FIREBASE (YA CONFIGURADAS) ---

const firebaseConfig = {

  apiKey: "AIzaSyCq2h8t4zzaZzElweLOZCvNCCizuzxDG6c",

  authDomain: "proyectonuam.firebaseapp.com",

  projectId: "proyectonuam",

  storageBucket: "proyectonuam.firebasestorage.app",

  messagingSenderId: "540568997468",

  appId: "1:540568997468:web:0e9299d14e268ff33da099"

};



// Inicialización segura de Firebase

let app, auth, db;

try {

  app = initializeApp(firebaseConfig);

  auth = getAuth(app);

  db = getFirestore(app);

} catch (e) {

  console.warn("Error iniciando Firebase. Revisa tu conexión.");

}



const COLLECTIONS = {

  USERS: 'nuam_users',

  QUALIFICATIONS: 'nuam_qualifications',

  LOGS: 'nuam_audit_logs'

};



const initialSeedUsers = [

  { nombre: "Admin Nuam", email: "admin@nuam.com", password: "admin", rol: "Administrador", estado: "Activo" },

  { nombre: "Safka Canales", email: "safka@nuam.com", password: "123", rol: "Analista", estado: "Activo" },

];



const initialSeedQuals = [

  { id: 'local-1', emisor: "Banco Santander", rut: "97.036.000-K", fecha: "2025-10-20", estado: "Aprobado", resultado: "Factor 1.0", analista: "Safka C." },

  { id: 'local-2', emisor: "Falabella SA", rut: "77.261.280-K", fecha: "2025-10-21", estado: "En Revisión", resultado: "Pendiente", analista: "Stephany C." },

];



// --- COMPONENTE: MENSAJE DE ERROR DE PERMISOS ---

const PermissionErrorBanner = () => (

  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 m-6 rounded shadow-lg animate-fade-in">

    <div className="flex items-start">

      <div className="flex-shrink-0">

        <WifiOff className="h-6 w-6 text-orange-500" />

      </div>

      <div className="ml-3">

        <h3 className="text-lg font-medium text-orange-800">Modo Local Activado</h3>

        <div className="mt-2 text-sm text-orange-700">

          <p>Si ves esto, Firebase está bloqueando la conexión. La app funcionará, pero los datos no se guardarán en la nube.</p>

        </div>

      </div>

    </div>

  </div>

);



// --- COMPONENTE: LOGIN (DISEÑO MEJORADO) ---

const Login = ({ onLogin, usersDb }) => {

  const [authView, setAuthView] = useState('login'); 

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [name, setName] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');

  const [successMsg, setSuccessMsg] = useState('');

  const [loading, setLoading] = useState(false);



  useEffect(() => { setError(''); setSuccessMsg(''); setEmail(''); setPassword(''); setName(''); setConfirmPassword(''); }, [authView]);



  const handleSubmitLogin = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError('');



    setTimeout(() => {

      const userFound = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());

      

      if (userFound && userFound.password === password) {

          onLogin({ ...userFound });

      } else if (email.includes('@nuam.com') && password.length > 0) {

          onLogin({ nombre: email.split('@')[0], email: email, rol: 'Analista', estado: 'Activo' });

      } else {

          setError('Credenciales incorrectas o usuario no registrado.');

      }

      setLoading(false);

    }, 1000);

  };



  const handleSubmitRegister = async (e) => {

    e.preventDefault();

    setLoading(true);

    

    if (!email.includes('@nuam.com')) { setError('Solo correos @nuam.com'); setLoading(false); return; }

    if (password !== confirmPassword) { setError('Las contraseñas no coinciden.'); setLoading(false); return; }



    try {

      if (db) await addDoc(collection(db, COLLECTIONS.USERS), { nombre: name, email, password, rol: 'Analista', estado: 'Activo' });

      setSuccessMsg('¡Cuenta creada! Inicia sesión.');

    } catch (err) { 

      setError('Error al registrar. Intente de nuevo.');

    }

    

    setTimeout(() => setAuthView('login'), 2000);

    setLoading(false);

  };



  return (

    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#FF5722] to-[#FF8A65] relative overflow-hidden">

      

      {/* Elementos Decorativos de Fondo */}

      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">

          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">

            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />

          </svg>

      </div>



      {/* Tarjeta de Login Flotante */}

      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md z-10 relative transform transition-all duration-300 hover:scale-[1.01]">

        <div className="text-center mb-8">

          <h1 className="text-5xl font-extrabold text-[#FF5722] tracking-tighter mb-2 drop-shadow-sm">nuam</h1>

          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Exchange | Santiago · Lima · Colombia</p>

          <div className="h-1 w-16 bg-[#FF5722] mx-auto mt-4 rounded-full opacity-20"></div>

        </div>



        {authView === 'login' ? (

          <form onSubmit={handleSubmitLogin} className="space-y-6">

            <div>

              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Correo Electrónico</label>

              <div className="relative">

                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} 

                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-[#FF5722] focus:border-transparent outline-none transition-all shadow-sm" 

                        placeholder="usuario@nuam.com" required />

                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />

              </div>

            </div>

            <div>

              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Contraseña</label>

              <div className="relative">

                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} 

                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-[#FF5722] focus:border-transparent outline-none transition-all shadow-sm" 

                        placeholder="••••••••" required />

                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />

              </div>

            </div>

            

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center border border-red-100 animate-pulse"><AlertTriangle className="w-4 h-4 mr-2" />{error}</div>}

            {successMsg && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-center border border-green-100"><CheckCircle className="w-4 h-4 mr-2" />{successMsg}</div>}

            

            <button type="submit" disabled={loading} 

                    className="w-full bg-[#FF5722] hover:bg-[#F4511E] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70">

              {loading ? "Verificando..." : "Ingresar a la Plataforma"}

            </button>

            

            <div className="text-center mt-6 pt-4 border-t border-gray-100">

              <button type="button" onClick={() => setAuthView('register')} className="text-[#FF5722] font-semibold text-sm hover:underline flex items-center justify-center mx-auto transition-colors">

                  <UserPlus className="w-4 h-4 mr-1" /> ¿No tienes cuenta? Regístrate

              </button>

            </div>

          </form>

        ) : (

          <form onSubmit={handleSubmitRegister} className="space-y-5">

            <div className="grid grid-cols-2 gap-4">

               <div>

                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>

                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#FF5722] outline-none text-sm" required />

               </div>

               <div>

                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Correo</label>

                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#FF5722] outline-none text-sm" required />

               </div>

            </div>

            <div className="grid grid-cols-2 gap-4">

               <div>

                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Clave</label>

                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border rounded-lg outline-none text-sm" required />

               </div>

               <div>

                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirmar</label>

                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border rounded-lg outline-none text-sm" required />

               </div>

            </div>

            {error && <div className="bg-red-50 text-red-600 p-2 rounded-lg text-sm border border-red-100">{error}</div>}

            

            <div className="flex space-x-3 mt-2">

                <button type="button" onClick={() => setAuthView('login')} className="w-1/3 bg-gray-100 text-gray-500 font-medium py-3 rounded-xl hover:bg-gray-200 transition">Cancelar</button>

                <button type="submit" disabled={loading} className="w-2/3 bg-[#FF5722] hover:bg-[#F4511E] text-white font-bold py-3 rounded-xl shadow-md transition">{loading ? "..." : "Crear Cuenta"}</button>

            </div>

          </form>

        )}

      </div>

      

      <div className="absolute bottom-4 text-center w-full text-white/60 text-xs font-medium">

        © 2025 NUAM Exchange. Sistema de Gestión de Calificaciones.

      </div>

    </div>

  );

};



// --- COMPONENTE: DASHBOARD ---

const Dashboard = ({ data }) => {

  const [stats, setStats] = useState({ approved: 0, review: 0, rejected: 0, total: 0 });



  useEffect(() => {

    const s = { approved: 0, review: 0, rejected: 0, total: data.length };

    data.forEach(d => {

      if(d.estado === 'Aprobado') s.approved++;

      else if(d.estado === 'Rechazado') s.rejected++;

      else s.review++;

    });

    setStats(s);

  }, [data]);



  const kpiData = [ { name: 'Aprobados', value: stats.approved }, { name: 'En Revisión', value: stats.review }, { name: 'Rechazados', value: stats.rejected } ];

  const COLORS = ['#4CAF50', '#FFC107', '#F44336'];



  return (

    <div className="space-y-8 animate-fade-in">

      <div className="flex flex-col">

          <h2 className="text-3xl font-bold text-gray-800">Panel de Control</h2>

          <p className="text-gray-500 text-sm">Monitoreo en tiempo real de calificaciones</p>

      </div>



      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <KPICard title="Total Registros" value={stats.total} icon={FileText} color="bg-orange-50 text-[#FF5722]" />

        <KPICard title="Aprobados" value={stats.approved} icon={CheckCircle} color="bg-green-50 text-green-600" />

        <KPICard title="Pendientes" value={stats.review} icon={AlertTriangle} color="bg-yellow-50 text-yellow-600" />

        <KPICard title="Rechazados" value={stats.rejected} icon={LogOut} color="bg-red-50 text-red-600" />

      </div>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-96">

          <h3 className="font-bold text-gray-700 mb-6">Distribución de Estados</h3>

          <ResponsiveContainer width="100%" height="85%">

            <PieChart>

              <Pie data={kpiData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">

                {kpiData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}

              </Pie>

              <Tooltip />

              <Legend verticalAlign="bottom" height={36}/>

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );

};



const KPICard = ({ title, value, icon: Icon, color }) => (

  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">

    <div className="flex justify-between items-start">

      <div>

          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{title}</p>

          <h3 className="text-4xl font-extrabold text-gray-800">{value}</h3>

      </div>

      <div className={`p-3 rounded-xl ${color} shadow-sm`}>

          <Icon className="w-6 h-6" />

      </div>

    </div>

  </div>

);



// --- COMPONENTE: GESTIÓN DE CALIFICACIONES ---

const Qualifications = ({ data, setData, user, isLocalMode }) => {

  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({ emisor: '', rut: '' });



  const handleAdd = async () => {

    if(!form.emisor || !form.rut) return;

    const newItem = {

      ...form,

      fecha: new Date().toISOString().split('T')[0],

      estado: 'En Revisión',

      resultado: 'Pendiente',

      analista: user.nombre

    };



    try {

      if (!isLocalMode && db) {

        await addDoc(collection(db, COLLECTIONS.QUALIFICATIONS), newItem);

        await addDoc(collection(db, COLLECTIONS.LOGS), { usuario: user.nombre, accion: `Creó calificación ${form.emisor}`, fecha: new Date().toISOString() });

      } else {

        setData(prev => [...prev, { ...newItem, id: Date.now() }]); 

      }

      setShowModal(false); setForm({ emisor: '', rut: '' });

    } catch (e) {

      setData(prev => [...prev, { ...newItem, id: Date.now() }]); 

      setShowModal(false);

    }

  };



  const handleUpdateStatus = async (id, currentStatus) => {

    const newStatus = currentStatus === 'En Revisión' ? 'Aprobado' : 'Rechazado'; 

    try {

        if (!isLocalMode && db) {

          await updateDoc(doc(db, COLLECTIONS.QUALIFICATIONS, id), { estado: newStatus });

        } else {

          setData(prev => prev.map(item => item.id === id ? { ...item, estado: newStatus } : item));

        }

    } catch (e) { console.error(e); }

  };



  const handleDelete = async (id) => {

    if(!window.confirm("¿Eliminar?")) return;

    try {

      if (!isLocalMode && db) await deleteDoc(doc(db, COLLECTIONS.QUALIFICATIONS, id));

      else setData(prev => prev.filter(item => item.id !== id));

    } catch (e) { console.error(e); }

  };



  const filteredData = data.filter(item => item.emisor?.toLowerCase().includes(searchTerm.toLowerCase()) || item.rut?.includes(searchTerm));



  return (

    <div className="space-y-6 animate-fade-in">

      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100 gap-4">

        <div>

            <h2 className="text-2xl font-bold text-gray-800">Calificaciones</h2>

            <p className="text-sm text-gray-500">Gestión de registros tributarios</p>

        </div>

        

        <div className="flex space-x-3 w-full md:w-auto">

          <div className="relative flex-1 md:flex-none">

            <input type="text" placeholder="Buscar emisor o RUT..." 

                    className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent transition" 

                    onChange={e => setSearchTerm(e.target.value)} />

            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />

          </div>

          <button onClick={() => setShowModal(true)} className="bg-[#FF5722] text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center hover:bg-[#F4511E] shadow-lg shadow-orange-500/20 transition transform hover:-translate-y-0.5">

            <Plus className="w-4 h-4 mr-2" /> Nueva

          </button>

        </div>

      </div>



      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">

            <tr><th className="p-5">Emisor</th><th className="p-5">RUT</th><th className="p-5">Fecha</th><th className="p-5">Estado</th><th className="p-5">Analista</th><th className="p-5 text-right">Acciones</th></tr>

          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">

            {filteredData.map(item => (

              <tr key={item.id} className="hover:bg-orange-50/30 transition-colors duration-150 group">

                <td className="p-5 font-bold text-gray-800">{item.emisor}</td>

                <td className="p-5 text-gray-500 font-mono">{item.rut}</td>

                <td className="p-5 text-gray-500">{item.fecha}</td>

                <td className="p-5">

                    <span onClick={() => handleUpdateStatus(item.id, item.estado)} 

                          className={`cursor-pointer px-3 py-1 rounded-full text-xs font-bold border transition-transform hover:scale-105 inline-block ${

                          item.estado === 'Aprobado' ? 'bg-green-50 text-green-700 border-green-200' : 

                          item.estado === 'Rechazado' ? 'bg-red-50 text-red-700 border-red-200' : 

                          'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>

                      {item.estado}

                    </span>

                </td>

                <td className="p-5 text-gray-600 flex items-center">

                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 mr-3 group-hover:bg-orange-100 group-hover:text-[#FF5722] transition">

                        {item.analista?.charAt(0)}

                    </div>

                    {item.analista}

                </td>

                <td className="p-5 text-right">

                    <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition">

                        <Trash2 className="w-4 h-4" />

                    </button>

                </td>

              </tr>

            ))}

            {filteredData.length === 0 && <tr><td colSpan="6" className="p-10 text-center text-gray-400">No hay datos disponibles.</td></tr>}

          </tbody>

        </table>

      </div>



      {showModal && (

        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl animate-scale-in">

            <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Nueva Calificación</h3>

            <div className="space-y-5">

                <div>

                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Razón Social</label>

                    <input className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent transition" placeholder="Ej: Codelco" value={form.emisor} onChange={e => setForm({...form, emisor: e.target.value})} />

                </div>

                <div>

                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">RUT Empresa</label>

                    <input className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent transition" placeholder="Ej: 99.888.777-6" value={form.rut} onChange={e => setForm({...form, rut: e.target.value})} />

                </div>

            </div>

            <div className="flex justify-end space-x-3 mt-8">

              <button onClick={() => setShowModal(false)} className="text-gray-500 px-6 py-3 font-bold hover:bg-gray-100 rounded-xl transition">Cancelar</button>

              <button onClick={handleAdd} className="bg-[#FF5722] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:bg-[#F4511E] hover:-translate-y-0.5 transition transform">Guardar</button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};



// --- NUEVO COMPONENTE: CARGA DE DOCUMENTOS ---

const UploadDocuments = () => {

  return (

    <div className="space-y-6 animate-fade-in">

      <div className="flex flex-col">

        <h2 className="text-3xl font-bold text-gray-800">Carga de Documentos DJ1948</h2>

        <p className="text-gray-500 text-sm">Sube y procesa los archivos PDF para calificar nuevos emisores.</p>

      </div>



      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">

        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#FF5722] transition-colors cursor-pointer relative h-64">

            <Upload className="w-12 h-12 text-gray-400 mb-4" />

            <p className="text-gray-600 font-bold mb-1">Arrastra tu archivo PDF aquí</p>

            <p className="text-sm text-gray-500">o haz clic para seleccionar (Máx. 5MB)</p>

            <input type="file" accept=".pdf" className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" />

        </div>

        <button className="mt-6 w-full bg-[#FF5722] hover:bg-[#F4511E] text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/30 transition-all disabled:opacity-50">

            Procesar Documentos

        </button>

      </div>

    </div>

  );

};



// --- APP PRINCIPAL ---

export default function App() {

  const [user, setUser] = useState(null);

  const [activeTab, setActiveTab] = useState('dashboard');

  const [qualifications, setQualifications] = useState([]);

  const [usersDb, setUsersDb] = useState(initialSeedUsers); 

  const [loadingApp, setLoadingApp] = useState(true);

  const [permissionError, setPermissionError] = useState(false);



  useEffect(() => {

    const init = async () => {

      try {

        if (auth) await signInAnonymously(auth);

        

        const loadCollection = (collName, setFn, seedData) => {

          if (!db) { 

            setFn(seedData); 

            setPermissionError(true); 

            return; 

          }



          onSnapshot(collection(db, collName), 

            (snap) => {

              const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));

              setFn(data.length > 0 ? data : seedData);

              if (data.length > 0) setPermissionError(false);

            },

            (error) => {

              console.warn(`Error en ${collName}:`, error.message);

              setPermissionError(true);

              setFn(seedData); 

            }

          );

        };



        loadCollection(COLLECTIONS.QUALIFICATIONS, setQualifications, initialSeedQuals);

        loadCollection(COLLECTIONS.USERS, setUsersDb, initialSeedUsers);

        setLoadingApp(false);

      } catch (e) {

        setPermissionError(true);

        setQualifications(initialSeedQuals);

        setUsersDb(initialSeedUsers);

        setLoadingApp(false);

      }

    };

    init();

  }, []);



  const handleLogin = (u) => setUser(u);

  const handleLogout = () => setUser(null);



  if (loadingApp) return (

      <div className="h-screen flex flex-col items-center justify-center bg-white text-[#FF5722]">

          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5722] mb-4"></div>

          <h2 className="text-xl font-bold animate-pulse">Cargando Sistema NUAM...</h2>

      </div>

  );



  return (

    <div className="flex h-screen bg-gray-50 font-sans text-gray-800">

      {user && (

        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col z-20 shadow-xl">

          <div className="p-8 flex flex-col items-center border-b border-gray-100">

            <h1 className="text-4xl font-black text-[#FF5722] tracking-tighter">nuam</h1>

            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Exchange</span>

          </div>

          <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">

            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />

            <SidebarItem icon={FileText} label="Calificaciones" active={activeTab === 'qualifications'} onClick={() => setActiveTab('qualifications')} />

            {/* NUEVA PESTAÑA AGREGADA AQUÍ */}

            <SidebarItem icon={Upload} label="Carga de Documentos" active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} />

            {/* FIN NUEVA PESTAÑA */}

            {user.rol === 'Administrador' && <SidebarItem icon={Users} label="Usuarios" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />}

            {user.rol === 'Administrador' && <SidebarItem icon={Shield} label="Auditoría" active={activeTab === 'audit'} onClick={() => setActiveTab('audit')} />}

          </nav>

          <div className="p-6 border-t border-gray-100 bg-gray-50/50">

            <div className="flex items-center mb-4">

                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF5722] to-[#ff8a65] text-white flex items-center justify-center font-bold text-lg shadow-md border-2 border-white">

                    {user.nombre.charAt(0)}

                </div>

                <div className="ml-3 overflow-hidden">

                    <p className="text-sm font-bold text-gray-800 truncate">{user.nombre}</p>

                    <p className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full inline-block mt-1">{user.rol}</p>

                </div>

            </div>

            <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 bg-white rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm text-sm font-bold text-gray-600 group">

                <LogOut className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> Cerrar Sesión

            </button>

          </div>

        </aside>

      )}



      <main className="flex-1 overflow-y-auto bg-[#F8F9FA] relative">

        {permissionError && <PermissionErrorBanner />}

        {!user ? (

          <Login onLogin={handleLogin} usersDb={usersDb} />

        ) : (

          <div className="p-8 md:p-12 max-w-7xl mx-auto">

            {activeTab === 'dashboard' && <Dashboard data={qualifications} />}

            {activeTab === 'qualifications' && <Qualifications data={qualifications} setData={setQualifications} user={user} isLocalMode={permissionError} />}

            {/* RENDERIZADO DEL NUEVO COMPONENTE */}

            {activeTab === 'upload' && <UploadDocuments />}

            {/* FIN RENDERIZADO */}

          </div>

        )}

      </main>

    </div>

  );

}



const SidebarItem = ({ icon: Icon, label, active, onClick }) => (

  <button onClick={onClick} className={`w-full flex items-center px-5 py-4 text-sm font-bold rounded-xl mb-1 transition-all duration-200 group ${active ? 'bg-[#FF5722] text-white shadow-lg shadow-orange-500/30 translate-x-1' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}>

    <Icon className={`w-5 h-5 mr-3 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />

    {label}

  </button>

);