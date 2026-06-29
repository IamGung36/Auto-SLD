import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, Minus, Edit3, Settings2, Zap, Trash2, Layout, MousePointer2, Info, Cpu, Database, ChevronRight, ChevronLeft, X, Calculator, Server, FileText, Edit, Image as ImageIcon, Upload, Download, Share2, AlertTriangle, Menu, Save, FolderOpen, Camera, FileSpreadsheet, Wand2, ArrowUp, ArrowDown, ZoomIn, ZoomOut, Move, Columns, ClipboardList, Check, Globe, Cloud, DownloadCloud, UploadCloud, RefreshCw, Copy, History, Layers, ExternalLink, Lock, ShieldAlert, Users } from 'lucide-react';

const breakerOptions = [16, 20, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 320, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6300];
const sizeOptions = ['2.5', '4', '6', '10', '16', '25', '35', '50', '70', '95', '120', '150', '185', '240', '300', '400', '500'];
const installOptions = ['A: Ladder Closed', 'B: Ladder Open', 'C: Tray Closed', 'D: Tray Open', 'E: Conduits UG', 'F: Free Air', 'G: Conduit on Wall'];

const cableTypeOptions = [
  'CV(XLPE)-0.6/1kV',
  'CV(XLPE)-FD(FRC)-0.6/1kV',
  'CV(XLPE)-6/10(12kV)',
  'CV(XLPE)-12/20(24kV)',
  'CV(XLPE)-18/30(36kV)'
];

// --- Initial Cable OD Data (Approximate in mm for CV XLPE 0.6/1kV) ---
const initialCableODData = {
  '2.5': { '1C': 6.0, '2C': 12.0, '3C': 12.5, '4C': 13.5 },
  '4': { '1C': 6.5, '2C': 13.0, '3C': 14.0, '4C': 15.0 },
  '6': { '1C': 7.0, '2C': 14.5, '3C': 15.5, '4C': 16.5 },
  '10': { '1C': 8.0, '2C': 16.5, '3C': 17.5, '4C': 19.0 },
  '16': { '1C': 9.0, '2C': 18.5, '3C': 19.5, '4C': 21.5 },
  '25': { '1C': 11.0, '2C': 22.0, '3C': 23.5, '4C': 26.0 },
  '35': { '1C': 12.0, '2C': 24.5, '3C': 26.0, '4C': 29.0 },
  '50': { '1C': 13.5, '2C': 28.0, '3C': 29.5, '4C': 33.0 },
  '70': { '1C': 15.5, '2C': 32.0, '3C': 34.0, '4C': 38.0 },
  '95': { '1C': 17.5, '2C': 36.0, '3C': 38.0, '4C': 43.0 },
  '120': { '1C': 19.5, '2C': 40.0, '3C': 42.0, '4C': 47.0 },
  '150': { '1C': 21.5, '2C': 44.0, '3C': 47.0, '4C': 52.0 },
  '185': { '1C': 24.0, '2C': 49.0, '3C': 52.0, '4C': 58.0 },
  '240': { '1C': 27.0, '2C': 55.0, '3C': 58.0, '4C': 65.0 },
  '300': { '1C': 30.0, '2C': 60.0, '3C': 64.0, '4C': 71.0 },
  '400': { '1C': 34.0, '2C': 68.0, '3C': 72.0, '4C': 80.0 },
  '500': { '1C': 38.0, '2C': 76.0, '3C': 81.0, '4C': 90.0 }
};

// --- Standard Raceway Data ---
const initialConduitSizes = [
  { size: '1/2"', id: 16.0, area40: 78 }, { size: '3/4"', id: 21.0, area40: 136 }, { size: '1"', id: 27.0, area40: 220 },
  { size: '1 1/4"', id: 35.0, area40: 380 }, { size: '1 1/2"', id: 41.0, area40: 515 }, { size: '2"', id: 53.0, area40: 850 },
  { size: '2 1/2"', id: 63.0, area40: 1210 }, { size: '3"', id: 78.0, area40: 1865 }, { size: '3 1/2"', id: 90.0, area40: 2500 },
  { size: '4"', id: 102.0, area40: 3200 }, { size: '5"', id: 128.0, area40: 5000 }, { size: '6"', id: 154.0, area40: 7300 }
];

const initialTraySizes = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

// --- Initial Database Data ---
const baseCableSizesData = [
  { size: '2.5', r: '9.45', x: '0.114' }, { size: '4', r: '5.88', x: '0.113' }, { size: '6', r: '3.93', x: '0.107' },
  { size: '10', r: '2.33', x: '0.100' }, { size: '16', r: '1.47', x: '0.095' }, { size: '25', r: '0.927', x: '0.093' },
  { size: '35', r: '0.668', x: '0.090' }, { size: '50', r: '0.494', x: '0.089' }, { size: '70', r: '0.342', x: '0.087' },
  { size: '95', r: '0.247', x: '0.086' }, { size: '120', r: '0.196', x: '0.084' }, { size: '150', r: '0.159', x: '0.084' },
  { size: '185', r: '0.128', x: '0.083' }, { size: '240', r: '0.098', x: '0.082' }, { size: '300', r: '0.080', x: '0.081' },
  { size: '400', r: '0.064', x: '0.080' }, { size: '500', r: '0.050', x: '0.080' }
];

const initialCableDatabase = {
  'CV(XLPE)-0.6/1kV': JSON.parse(JSON.stringify(baseCableSizesData)),
  'CV(XLPE)-FD(FRC)-0.6/1kV': JSON.parse(JSON.stringify(baseCableSizesData)),
  'CV(XLPE)-6/10(12kV)': [],
  'CV(XLPE)-12/20(24kV)': [],
  'CV(XLPE)-18/30(36kV)': [],
};

const baseAmpacityData = {
  'A: Ladder Closed': {
    '1C': { '2.5':0, '4':0, '6':0, '10':0, '16':0, '25':106, '35':131, '50':159, '70':202, '95':245, '120':284, '150':311, '185':349, '240':410, '300':468, '400':531, '500':606 },
    '2C': { '2.5':24, '4':32, '6':40, '10':55, '16':73, '25':96, '35':116, '50':140, '70':177, '95':212, '120':244, '150':273, '185':309, '240':362, '300':414, '400':0, '500':0 },
    '3C': { '2.5':24, '4':32, '6':40, '10':55, '16':73, '25':96, '35':116, '50':140, '70':177, '95':212, '120':244, '150':273, '185':309, '240':362, '300':414, '400':0, '500':0 },
    '4C': { '2.5':24, '4':32, '6':40, '10':55, '16':73, '25':96, '35':116, '50':140, '70':177, '95':212, '120':244, '150':273, '185':309, '240':362, '300':414, '400':0, '500':0 },
  },
  'B: Ladder Open': {
    '1C': { '2.5':0, '4':0, '6':0, '10':0, '16':0, '25':123, '35':154, '50':188, '70':244, '95':298, '120':349, '150':404, '185':464, '240':552, '300':640, '400':749, '500':861 },
    '2C': { '2.5':29, '4':38, '6':49, '10':68, '16':91, '25':116, '35':144, '50':175, '70':224, '95':271, '120':315, '150':363, '185':415, '240':490, '300':564, '400':0, '500':0 },
    '3C': { '2.5':29, '4':38, '6':49, '10':68, '16':91, '25':116, '35':144, '50':175, '70':224, '95':271, '120':315, '150':363, '185':415, '240':490, '300':564, '400':0, '500':0 },
    '4C': { '2.5':29, '4':38, '6':49, '10':68, '16':91, '25':116, '35':144, '50':175, '70':224, '95':271, '120':315, '150':363, '185':415, '240':490, '300':564, '400':0, '500':0 },
  },
  'E: Conduits UG': {
    '1C': { '2.5':29, '4':38, '6':47, '10':63, '16':83, '25':109, '35':132, '50':159, '70':196, '95':238, '120':275, '150':312, '185':356, '240':418, '300':475, '400':545, '500':623 },
    '2C': { '2.5':29, '4':38, '6':47, '10':63, '16':83, '25':109, '35':132, '50':159, '70':196, '95':238, '120':275, '150':312, '185':356, '240':418, '300':475, '400':545, '500':623 },
    '3C': { '2.5':29, '4':38, '6':47, '10':63, '16':83, '25':109, '35':132, '50':159, '70':196, '95':238, '120':275, '150':312, '185':356, '240':418, '300':475, '400':545, '500':623 },
    '4C': { '2.5':29, '4':38, '6':47, '10':63, '16':83, '25':109, '35':132, '50':159, '70':196, '95':238, '120':275, '150':312, '185':356, '240':418, '300':475, '400':545, '500':623 },
  },
};

['C: Tray Closed', 'D: Tray Open', 'F: Free Air', 'G: Conduit on Wall'].forEach(p => {
    if(!baseAmpacityData[p]) baseAmpacityData[p] = JSON.parse(JSON.stringify(baseAmpacityData['A: Ladder Closed']));
});

const initialAmpacityDatabase = {
  'CV(XLPE)-0.6/1kV': JSON.parse(JSON.stringify(baseAmpacityData)),
  'CV(XLPE)-FD(FRC)-0.6/1kV': JSON.parse(JSON.stringify(baseAmpacityData)),
  'CV(XLPE)-6/10(12kV)': {},
  'CV(XLPE)-12/20(24kV)': {},
  'CV(XLPE)-18/30(36kV)': {},
};

// --- Helper Functions ---
const getInstallRef = (install) => {
  if(install.includes('A:')) return 'T5-33';
  if(install.includes('B:')) return 'T5-32';
  if(install.includes('C:')) return 'T5-33';
  if(install.includes('D:')) return 'T5-32';
  if(install.includes('E:')) return 'T5-29';
  if(install.includes('F:')) return 'T5-28';
  return 'T5-20';
};

const getEquipmentGroundSize = (at) => {
  if (at <= 20) return "2.5"; if (at <= 40) return "4"; if (at <= 63) return "6"; if (at <= 100) return "10";
  if (at <= 200) return "16"; if (at <= 300) return "25"; if (at <= 400) return "35"; if (at <= 630) return "50";
  if (at <= 800) return "70"; if (at <= 1000) return "95"; return "120";
};

const getMainGroundSize = (sizeStr, sets) => {
  const size = parseFloat(sizeStr) || 0; const totalArea = size * sets;
  if (totalArea <= 35) return "10"; if (totalArea <= 70) return "16"; if (totalArea <= 120) return "25";
  if (totalArea <= 300) return "35"; if (totalArea <= 500) return "50"; if (totalArea <= 800) return "70";
  if (totalArea <= 1250) return "95"; return "120";
};

const getCalculatedVd = (f, sysType, volt, powerFactor, currentCableDB) => {
  const rData = currentCableDB['CV(XLPE)-0.6/1kV']?.find(c => c.size === f.cal.size)?.r || 0;
  const xData = currentCableDB['CV(XLPE)-0.6/1kV']?.find(c => c.size === f.cal.size)?.x || 0;
  let calcVd = 0;
  if (rData && xData) {
      const I = parseFloat(f.loadA) || 0;
      const factor = parseFloat(f.cal.factor) || 1.0;
      const activeI = I * (f.cal.circType === 'Main' ? 1.0 : factor); // Main loadA already includes D.F. conceptually or is max, but keeping factor logic separated
      const L = parseFloat(f.cal.dist) || 0;
      const R = parseFloat(rData);
      const X = parseFloat(xData);
      const sets = parseInt(f.cal.set) || 1;
      const pf = parseFloat(powerFactor) || 1.0;
      const sinPhi = Math.sqrt(1 - (pf * pf)); 
      
      let vdVolt = 0;
      if (sysType.includes('1P') || sysType.includes('DC')) {
          vdVolt = (2 * (activeI / sets) * L * (R * pf + (sysType.includes('DC') ? 0 : X * sinPhi))) / 1000;
      } else {
          vdVolt = (Math.sqrt(3) * (activeI / sets) * L * (R * pf + X * sinPhi)) / 1000;
      }
      
      const sysVolt = parseFloat(volt) || 400;
      const vBase = (sysType.includes('1P') || sysType.includes('DC')) ? (sysVolt / Math.sqrt(3)) : sysVolt;
      calcVd = vBase > 0 ? (vdVolt / vBase) * 100 : 0;
  }
  return calcVd;
};

const calculateMdbIc = (kvaStr, zkStr, volt) => {
  try {
    const kvaMatch = String(kvaStr).replace(/,/g, '').match(/\d+(\.\d+)?/);
    const zkMatch = String(zkStr).match(/\d+(\.\d+)?/);
    const v = parseFloat(volt) || 400;
    
    if (!kvaMatch || v === 0) return `Infinite Bus (Assume 25 kA)`;
    
    const kva = parseFloat(kvaMatch[0]);
    if (!zkMatch || parseFloat(zkMatch[0]) === 0) return `Infinite Bus (Assume 25 kA)`;
    
    const zk = parseFloat(zkMatch[0]);
    const I_FL = (kva * 1000) / (Math.sqrt(3) * v);
    const I_sc_tr = (I_FL * 100) / zk;
    const I_sc_total = I_sc_tr + I_FL; 
    const isc_kA = I_sc_total / 1000;
    
    const stdSizes = [10, 16, 25, 36, 50, 65, 85, 100, 125, 150];
    let selectedIc = 150; 
    for (let size of stdSizes) {
      if (size >= isc_kA) {
        selectedIc = size;
        break;
      }
    }
    return `All CB Ic >= ${selectedIc} kA @${v}VAC`;
  } catch (e) {
    return `Infinite Bus (Assume 25 kA)`;
  }
};

const calculateTransformerCurrents = (trKvaStr, trVoltStr) => {
  try {
    const kvaMatch = String(trKvaStr).replace(/,/g, '').match(/\d+(\.\d+)?/);
    const kva = kvaMatch ? parseFloat(kvaMatch[0]) : 0;
    
    const parts = String(trVoltStr).split('/');
    const hvPart = parts[0] || '';
    const lvPart = parts[1] || '';

    let hvKv = 22;
    const hvMatch = hvPart.match(/(\d+(\.\d+)?)\s*(kV|V)/i);
    if (hvMatch) {
      const val = parseFloat(hvMatch[1]);
      const unit = hvMatch[3].toLowerCase();
      hvKv = unit === 'kv' ? val : val / 1000;
    }

    let lvVolts = 400;
    const lvMatch = lvPart.match(/(\d+(\.\d+)?)\s*(Vac|V)/i);
    if (lvMatch) {
      lvVolts = parseFloat(lvMatch[1]);
    } else {
      const lvMatchAny = lvPart.match(/(\d+(\.\d+)?)/);
      if (lvMatchAny) lvVolts = parseFloat(lvMatchAny[1]);
    }

    const hvAmp = kva > 0 && hvKv > 0 ? kva / (Math.sqrt(3) * hvKv) : 0;
    const lvAmp = kva > 0 && lvVolts > 0 ? (kva * 1000) / (Math.sqrt(3) * lvVolts) : 0;

    return { hvAmp, lvAmp, hvKv, lvVolts };
  } catch (e) {
    return { hvAmp: 0, lvAmp: 0, hvKv: 22, lvVolts: 400 };
  }
};

const getIecImpedance = (kvaStr) => {
  try {
    const kvaMatch = String(kvaStr).replace(/,/g, '').match(/\d+(\.\d+)?/);
    if (!kvaMatch) return "6%Zk";
    const kva = parseFloat(kvaMatch[0]);
    if (kva === 0) return "6%Zk";
    if (kva <= 630) return "4%Zk";
    if (kva <= 1250) return "5%Zk";
    if (kva <= 2500) return "6%Zk";
    if (kva <= 6300) return "7%Zk";
    return "8%Zk";
  } catch (e) {
    return "6%Zk";
  }
};

const calculateRaceway = (cal, sysType, cableODData, conduitSizesArr, traySizesArr) => {
  const sets = parseInt(cal.set) || 1;
  let phaseCablesPerSet = 1;
  let phaseCableOD = cableODData[cal.size] ? cableODData[cal.size]['1C'] : 10;

  if (cal.cores === '1C') {
      phaseCablesPerSet = sysType.includes('3P 4W') ? 4 : sysType.includes('3P 3W') ? 3 : 2;
      phaseCableOD = cableODData[cal.size] ? cableODData[cal.size]['1C'] : 10;
  } else {
      phaseCablesPerSet = 1; 
      phaseCableOD = cableODData[cal.size] ? (cableODData[cal.size][cal.cores] || cableODData[cal.size]['1C'] * 2.2) : 10;
  }

  const isConduit = cal.install.includes('E:') || cal.install.includes('G:');
  let type = '';
  let calcValueStr = '';
  let spareInfo = '';
  let reqSizeStr = '';
  let rawValue = 0;
  let unit = '';

  if (isConduit) {
      const groundOD = cableODData[cal.ground] ? cableODData[cal.ground]['1C'] : 5;
      const phaseArea = Math.PI * Math.pow(phaseCableOD / 2, 2);
      const groundArea = Math.PI * Math.pow(groundOD / 2, 2);
      
      const totalAreaPerSet = (phaseArea * phaseCablesPerSet) + groundArea;
      
      let selectedConduit = "6\"";
      calcValueStr = `${totalAreaPerSet.toFixed(1)}`;
      
      for (let c of conduitSizesArr) {
          if (c.area40 >= totalAreaPerSet) {
              selectedConduit = c.size;
              break;
          }
      }
      
      reqSizeStr = sets > 1 ? `${sets} x ${selectedConduit} IMC/EMT` : `${selectedConduit} IMC/EMT`;
      type = 'Conduit';
      rawValue = totalAreaPerSet;
      unit = 'mm²';
  } else {
      const totalWidthBase = (phaseCableOD * phaseCablesPerSet * sets); 
      const reqWidthWithSpare = totalWidthBase * 1.2; 
      const spareWidth = reqWidthWithSpare - totalWidthBase;
      
      const sortedTrays = [...traySizesArr].sort((a, b) => a - b);
      let selectedTray = sortedTrays.length > 0 ? sortedTrays[sortedTrays.length - 1] : 1000;
      
      if (reqWidthWithSpare > selectedTray) {
          const numTrays = Math.ceil(reqWidthWithSpare / selectedTray);
          reqSizeStr = `${numTrays} x Tray/Ladder ${selectedTray} mm`;
      } else {
          for (let w of sortedTrays) {
              if (w >= reqWidthWithSpare) {
                  selectedTray = w;
                  break;
              }
          }
          reqSizeStr = `Tray/Ladder ${selectedTray} mm`;
      }

      type = 'Tray/Ladder';
      calcValueStr = `${reqWidthWithSpare.toFixed(1)}`;
      spareInfo = `(${totalWidthBase.toFixed(1)}+${spareWidth.toFixed(1)})`;
      rawValue = reqWidthWithSpare;
      unit = 'mm';
  }

  const finalSize = cal.racewayOverride && cal.racewayOverride.trim() !== "" ? cal.racewayOverride : reqSizeStr;

  return { type, calcValue: calcValueStr, spareInfo, requiredSize: reqSizeStr, finalSize, rawValue, unit };
};


const DEFAULT_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxMCZ052kVoq4_QdquiEz_IVRfN9oBF9L-BrE71hQGF8RpIqVPODq_qLNWaAxBn0uER/exec";

const AuthWall = ({ handleLoginUser, handleRegisterUser }) => {
  const [isLogin, setIsLogin] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !password) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (!isLogin) {
      if (!name.trim()) {
        setError('กรุณากรอกชื่อผู้ใช้งาน');
        return;
      }
      if (password !== confirmPassword) {
        setError('รหัสผ่านไม่ตรงกัน');
        return;
      }
      if (password.length < 6) {
        setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        const res = await handleLoginUser(email, password);
        if (!res.success) {
          setError(res.error || 'การเข้าสู่ระบบล้มเหลว');
        }
      } else {
        const res = await handleRegisterUser(name, email, password);
        if (res.success) {
          setSuccess('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
          setIsLogin(true);
          setPassword('');
          setConfirmPassword('');
        } else {
          setError(res.error || 'การสมัครสมาชิกล้มเหลว');
        }
      }
    } catch (e) {
      setError(`เกิดข้อผิดพลาด: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#070d19] flex items-center justify-center font-sarabun p-4 z-[9999] overflow-y-auto">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-[450px] bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800 p-8 relative z-10 shrink-0 my-8">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-3.5 rounded-xl shadow-lg mb-3">
            <Layout className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">SLD STUDIO Pro</h1>
          <p className="text-[11px] text-cyan-400 mt-1 uppercase tracking-widest font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> Solar Design Single Line Diagram
          </p>
        </div>

        <div className="flex bg-slate-950/60 rounded-xl p-1 border border-slate-800/80 mb-6">
          <button 
            type="button" 
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }} 
            className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${isLogin ? 'bg-[#1e293b] text-cyan-400 border border-[#334155] shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            เข้าสู่ระบบ (Login)
          </button>
          <button 
            type="button" 
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }} 
            className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${!isLogin ? 'bg-[#1e293b] text-cyan-400 border border-[#334155] shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            สมัครสมาชิก (Register)
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 text-red-400 text-xs font-semibold flex items-start gap-2 mb-4 animate-in fade-in duration-200">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 text-emerald-400 text-xs font-semibold flex items-start gap-2 mb-4 animate-in fade-in duration-200">
            <Check className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 block tracking-wide">ชื่อผู้ใช้งาน (Name)</label>
              <input 
                type="text" 
                placeholder="สมชาย แซ่ตั้ง" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full bg-[#0a0f1d] text-slate-200 text-xs rounded-xl px-3.5 py-3 border border-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors font-sarabun"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 block tracking-wide">อีเมล (Email)</label>
            <input 
              type="email" 
              placeholder="example@domain.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full bg-[#0a0f1d] text-slate-200 text-xs rounded-xl px-3.5 py-3 border border-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors font-sarabun"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 block tracking-wide">รหัสผ่าน (Password)</label>
            <input 
              type="password" 
              placeholder="••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full bg-[#0a0f1d] text-slate-200 text-xs rounded-xl px-3.5 py-3 border border-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors font-sarabun"
            />
          </div>

          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 block tracking-wide">ยืนยันรหัสผ่าน (Confirm Password)</label>
              <input 
                type="password" 
                placeholder="••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="w-full bg-[#0a0f1d] text-slate-200 text-xs rounded-xl px-3.5 py-3 border border-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors font-sarabun"
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : isLogin ? (
              <>
                <Lock className="w-4 h-4" /> เข้าสู่ระบบ
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> สมัครสมาชิก
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

const SidebarTableRow = ({ id, label, value, onChange, type = "text", suffix = "", highlightedField, setHighlightedField, inputRef, disabled = false, list }) => {
  const isRowDisabled = disabled || (typeof window !== 'undefined' && window.currentUserRole === 'Viewer');
  return (
    <div className={`grid grid-cols-[100px_10px_1fr] items-center gap-2 border-b border-[#2d3748] last:border-0 py-2 px-3 transition-all duration-300 ${isRowDisabled ? 'opacity-35 pointer-events-none' : highlightedField === id ? 'bg-[#2a4365] -mx-1 shadow-inner border-l-4 border-l-cyan-400' : 'hover:bg-[#2d3748]'}`}>
      <label className="text-[12px] font-semibold text-slate-300 tracking-wide">{label}</label>
      <div className="text-slate-500 font-bold text-[12px] text-center">:</div>
      <div className="flex items-center gap-2">
        {type === "textarea" ? (
          <textarea disabled={isRowDisabled} ref={inputRef} value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => setHighlightedField(id)} className="w-full bg-transparent text-[#e2e8f0] font-mono text-[13px] border-none focus:ring-0 outline-none p-0 h-12 resize-none placeholder-slate-600" />
        ) : (
          <input disabled={isRowDisabled} ref={inputRef} value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => setHighlightedField(id)} list={list} className="w-full bg-transparent text-[#e2e8f0] font-mono text-[13px] border-none focus:ring-0 outline-none p-0 placeholder-slate-600" />
        )}
        {suffix && <span className="text-[11px] text-cyan-500 font-bold">{suffix}</span>}
      </div>
    </div>
  );
};


const SectionHeader = ({ icon: Icon, title, colorClass, rightAction }) => (
  <div className={`flex items-center justify-between mb-0 p-2.5 bg-[#1a202c] border-b border-[#2d3748]`}>
    <div className="flex items-center gap-2">
      <Icon className={`w-4 h-4 ${colorClass}`} />
      <span className="text-[12px] font-bold uppercase tracking-widest text-slate-100">{title}</span>
    </div>
    {rightAction && rightAction}
  </div>
);

const IECBreaker = ({ x, y, title, ataf, fieldId, tab = "global", focusInput }) => (
  <g cursor="pointer" onClick={() => focusInput(tab, fieldId)} className="hover:opacity-80 transition-opacity drop-shadow-md">
    <line x1={x} y1={y - 15} x2={x} y2={y - 10} stroke="#1e293b" strokeWidth="2.5" />
    <line x1={x} y1={y + 10} x2={x} y2={y + 15} stroke="#1e293b" strokeWidth="2.5" />
    <line x1={x} y1={y + 10} x2={x + 10} y2={y - 10} stroke="#1e293b" strokeWidth="2.5" />
    <line x1={x - 5} y1={y + 8} x2={x + 5} y2={y + 12} stroke="#1e293b" strokeWidth="2" />
    <line x1={x - 5} y1={y + 12} x2={x + 5} y2={y + 8} stroke="#1e293b" strokeWidth="2" />
    <text x={x + 18} y={y - 2} fontSize="11" className="fill-slate-800 font-bold font-mono">{title}</text>
    <text x={x + 18} y={y + 12} fontSize="10" className="fill-slate-500 font-mono">{ataf}</text>
  </g>
);

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem(key) : null;
    } catch (e) {
      return null;
    }
  },
  setItem: (key: string, val: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, val);
      }
    } catch (e) {}
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {}
  }
};

const App = () => {
  // Database migration to clear old cached DB values in browser
  if (typeof window !== 'undefined' && safeLocalStorage.getItem('auto_sld_db_version') !== 'v2') {
    safeLocalStorage.removeItem('auto_sld_cable_db');
    safeLocalStorage.removeItem('auto_sld_ampacity_db');
    safeLocalStorage.removeItem('auto_sld_cable_od');
    safeLocalStorage.removeItem('auto_sld_conduit_sizes');
    safeLocalStorage.removeItem('auto_sld_tray_sizes');
    safeLocalStorage.setItem('auto_sld_db_version', 'v2');
  }

  const [cableDB, setCableDB] = useState(() => {
    try {
      const saved = safeLocalStorage.getItem('auto_sld_cable_db');
      return saved ? JSON.parse(saved) : initialCableDatabase;
    } catch (e) {
      return initialCableDatabase;
    }
  });
  const [ampacityDB, setAmpacityDB] = useState(() => {
    try {
      const saved = safeLocalStorage.getItem('auto_sld_ampacity_db');
      return saved ? JSON.parse(saved) : initialAmpacityDatabase;
    } catch (e) {
      return initialAmpacityDatabase;
    }
  });
  const [cableOD, setCableOD] = useState(() => {
    try {
      const saved = safeLocalStorage.getItem('auto_sld_cable_od');
      return saved ? JSON.parse(saved) : initialCableODData;
    } catch (e) {
      return initialCableODData;
    }
  });
  const [conduitSizes, setConduitSizes] = useState(() => {
    try {
      const saved = safeLocalStorage.getItem('auto_sld_conduit_sizes');
      return saved ? JSON.parse(saved) : [...initialConduitSizes];
    } catch (e) {
      return [...initialConduitSizes];
    }
  });
  const [traySizes, setTraySizes] = useState(() => {
    try {
      const saved = safeLocalStorage.getItem('auto_sld_tray_sizes');
      return saved ? JSON.parse(saved) : [...initialTraySizes];
    } catch (e) {
      return [...initialTraySizes];
    }
  });

  useEffect(() => {
    safeLocalStorage.setItem('auto_sld_cable_db', JSON.stringify(cableDB));
  }, [cableDB]);

  useEffect(() => {
    safeLocalStorage.setItem('auto_sld_ampacity_db', JSON.stringify(ampacityDB));
  }, [ampacityDB]);

  useEffect(() => {
    safeLocalStorage.setItem('auto_sld_cable_od', JSON.stringify(cableOD));
  }, [cableOD]);

  useEffect(() => {
    safeLocalStorage.setItem('auto_sld_conduit_sizes', JSON.stringify(conduitSizes));
  }, [conduitSizes]);

  useEffect(() => {
    safeLocalStorage.setItem('auto_sld_tray_sizes', JSON.stringify(traySizes));
  }, [traySizes]);
  const [racewayGroups, setRacewayGroups] = useState([
    { id: 1, startNum: 1, endNum: 4 },
    { id: 2, startNum: 5, endNum: 7 }
  ]);

  const handleAddRacewayGroup = () => {
    const nextStart = feeders.length > 0 ? feeders.length : 1;
    setRacewayGroups(prev => [
      ...prev,
      { id: Date.now(), startNum: nextStart, endNum: nextStart }
    ]);
  };

  const handleRemoveRacewayGroup = (id) => {
    setRacewayGroups(prev => prev.filter(g => g.id !== id));
  };

  const handleUpdateRacewayGroup = (id, field, value) => {
    setRacewayGroups(prev => prev.map(g => {
      if (g.id === id) {
        return { ...g, [field]: value };
      }
      return g;
    }));
  };
  
  const [eitTables, setEitTables] = useState([]);
  const [isAddEitModalOpen, setIsAddEitModalOpen] = useState(false);
  const [newEitName, setNewEitName] = useState('');
  const [newEitImage, setNewEitImage] = useState(null);
  const [viewingEitTable, setViewingEitTable] = useState(null);
  const [pendingDeleteEitId, setPendingDeleteEitId] = useState(null);
  const fileInputRef = useRef(null);
  const loadProjectInputRef = useRef(null);
  const svgRef = useRef(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const [globalSpecs, setGlobalSpecs] = useState({
    projectName: "SOLAR EPC 2026",
    hasTransformer: true,
    existingMdbText: "To Existing MDB-03",
    trTitle: "TR-01",
    trKva: "1,000 kVA",
    trVolt: "22 kV 3Ph-4W / 400 Vac 3Ph-3W",
    trVector: "Dyn11",
    trZk: "6%Zk",
    mdbTitle: "MDB-MAIN",
    mdbType: "Outdoor",
    mdbSpec: "Outdoor IP54 Form 2A",
    mdbIc: calculateMdbIc("1,000 kVA", "6%Zk", 400),
    mainCbType: "ACB 3P",
    mainCbAtAf: "1600/1600 AT/AF",
    mainPhaseCable: "3(4x1C-500) sq.mm., CV",
    mainGroundCable: "1C-120 sq.mm.,(G)",
    busbar: "1600A, 100%N, 25%G",    
    mainCal: {
       circType: 'Main', factor: 1.25, at: 1600, adjust: 1.0, af: 1600,
       install: "A: Ladder Closed", ref: "T5-33", cores: "1C", size: "500",
       ampCable: 606, ca: 1, cg: 1, set: 3, dist: 15, vd: 0, ground: "120", racewayOverride: ""
     }
   });

   const [systemType, setSystemType] = useState('3P 4W Full N'); 
   const [maxVd, setMaxVd] = useState(2.5);
   const [globalPf, setGlobalPf] = useState(1.0);
   const [calVoltage, setCalVoltage] = useState(400);

   const [canvasView, setCanvasView] = useState({ scale: 1, x: 0, y: 0 });
   const [isDragging, setIsDragging] = useState(false);
   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

   const [selectedRowId, setSelectedRowId] = useState(null);
   const [isDragFilling, setIsDragFilling] = useState(false);
   const [dragFillStartIdx, setDragFillStartIdx] = useState(null);
   const [dragFillCurrentIdx, setDragFillCurrentIdx] = useState(null);

   const initialCal = {
     circType: 'Feeder', factor: 1.1, at: 250, adjust: 1.0, af: 250,
     install: "A: Ladder Closed", ref: "T5-33", cores: "1C", size: "120",
     ampCable: 284, ca: 1, cg: 1, set: 1, dist: 50, vd: 1.22, ground: "25", racewayOverride: ""
   };

    const [feeders, setFeeders] = useState([
      { id: 1, title: "Feeder 1", type: "MCCB 3P", ataf: "250 AT / 250 AF", cable1: "4x1C-120 sq.mm., CV", cable2: "1C-25 sq.mm.,(G)", install: "A: Ladder Closed", loadKw: "150", loadA: "216.51", loadTitle: "Inverter 1", cal: {...initialCal, circType: 'Feeder', at: 250, af: 250, ground: "25"} },
      { id: 2, title: "Feeder 2", type: "MCCB 3P", ataf: "250 AT / 250 AF", cable1: "4x1C-120 sq.mm., CV", cable2: "1C-25 sq.mm.,(G)", install: "A: Ladder Closed", loadKw: "150", loadA: "216.51", loadTitle: "Inverter 2", cal: {...initialCal, circType: 'Feeder', at: 250, af: 250, ampCable: 284, ground: "25"} },
      { id: 3, title: "Feeder 3", type: "MCCB 3P", ataf: "250 AT / 250 AF", cable1: "4x1C-120 sq.mm., CV", cable2: "1C-25 sq.mm.,(G)", install: "A: Ladder Closed", loadKw: "150", loadA: "216.51", loadTitle: "Inverter 3", cal: {...initialCal, circType: 'Feeder', at: 250, af: 250, ampCable: 284, ground: "25"} },
      { id: 4, title: "Feeder 4", type: "MCCB 3P", ataf: "250 AT / 250 AF", cable1: "4x1C-120 sq.mm., CV", cable2: "1C-25 sq.mm.,(G)", install: "A: Ladder Closed", loadKw: "150", loadA: "216.51", loadTitle: "Inverter 4", cal: {...initialCal, circType: 'Feeder', at: 250, af: 250, ampCable: 284, ground: "25"} },
      { id: 5, title: "Feeder 5", type: "MCCB 3P", ataf: "250 AT / 250 AF", cable1: "4x1C-120 sq.mm., CV", cable2: "1C-25 sq.mm.,(G)", install: "A: Ladder Closed", loadKw: "150", loadA: "216.51", loadTitle: "Inverter 5", cal: {...initialCal, circType: 'Feeder', at: 250, af: 250, ampCable: 284, ground: "25"} },
      { id: 6, title: "Feeder 6", type: "MCCB 3P", ataf: "250 AT / 250 AF", cable1: "4x1C-120 sq.mm., CV", cable2: "1C-25 sq.mm.,(G)", install: "A: Ladder Closed", loadKw: "150", loadA: "216.51", loadTitle: "Inverter 6", cal: {...initialCal, circType: 'Feeder', at: 250, af: 250, ampCable: 284, ground: "25"} },
    ]);



  const getGroupRacewaySize = (startNum, endNum) => {
    const startIdx = Math.min(startNum, endNum) - 1;
    const endIdx = Math.max(startNum, endNum) - 1;
    
    const groupFeeders = feeders.slice(startIdx, endIdx + 1);
    if (groupFeeders.length === 0) return { finalSize: "N/A", reqSizeStr: "N/A" };
    
    const baseCal = groupFeeders[0].cal;
    const install = baseCal.install;
    const isConduit = install.includes('E:') || install.includes('G:');
    
    if (isConduit) {
        let totalAreaCombined = 0;
        groupFeeders.forEach(f => {
          const sets = parseInt(f.cal.set) || 1;
          let phaseCablesPerSet = 1;
          if (f.cal.cores === '1C') {
            phaseCablesPerSet = systemType.includes('3P 4W') ? 4 : systemType.includes('3P 3W') ? 3 : 2;
          }
          const phaseCableOD = cableOD[f.cal.size] ? cableOD[f.cal.size]['1C'] : 10;
          const groundOD = cableOD[f.cal.ground] ? cableOD[f.cal.ground]['1C'] : 5;
          const phaseArea = Math.PI * Math.pow(phaseCableOD / 2, 2);
          const groundArea = Math.PI * Math.pow(groundOD / 2, 2);
          
          const totalAreaPerSet = (phaseArea * phaseCablesPerSet) + groundArea;
          totalAreaCombined += totalAreaPerSet * sets;
        });

        let selectedConduit = "6\"";
        for (let c of conduitSizes) {
            if (c.area40 >= totalAreaCombined) {
                selectedConduit = c.size;
                break;
            }
        }
        const reqSizeStr = `${selectedConduit} IMC/EMT`;
        return { finalSize: reqSizeStr, reqSizeStr };
    } else {
        let totalWidthBaseCombined = 0;
        groupFeeders.forEach(f => {
          const sets = parseInt(f.cal.set) || 1;
          let phaseCablesPerSet = 1;
          if (f.cal.cores === '1C') {
            phaseCablesPerSet = systemType.includes('3P 4W') ? 4 : systemType.includes('3P 3W') ? 3 : 2;
          } else {
            phaseCablesPerSet = 1;
          }
          const phaseCableOD = cableOD[f.cal.size] ? (f.cal.cores === '1C' ? cableOD[f.cal.size]['1C'] : (cableOD[f.cal.size][f.cal.cores] || cableOD[f.cal.size]['1C'] * 2.2)) : 10;
          totalWidthBaseCombined += (phaseCableOD * phaseCablesPerSet * sets);
        });

        const reqWidthWithSpareCombined = totalWidthBaseCombined * 1.2;
        const sortedTrays = [...traySizes].sort((a, b) => a - b);
        let selectedTray = sortedTrays.length > 0 ? sortedTrays[sortedTrays.length - 1] : 1000;
        
        let reqSizeStr = "";
        if (reqWidthWithSpareCombined > selectedTray) {
            const numTrays = Math.ceil(reqWidthWithSpareCombined / selectedTray);
            reqSizeStr = `${numTrays} x Tray/Ladder ${selectedTray} mm`;
        } else {
            for (let w of sortedTrays) {
                if (w >= reqWidthWithSpareCombined) {
                    selectedTray = w;
                    break;
                }
            }
            reqSizeStr = `Tray/Ladder ${selectedTray} mm`;
        }
        return { finalSize: reqSizeStr, reqSizeStr };
    }
  };

  const getFeederRacewaySize = (feeder, feederIdx) => {
    const num = feederIdx + 1;
    const group = racewayGroups.find(g => num >= Math.min(g.startNum, g.endNum) && num <= Math.max(g.startNum, g.endNum));
    if (group) {
      const gSize = getGroupRacewaySize(group.startNum, group.endNum);
      const isConduit = feeder.cal.install.includes('E:') || feeder.cal.install.includes('G:');
      
      let combinedCalcValue = 0;
      let unit = 'mm';
      let type = 'Tray/Ladder';
      
      const startIdx = Math.min(group.startNum, group.endNum) - 1;
      const endIdx = Math.max(group.startNum, group.endNum) - 1;
      const groupFeeders = feeders.slice(startIdx, endIdx + 1);
      
      if (isConduit) {
        type = 'Conduit';
        unit = 'mm²';
        groupFeeders.forEach(f => {
          const sets = parseInt(f.cal.set) || 1;
          let phaseCablesPerSet = 1;
          if (f.cal.cores === '1C') {
            phaseCablesPerSet = systemType.includes('3P 4W') ? 4 : systemType.includes('3P 3W') ? 3 : 2;
          }
          const phaseCableOD = cableOD[f.cal.size] ? cableOD[f.cal.size]['1C'] : 10;
          const groundOD = cableOD[f.cal.ground] ? cableOD[f.cal.ground]['1C'] : 5;
          const phaseArea = Math.PI * Math.pow(phaseCableOD / 2, 2);
          const groundArea = Math.PI * Math.pow(groundOD / 2, 2);
          const totalAreaPerSet = (phaseArea * phaseCablesPerSet) + groundArea;
          combinedCalcValue += totalAreaPerSet * sets;
        });
      } else {
        groupFeeders.forEach(f => {
          const sets = parseInt(f.cal.set) || 1;
          let phaseCablesPerSet = 1;
          if (f.cal.cores === '1C') {
            phaseCablesPerSet = systemType.includes('3P 4W') ? 4 : systemType.includes('3P 3W') ? 3 : 2;
          } else {
            phaseCablesPerSet = 1;
          }
          const phaseCableOD = cableOD[f.cal.size] ? (f.cal.cores === '1C' ? cableOD[f.cal.size]['1C'] : (cableOD[f.cal.size][f.cal.cores] || cableOD[f.cal.size]['1C'] * 2.2)) : 10;
          combinedCalcValue += (phaseCableOD * phaseCablesPerSet * sets) * 1.2;
        });
      }
      
      return {
        type,
        calcValue: combinedCalcValue.toFixed(1),
        spareInfo: '',
        requiredSize: gSize.reqSizeStr,
        finalSize: feeder.cal.racewayOverride && feeder.cal.racewayOverride.trim() !== "" ? feeder.cal.racewayOverride : gSize.finalSize,
        rawValue: combinedCalcValue,
        unit,
        isGrouped: true,
        groupLabel: `Group: F${Math.min(group.startNum, group.endNum)}-F${Math.max(group.startNum, group.endNum)}`
      };
    }
    return calculateRaceway(feeder.cal, systemType, cableOD, conduitSizes, traySizes);
  };

  const totalLoadKw = feeders.reduce((sum, f) => sum + (parseFloat(f.loadKw) || 0), 0);
  const totalLoadA = feeders.reduce((sum, f) => sum + (parseFloat(f.loadA) || 0), 0);

  const isIdenticalFeeder = (f1, f2) => {
    if (!f1 || !f2) return false;
    return (
      f1.loadKw === f2.loadKw &&
      f1.type === f2.type &&
      f1.ataf === f2.ataf &&
      f1.cable1 === f2.cable1 &&
      f1.cable2 === f2.cable2 &&
      f1.install === f2.install &&
      f1.cal.circType === f2.cal.circType &&
      f1.cal.factor === f2.cal.factor &&
      f1.cal.at === f2.cal.at &&
      f1.cal.adjust === f2.cal.adjust &&
      f1.cal.af === f2.cal.af &&
      f1.cal.install === f2.cal.install &&
      f1.cal.cores === f2.cal.cores &&
      f1.cal.size === f2.cal.size &&
      f1.cal.ca === f2.cal.ca &&
      f1.cal.cg === f2.cal.cg &&
      f1.cal.set === f2.cal.set &&
      f1.cal.dist === f2.cal.dist &&
      f1.cal.ground === f2.cal.ground
    );
  };

  const renderItems = useMemo(() => {
    if (feeders.length === 0) return [];
    if (feeders.length <= 8) {
      return feeders.map(f => ({ type: 'single', feeder: f }));
    }
    const groups = [];
    let currentGroup = [feeders[0]];
    for (let i = 1; i < feeders.length; i++) {
      const f = feeders[i];
      const prev = feeders[i - 1];
      if (isIdenticalFeeder(prev, f)) {
        currentGroup.push(f);
      } else {
        groups.push(currentGroup);
        currentGroup = [f];
      }
    }
    groups.push(currentGroup);

    const items = [];
    groups.forEach(g => {
      if (g.length === 1) {
        items.push({ type: 'single', feeder: g[0] });
      } else if (g.length === 2) {
        items.push({ type: 'single', feeder: g[0] });
        items.push({ type: 'single', feeder: g[1] });
      } else {
        items.push({ type: 'first', feeder: g[0], groupSize: g.length });
        items.push({ type: 'skip', firstFeeder: g[0], lastFeeder: g[g.length - 1], count: g.length - 2 });
        items.push({ type: 'last', feeder: g[g.length - 1], groupSize: g.length });
      }
    });
    return items;
  }, [feeders]);
  
  const [activeTab, setActiveTab] = useState('global'); 
  const [highlightedField, setHighlightedField] = useState(null);
  const [isCalModalOpen, setIsCalModalOpen] = useState(false);
  const [activeCalFeederId, setActiveCalFeederId] = useState(null);
  const inputRefs = useRef({});
  const [dbSubTab, setDbSubTab] = useState('Cable data'); 
  const [dbCableTab, setDbCableTab] = useState('CV(XLPE)-0.6/1kV');
  const [dbInstallType, setDbInstallType] = useState('A: Ladder Closed');
  const [dbCoreType, setDbCoreType] = useState('1C');
  const [isDbEditMode, setIsDbEditMode] = useState(false);

  const [sheetUrl, setSheetUrl] = useState(() => safeLocalStorage.getItem('auto_sld_sheet_url') || '');
  const [appsScriptUrl, setAppsScriptUrl] = useState(DEFAULT_APPS_SCRIPT_URL);
  const [isPulling, setIsPulling] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [sheetStatus, setSheetStatus] = useState('disconnected');
  const [sheetError, setSheetError] = useState('');
  const [syncLogs, setSyncLogs] = useState<string[]>([]);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = safeLocalStorage.getItem('auto_sld_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [usersList, setUsersList] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  if (typeof window !== 'undefined') {
    window.currentUserRole = currentUser ? currentUser.role : null;
  }

  const logSync = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSyncLogs(prev => [`[${timestamp}] ${msg}`, ...prev].slice(0, 30));
  };

  const handleLoginUser = async (email, password) => {
    try {
      const scriptUrl = DEFAULT_APPS_SCRIPT_URL;
      const res = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'loginUser',
          email,
          password
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        safeLocalStorage.setItem('auto_sld_user', JSON.stringify(data.user));
        logSync(`User logged in: ${data.user.name} (${data.user.role})`);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'การเข้าสู่ระบบล้มเหลว' };
      }
    } catch (e) {
      return { success: false, error: `ข้อผิดพลาดการเชื่อมต่อ: ${e.message}` };
    }
  };

  const handleRegisterUser = async (name, email, password) => {
    try {
      const scriptUrl = DEFAULT_APPS_SCRIPT_URL;
      const res = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'register',
          name,
          email,
          password
        })
      });
      const data = await res.json();
      if (data.success) {
        logSync(`User registered: ${name}`);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'การสมัครสมาชิกล้มเหลว' };
      }
    } catch (e) {
      return { success: false, error: `ข้อผิดพลาดการเชื่อมต่อ: ${e.message}` };
    }
  };

  const handleFetchUsers = async () => {
    if (!currentUser) return;
    setIsLoadingUsers(true);
    try {
      const scriptUrl = DEFAULT_APPS_SCRIPT_URL;
      const res = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'getUsers',
          requesterEmail: currentUser.email
        })
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(data.users || []);
        logSync('โหลดรายชื่อผู้ใช้เสร็จสมบูรณ์');
      } else {
        alert(`โหลดข้อมูลผู้ใช้ไม่สำเร็จ: ${data.error}`);
      }
    } catch (e) {
      alert(`ข้อผิดพลาดการเชื่อมต่อ: ${e.message}`);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleUpdateUserStatus = async (targetEmail, status, role) => {
    if (!currentUser) return;
    try {
      const scriptUrl = DEFAULT_APPS_SCRIPT_URL;
      const res = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'updateUserStatus',
          requesterEmail: currentUser.email,
          targetEmail,
          status,
          role
        })
      });
      const data = await res.json();
      if (data.success) {
        logSync(`อัปเดตสิทธิ์ผู้ใช้ ${targetEmail} สำเร็จ`);
        handleFetchUsers();
      } else {
        alert(`อัปเดตสิทธิ์ไม่สำเร็จ: ${data.error}`);
      }
    } catch (e) {
      alert(`ข้อผิดพลาดการเชื่อมต่อ: ${e.message}`);
    }
  };

  const handleDeleteUser = async (targetEmail) => {
    if (!currentUser) return;
    if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งาน ${targetEmail}?`)) return;
    try {
      const scriptUrl = DEFAULT_APPS_SCRIPT_URL;
      const res = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'deleteUser',
          requesterEmail: currentUser.email,
          targetEmail
        })
      });
      const data = await res.json();
      if (data.success) {
        logSync(`ลบผู้ใช้ ${targetEmail} สำเร็จ`);
        handleFetchUsers();
      } else {
        alert(`ลบผู้ใช้ไม่สำเร็จ: ${data.error}`);
      }
    } catch (e) {
      alert(`ข้อผิดพลาดการเชื่อมต่อ: ${e.message}`);
    }
  };

  const handleLogoutUser = () => {
    setCurrentUser(null);
    safeLocalStorage.removeItem('auto_sld_user');
    logSync('ออกจากระบบแล้ว');
  };

  const feederWidth = 220;
  const svgWidth = Math.max(900, (renderItems.length * feederWidth) + 300);
  const centerX = svgWidth / 2;

  // Auto-fit canvas to available screen space
  useEffect(() => {
    const handleResize = () => {
      if (activeTab === 'database' || activeTab === 'raceways') return;
      const sidebarWidth = isSidebarOpen ? 420 : 0;
      const availableWidth = window.innerWidth - sidebarWidth - 64; // 64px padding
      const availableHeight = window.innerHeight - 64;
      const scaleX = availableWidth / svgWidth;
      const scaleY = availableHeight / 1000;
      const s = Math.min(scaleX, scaleY, 1.2);
      const x = (availableWidth - svgWidth * s) / 2;
      const y = (availableHeight - 1000 * s) / 2;
      setCanvasView({ scale: s, x, y });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [svgWidth, isSidebarOpen, activeTab]);

  const getSheetIdFromUrl = (url: string) => {
    const matches = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return matches ? matches[1] : url;
  };

  const handlePullDatabase = async (customSheetUrl = sheetUrl, customScriptUrl = appsScriptUrl) => {
    setIsPulling(true);
    setSheetStatus('syncing');
    setSheetError('');
    logSync('เริ่มต้นซิงค์ข้อมูล...');
    
    safeLocalStorage.setItem('auto_sld_sheet_url', customSheetUrl || '');
    safeLocalStorage.setItem('auto_sld_apps_script_url', customScriptUrl || '');
    
    try {
      if (customScriptUrl && customScriptUrl.trim() !== '') {
        logSync('กำลังดึงข้อมูลจาก Google Apps Script Web App...');
        const separator = customScriptUrl.includes('?') ? '&' : '?';
        const res = await fetch(`${customScriptUrl}${separator}action=pullDb`);
        const data = await res.json();
        
        if (data.success && data.db) {
          const { cables, ampacity, cableOD, conduitSizes: cSizes, traySizes: tSizes } = data.db;
          if (cables) setCableDB(cables);
          if (ampacity) setAmpacityDB(ampacity);
          if (cableOD) setCableOD(cableOD);
          if (cSizes && cSizes.length > 0) setConduitSizes(cSizes);
          if (tSizes && tSizes.length > 0) setTraySizes(tSizes);
          
          setSheetStatus('connected');
          logSync('ซิงค์ตารางฐานข้อมูลผ่าน Web App สำเร็จ!');
        } else {
          throw new Error(data.error || 'โครงสร้างข้อมูลไม่ถูกต้อง');
        }
      } else if (customSheetUrl && customSheetUrl.trim() !== '') {
        const sheetId = getSheetIdFromUrl(customSheetUrl);
        logSync(`กำลังดึงข้อมูลตารางสาธารณะ (ID: ${sheetId})...`);
        
        const fetchCSV = async (sheetName: string) => {
          const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`ไม่พบชีท "${sheetName}" หรือไม่ได้ตั้งค่าแชร์ลิงก์แบบผู้มีสิทธิ์อ่าน`);
          return await res.text();
        };

        const parseCSV = (text: string) => {
          const lines = text.split('\n');
          return lines.map(line => {
            const parts = [];
            let inQuotes = false;
            let current = '';
            for (let i = 0; i < line.length; i++) {
              const char = line[i];
              if (char === '"') {
                inQuotes = !inQuotes;
              } else if (char === ',' && !inQuotes) {
                parts.push(current.trim());
                current = '';
              } else {
                current += char;
              }
            }
            parts.push(current.trim());
            return parts.map(p => p.replace(/^"|"$/g, ''));
          });
        };
        
        logSync('กำลังโหลดชีท Data base...');
        let dbRows: string[][] = [];
        try {
          const dbCsv = await fetchCSV('Data base');
          dbRows = parseCSV(dbCsv);
        } catch (csvError: any) {
          logSync(`ไม่พบชีท Data base หรือโหลดไม่สำเร็จ (${csvError.message}) จะใช้ค่าเริ่มต้นแทน`);
          setSheetStatus('connected');
          return;
        }

        logSync('กำลังนำเข้าข้อมูล...');
        
        // 1. Cables (Columns A-D, indices 0..3)
        const cablesTemp: any = {};
        for (let i = 2; i < dbRows.length; i++) {
          const row = dbRows[i];
          if (row.length >= 4) {
            const type = row[0];
            const size = row[1];
            const r = row[2];
            const x = row[3];
            if (type && size && r && x) {
              if (!cablesTemp[type]) cablesTemp[type] = [];
              cablesTemp[type].push({ size, r, x });
            }
          }
        }
        if (Object.keys(cablesTemp).length > 0) setCableDB(cablesTemp);

        // 2. Ampacity (Columns F-J, indices 5..9)
        const ampacityTemp: any = {};
        for (let i = 2; i < dbRows.length; i++) {
          const row = dbRows[i];
          if (row.length >= 10) {
            const type = row[5];
            const install = row[6];
            const cores = row[7];
            const size = row[8];
            const amp = Number(row[9]);
            if (type && install && cores && size && !isNaN(amp)) {
              if (!ampacityTemp[type]) ampacityTemp[type] = {};
              if (!ampacityTemp[type][install]) ampacityTemp[type][install] = {};
              if (!ampacityTemp[type][install][cores]) ampacityTemp[type][install][cores] = {};
              ampacityTemp[type][install][cores][size] = amp;
            }
          }
        }
        if (Object.keys(ampacityTemp).length > 0) setAmpacityDB(ampacityTemp);

        // 3. CableOD (Columns L-N, indices 11..13)
        const odTemp: any = {};
        for (let i = 2; i < dbRows.length; i++) {
          const row = dbRows[i];
          if (row.length >= 14) {
            const size = row[11];
            const cores = row[12];
            const od = Number(row[13]);
            if (size && cores && !isNaN(od)) {
              if (!odTemp[size]) odTemp[size] = {};
              odTemp[size][cores] = od;
            }
          }
        }
        if (Object.keys(odTemp).length > 0) setCableOD(odTemp);

        // 4. Conduits (Columns P-R, indices 15..17)
        const conduitsTemp = [];
        for (let i = 2; i < dbRows.length; i++) {
          const row = dbRows[i];
          if (row.length >= 18) {
            const size = row[15];
            const id = Number(row[16]);
            const area40 = Number(row[17]);
            if (size && !isNaN(id) && !isNaN(area40)) {
              conduitsTemp.push({ size, id, area40 });
            }
          }
        }
        if (conduitsTemp.length > 0) setConduitSizes(conduitsTemp);

        // 5. Trays (Column T, index 19)
        const traysTemp = [];
        for (let i = 2; i < dbRows.length; i++) {
          const row = dbRows[i];
          if (row.length >= 20) {
            const size = Number(row[19]);
            if (!isNaN(size) && row[19] !== "") {
              traysTemp.push(size);
            }
          }
        }
        if (traysTemp.length > 0) setTraySizes(traysTemp);

        setSheetStatus('connected');
        logSync('ดาวน์โหลดและประมวลผลตารางฐานข้อมูลสาธารณะสำเร็จ!');
      } else {
        throw new Error('กรุณาระบุ URL Google Sheet หรือ Apps Script ในส่วนตั้งค่าก่อน');
      }
    } catch (e: any) {
      setSheetStatus('error');
      setSheetError(e.message);
      logSync(`Sync Error: ${e.message}`);
      alert(`การเชื่อมต่อล้มเหลว: ${e.message}`);
    } finally {
      setIsPulling(false);
    }
  };

  const handlePushDatabase = async () => {
    setIsPushing(true);
    logSync('กำลังส่งฐานข้อมูลปัจจุบันไปยัง Google Sheet...');
    
    try {
      const dbData = {
        cables: cableDB,
        ampacity: ampacityDB,
        cableOD: cableOD,
        conduitSizes: conduitSizes,
        traySizes: traySizes
      };
      
      const res = await fetch(DEFAULT_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'saveDb',
          db: dbData
        })
      });
      
      const data = await res.json();
      if (data.success) {
        logSync('อัปเดตฐานข้อมูลบน Google Sheet สำเร็จแล้ว!');
        alert('อัปเดตฐานข้อมูลบน Google Sheet เรียบร้อยแล้ว!');
      } else {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการเขียนข้อมูลลงชีต');
      }
    } catch (e: any) {
      logSync(`Push Error: ${e.message}`);
      alert(`บันทึกไม่สำเร็จ: ${e.message}`);
    } finally {
      setIsPushing(false);
    }
  };


  useEffect(() => {
    if (activeTab === 'users' && currentUser && currentUser.role === 'Admin') {
      handleFetchUsers();
    }
  }, [activeTab]);


  // --- File Management & Export Methods ---
  const getBaseFileName = () => {
    const projName = (globalSpecs.projectName || "Project").replace(/[\s/\\:]+/g, '_');
    const mdbName = (globalSpecs.mdbTitle || "MDB").replace(/[\s/\\:]+/g, '_');
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    return `${projName}_${mdbName}_${dateStr}`;
  };

  const handleSaveProject = () => {
    const projectData = { globalSpecs, systemType, maxVd, globalPf, calVoltage, feeders, cableOD, conduitSizes, traySizes, racewayGroups };
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${getBaseFileName()}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  const handleLoadProject = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if(data.globalSpecs) setGlobalSpecs(data.globalSpecs);
          if(data.systemType) setSystemType(data.systemType);
          if(data.maxVd) setMaxVd(data.maxVd);
          if(data.globalPf) setGlobalPf(data.globalPf);
          if(data.calVoltage) setCalVoltage(data.calVoltage);
          if(data.feeders) setFeeders(data.feeders);
          if(data.cableOD) setCableOD(data.cableOD);
          if(data.conduitSizes) setConduitSizes(data.conduitSizes);
          if(data.traySizes) setTraySizes(data.traySizes);
          if(data.racewayGroups) setRacewayGroups(data.racewayGroups);
        } catch (err) { alert("Invalid Project File!"); }
      };
      reader.readAsText(file);
    }
  };

  const handleExportCSV = () => {
    let csv = "Feeder ID,Load Name,Type,Load (kW),Current (A),CB (AT),Adj,AdjTrip (A),CB (AF),Phase Cable,Ground Cable,Installation,Length (m),Volt Drop (%)\n";
    
    const mainKw = totalLoadKw;
    const mainAmpV = totalLoadA;
    const mainVdStr = getCalculatedVd({ loadA: mainAmpV, cal: globalSpecs.mainCal }, systemType, calVoltage, globalPf, cableDB).toFixed(2);
    
    const mainAdj = parseFloat(globalSpecs.mainCal.adjust) || 1;
    const mainAdjTrip = globalSpecs.mainCal.at * mainAdj;

    csv += `MAIN INCOMER,Transformer Main,${globalSpecs.mainCbType},${mainKw.toFixed(2)},${mainAmpV.toFixed(2)},${globalSpecs.mainCal.at},${mainAdj},${mainAdjTrip.toFixed(2)},${globalSpecs.mainCal.af},"${globalSpecs.mainPhaseCable}","${globalSpecs.mainGroundCable}","${globalSpecs.mainCal.install}",${globalSpecs.mainCal.dist},${mainVdStr}\n`;

    feeders.forEach(f => {
      const vd = getCalculatedVd(f, systemType, calVoltage, globalPf, cableDB).toFixed(2);
      const adj = parseFloat(f.cal.adjust) || 1;
      const adjTrip = f.cal.at * adj;
      csv += `${f.title},${f.loadTitle},${f.type},${f.loadKw},${f.loadA},${f.cal.at},${adj},${adjTrip.toFixed(2)},${f.cal.af},"${f.cable1}","${f.cable2}","${f.install}",${f.cal.dist},${vd}\n`;
    });
    
    csv += "\n\nRACEWAY CALCULATION\n";
    csv += "Circuit Name,Raceway Type,Cable Configuration,Calculated Size,Recommended Raceway\n";
    
    const mR = calculateRaceway(globalSpecs.mainCal, systemType, cableOD, conduitSizes, traySizes);
    csv += `MAIN INCOMER,${mR.type},"${globalSpecs.mainPhaseCable} + ${globalSpecs.mainGroundCable}","${mR.calcValue} ${mR.unit} ${mR.spareInfo}","${mR.finalSize}"\n`;

    feeders.forEach((f, idx) => {
      const fR = getFeederRacewaySize(f, idx);
      csv += `${f.title},${fR.type},"${f.cable1} + ${f.cable2}","${fR.calcValue} ${fR.unit} ${fR.spareInfo}","${fR.finalSize}"\n`;
    });

    const blob = new Blob(["\uFEFF"+csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${getBaseFileName()}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const handleExportHTML = () => {
    const mR = calculateRaceway(globalSpecs.mainCal, systemType, cableOD, conduitSizes, traySizes);
    const mainAdj = parseFloat(globalSpecs.mainCal.adjust) || 1;
    const mainAdjTrip = globalSpecs.mainCal.at * mainAdj;
    
    const mainAmpV = totalLoadA;
    const mainVdStr = getCalculatedVd({ loadA: mainAmpV, cal: globalSpecs.mainCal }, systemType, calVoltage, globalPf, cableDB).toFixed(2);

    let svgSection = '';
    if (svgRef.current) {
      const svgClone = svgRef.current.cloneNode(true);
      svgClone.style.backgroundColor = 'white';
      svgClone.style.fontFamily = "'Sarabun', sans-serif";
      svgClone.setAttribute('width', '100%');
      svgClone.removeAttribute('height');
      const svgData = new XMLSerializer().serializeToString(svgClone);
      svgSection = `
      <h2>Single Line Diagram (SLD)</h2>
      <div style="background: white; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 30px; overflow-x: auto; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        ${svgData}
      </div>
      `;
    }

    let html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${globalSpecs.projectName} - Design Report</title>
        <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;700;800&display=swap" rel="stylesheet">
        <style>
            body { font-family: 'Sarabun', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; line-height: 1.6; padding: 20px; background: #f8fafc; }
            .container { max-width: 1200px; margin: auto; background: #fff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            h1 { color: #0f172a; border-bottom: 3px solid #0ea5e9; padding-bottom: 10px; margin-bottom: 20px; }
            h2 { color: #334155; margin-top: 30px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 30px; font-size: 13px; }
            th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; vertical-align: top; }
            th { background-color: #f1f5f9; color: #475569; font-weight: bold; text-transform: uppercase; font-size: 12px; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .summary-box { background: #f0f9ff; padding: 20px; border-left: 4px solid #0ea5e9; margin-bottom: 30px; border-radius: 0 8px 8px 0; }
            .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .text-sm { font-size: 11px; color: #64748b; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Electrical Design Report</h1>
            <div class="summary-box">
                <div class="grid-2">
                    <div>
                        <strong>Project Name:</strong> ${globalSpecs.projectName} <br/>
                        <strong>System Type:</strong> ${systemType} (${calVoltage}V, PF: ${globalPf}) <br/>
                        <strong>Transformer:</strong> ${globalSpecs.trTitle} (${globalSpecs.trKva}) <br/>
                    </div>
                    <div>
                        <strong>MDB ID:</strong> ${globalSpecs.mdbTitle} <br/>
                        <strong>Short Circuit:</strong> ${globalSpecs.mdbIc} <br/>
                        <strong>Total Connected Load:</strong> ${totalLoadKw.toFixed(2)} kW / ${totalLoadA.toFixed(2)} A<br/>
                    </div>
                </div>
            </div>

            ${svgSection}

            <h2>Main Incomer Specification</h2>
            <table>
                <tr>
                    <th>Equipment</th>
                    <th>Breaker Spec</th>
                    <th>Phase Cable</th>
                    <th>Ground Cable</th>
                    <th>Raceway / Routing</th>
                    <th>%VD</th>
                </tr>
                <tr>
                    <td><strong>Main Incomer</strong><br/><span class="text-sm">${globalSpecs.mainCbType}</span></td>
                    <td>${globalSpecs.mainCal.at}AT / ${globalSpecs.mainCal.af}AF<br/><span class="text-sm">(Trip: ${mainAdjTrip.toFixed(0)}A)</span></td>
                    <td>${globalSpecs.mainPhaseCable}</td>
                    <td>${globalSpecs.mainGroundCable}</td>
                    <td><strong>${mR.finalSize}</strong><br/><span class="text-sm">${globalSpecs.mainCal.install}</span></td>
                    <td>${mainVdStr}%</td>
                </tr>
            </table>

            <h2>Feeder Schedules</h2>
            <table>
                <tr>
                    <th>Circuit / Load Name</th>
                    <th>Load (kW)</th>
                    <th>Current (A)</th>
                    <th>Protection Device</th>
                    <th>Cable Conductor</th>
                    <th>Raceway</th>
                    <th>%VD</th>
                </tr>`;

    feeders.forEach((f, idx) => {
        const fR = getFeederRacewaySize(f, idx);
        const adj = parseFloat(f.cal.adjust) || 1;
        const adjTrip = f.cal.at * adj;
        const vd = getCalculatedVd(f, systemType, calVoltage, globalPf, cableDB).toFixed(2);
        html += `
                <tr>
                    <td><strong>${f.title}</strong><br/><span class="text-sm">${f.loadTitle}</span></td>
                    <td>${f.loadKw}</td>
                    <td>${f.loadA}</td>
                    <td>${f.type}<br/>${f.cal.at}AT / ${f.cal.af}AF<br/><span class="text-sm">(Trip: ${adjTrip.toFixed(0)}A)</span></td>
                    <td>${f.cable1}<br/><span style="color: #059669;">${f.cable2}</span></td>
                    <td><strong>${fR.finalSize}</strong><br/><span class="text-sm">${f.install}</span></td>
                    <td>${vd}%</td>
                </tr>`;
    });

    html += `
            </table>
            <p style="text-align: right; color: #94a3b8; font-size: 12px; margin-top: 50px;">
                Generated by SLD STUDIO Pro - Solar Design Tool
            </p>
        </div>
    </body>
    </html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${getBaseFileName()}_Report.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportSVG = () => {
    if (!svgRef.current) return;
    const svgClone = svgRef.current.cloneNode(true);
    svgClone.style.backgroundColor = 'white';
    svgClone.style.fontFamily = "'Sarabun', sans-serif";
    const svgData = new XMLSerializer().serializeToString(svgClone);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${getBaseFileName()}.svg`;
    a.click(); URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    if (!svgRef.current) return;
    const svgClone = svgRef.current.cloneNode(true);
    svgClone.style.backgroundColor = 'white';
    svgClone.style.fontFamily = "'Sarabun', sans-serif";
    const svgData = new XMLSerializer().serializeToString(svgClone);
    
    const printWindow = window.open('', '_blank');
    if(printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Export SLD</title>
              <style>
                @page { size: landscape; margin: 10mm; }
                body { margin: 0; display: flex; justify-content: center; align-items: center; width: 100vw; height: 100vh; background: white; font-family: 'Sarabun', sans-serif; }
                svg { max-width: 100%; max-height: 100%; object-fit: contain; }
              </style>
            </head>
            <body>
              ${svgData}
              <script>
                document.title = "${getBaseFileName()}";
                setTimeout(() => { window.print(); window.close(); }, 500);
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
    }
  };

  const handleExportImage = (format) => {
    if (!svgRef.current) return;
    const svgClone = svgRef.current.cloneNode(true);
    svgClone.style.backgroundColor = 'white';
    svgClone.style.fontFamily = "'Sarabun', sans-serif";
    
    const width = parseInt(svgClone.getAttribute('width')) || 900;
    const height = parseInt(svgClone.getAttribute('height')) || 1000;
    
    const svgData = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const DOMURL = window.URL || window.webkitURL || window;
    const url = DOMURL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      
      if (format === 'jpeg') {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);
      DOMURL.revokeObjectURL(url);
      
      const imgURI = canvas.toDataURL(`image/${format}`);
      const a = document.createElement("a");
      a.href = imgURI;
      a.download = `${getBaseFileName()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    img.src = url;
  };

  const generateSummaryText = () => {
      const mR = calculateRaceway(globalSpecs.mainCal, systemType, cableOD, conduitSizes, traySizes);
      const mainAdj = parseFloat(globalSpecs.mainCal.adjust) || 1;
      const mainAdjTrip = (globalSpecs.mainCal.at * mainAdj).toFixed(0);
      
      let text = `MAIN INCOMER : ${globalSpecs.mainCbType}_${mainAdjTrip}A / ${globalSpecs.mainCal.af}AF_${globalSpecs.mainPhaseCable},${globalSpecs.mainGroundCable},${mR.finalSize}\n\n`;
      
      feeders.forEach((f, idx) => {
          const fR = getFeederRacewaySize(f, idx);
          const adj = parseFloat(f.cal.adjust) || 1;
          const adjTrip = (f.cal.at * adj).toFixed(0);
          text += `${f.title} : ${f.type}_${adjTrip}A / ${f.cal.af}AF_${f.cable1},${f.cable2},${fR.finalSize}\n\n`;
      });
      return text.trim();
  };

  const copyToClipboard = () => {
      const text = generateSummaryText();
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleAutoSizeMain = () => {
    const mainFactor = parseFloat(globalSpecs.mainCal.factor) || 1.2;
    let reqA = totalLoadA * mainFactor;
    if (reqA <= 0 || isNaN(reqA)) reqA = 16;
    let iFL = reqA;
    let adj = 1.0;

    const at = breakerOptions.find(b => b >= reqA) || breakerOptions[breakerOptions.length - 1];
    const tripA = at * adj;

    const install = globalSpecs.mainCal.install || 'A: Ladder Closed';
    const cores = globalSpecs.mainCal.cores || '1C';

    const preferredSizes = ['500', '400', '300', '240', '185', '150', '120'];
    let bestCombo = { size: '300', sets: 999, amp: 0 };

    for (let sz of preferredSizes) {
        const ampBase = ampacityDB['CV(XLPE)-0.6/1kV']?.[install]?.[cores]?.[sz] || 0;
        if (ampBase === 0) continue;
        const derated = ampBase * globalSpecs.mainCal.ca * globalSpecs.mainCal.cg;
        const reqSets = Math.ceil(tripA / derated);
        if (reqSets < bestCombo.sets || (reqSets === bestCombo.sets && parseInt(sz) < parseInt(bestCombo.size))) {
            bestCombo = { size: sz, sets: reqSets, amp: ampBase };
        }
    }

    const coreM = systemType.includes('3P 4W') ? "4x" : systemType.includes('3P 3W') ? "3x" : "2x";
    const cableCoreStr = cores === '1C' ? `${coreM}1C` : cores;
    const mainPhaseCable = bestCombo.sets === 1 ? `${cableCoreStr}-${bestCombo.size} sq.mm., CV` : `${bestCombo.sets}(${cableCoreStr}-${bestCombo.size}) sq.mm., CV`;
    const gndSize = getMainGroundSize(bestCombo.size, bestCombo.sets);
    const mainGroundCable = `1C-${gndSize} sq.mm.,(G)`;

    const mainCbType = at >= 1000 ? "ACB 3P" : "MCCB 3P";

    setGlobalSpecs(prev => ({
      ...prev,
      mainCbType,
      mainCbAtAf: `${at}/${at} AT/AF${adj !== 1 ? ` (Adj.${tripA.toFixed(0)}A)` : ''}`,
      mainPhaseCable,
      mainGroundCable,
      busbar: `${at}A, 100%N, 25%G`,
      mainCal: {
         ...prev.mainCal,
         at, af: at, adjust: adj, size: bestCombo.size, set: bestCombo.sets, ampCable: bestCombo.amp, ground: gndSize, racewayOverride: ""
      }
    }));
  };

  const runAutoSizing = (f, newLoadKw, newLoadA, sysType, v, pf, db, ampDB, maxV) => {
    const reqA = newLoadA * (parseFloat(f.cal.factor) || 1.25);
    const at = breakerOptions.find(b => b >= reqA) || breakerOptions[breakerOptions.length - 1];
    const adj = f.cal.adjust !== '' && !isNaN(f.cal.adjust) ? parseFloat(f.cal.adjust) : 1;
    const tripA = at * adj;

    let selectedSize = '500'; 
    let selectedAmp = 0;
    const cableType = 'CV(XLPE)-0.6/1kV';
    
    for (let sz of sizeOptions) {
       const ampBase = ampDB[cableType]?.[f.cal.install]?.[f.cal.cores]?.[sz] || 0;
       if(ampBase === 0) continue; 
       
       const derated = ampBase * f.cal.ca * f.cal.cg * f.cal.set;
       
       const dummyF = JSON.parse(JSON.stringify(f));
       dummyF.cal.size = sz;
       dummyF.loadA = newLoadA;
       const vd = getCalculatedVd(dummyF, sysType, v, pf, db);
       
       if (derated >= tripA && vd <= parseFloat(maxV)) { 
           selectedSize = sz;
           selectedAmp = ampBase;
           break;
       }
    }
    
    const ground = f.cal.circType === 'Main' ? getMainGroundSize(selectedSize, parseInt(f.cal.set) || 1) : getEquipmentGroundSize(tripA);

    return { ...f.cal, at, af: at, size: selectedSize, ampCable: selectedAmp, ground, racewayOverride: "" };
  };

  const handleAutoSize = (id) => {
    const f = feeders.find(x => x.id === id);
    if(!f) return;
    const newCal = runAutoSizing(f, f.loadKw, f.loadA, systemType, calVoltage, globalPf, cableDB, ampacityDB, maxVd);
    
    setFeeders(feeders.map(x => {
        if(x.id === id) {
            let newF = {...x, cal: newCal};
            const adj = newCal.adjust !== '' && !isNaN(newCal.adjust) ? parseFloat(newCal.adjust) : 1;
            const coreM = systemType.includes('3P 4W') ? "4x" : systemType.includes('3P 3W') ? "3x" : (systemType.includes('DC') ? "2x" : "2x");
            const cableCoreStr = newCal.cores === '1C' ? `${coreM}1C` : newCal.cores;
            const sets = parseInt(newCal.set) || 1;
            newF.cable1 = sets === 1 ? `${cableCoreStr}-${newCal.size} sq.mm., CV` : `${sets}(${cableCoreStr}-${newCal.size}) sq.mm., CV`;
            newF.cable2 = `1C-${newCal.ground} sq.mm.,(G)`;
            newF.ataf = `${newCal.at} AT / ${newCal.af} AF${adj !== 1 ? ` (Adj.${(newCal.at * adj).toFixed(0)}A)` : ''}`;
            return newF;
        }
        return x;
    }));
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const scaleAdjust = e.deltaY > 0 ? 0.9 : 1.1;
    setCanvasView(prev => ({ ...prev, scale: Math.max(0.2, Math.min(prev.scale * scaleAdjust, 3)) }));
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; 
    setIsDragging(true);
    setDragStart({ x: e.clientX - canvasView.x, y: e.clientY - canvasView.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setCanvasView(prev => ({ ...prev, x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }));
  };

  const handleMouseUp = () => setIsDragging(false);
  const resetCanvasView = () => {
    const sidebarWidth = isSidebarOpen ? 420 : 0;
    const availableWidth = window.innerWidth - sidebarWidth - 64;
    const availableHeight = window.innerHeight - 64;
    const scaleX = availableWidth / svgWidth;
    const scaleY = availableHeight / 1000;
    const s = Math.min(scaleX, scaleY, 1.2);
    const x = (availableWidth - svgWidth * s) / 2;
    const y = (availableHeight - 1000 * s) / 2;
    setCanvasView({ scale: s, x, y });
  };

  const moveFeeder = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === feeders.length - 1)) return;
    const newFeeders = [...feeders];
    const temp = newFeeders[index];
    newFeeders[index] = newFeeders[index + direction];
    newFeeders[index + direction] = temp;
    setFeeders(renumberFeeders(newFeeders));
  };

  const handleEitImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader(); reader.onloadend = () => setNewEitImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const saveEitTable = () => {
    if (newEitName && newEitImage) {
      setEitTables([...eitTables, { id: Date.now(), name: newEitName, image: newEitImage }]);
      setIsAddEitModalOpen(false); setNewEitName(''); setNewEitImage(null);
    }
  };

  const confirmDeleteEitTable = (id) => setPendingDeleteEitId(id);
  const executeDeleteEitTable = () => {
    setEitTables(eitTables.filter(t => t.id !== pendingDeleteEitId));
    setPendingDeleteEitId(null);
    if (viewingEitTable && viewingEitTable.id === pendingDeleteEitId) setViewingEitTable(null);
  };

  const handleDbChange = (size, field, value) => {
    if (field === 'amp') {
      setAmpacityDB(prev => {
        const newDb = JSON.parse(JSON.stringify(prev));
        if (!newDb[dbCableTab]) newDb[dbCableTab] = {};
        if (!newDb[dbCableTab][dbInstallType]) newDb[dbCableTab][dbInstallType] = {};
        if (!newDb[dbCableTab][dbInstallType][dbCoreType]) newDb[dbCableTab][dbInstallType][dbCoreType] = {};
        newDb[dbCableTab][dbInstallType][dbCoreType][size] = value === '' ? '' : Number(value);
        return newDb;
      });
    } else if (field === 'r' || field === 'x') {
      setCableDB(prev => {
        const newDb = JSON.parse(JSON.stringify(prev));
        const cableArr = newDb[dbCableTab] || [];
        const index = cableArr.findIndex(c => c.size === size);
        if (index !== -1) cableArr[index][field] = value;
        return newDb;
      });
    } else if (field === 'od') {
      setCableOD(prev => {
        const newDb = JSON.parse(JSON.stringify(prev));
        if (!newDb[size]) newDb[size] = {};
        newDb[size][dbCoreType] = value === '' ? '' : Number(value);
        return newDb;
      });
    }
  };

  const handleAddTray = () => setTraySizes([...traySizes, 1000]);
  const handleRemoveTray = (idx) => setTraySizes(traySizes.filter((_, i) => i !== idx));
  const handleAddConduit = () => setConduitSizes([...conduitSizes, {size: 'New', id: 0, area40: 0}]);
  const handleRemoveConduit = (idx) => setConduitSizes(conduitSizes.filter((_, i) => i !== idx));

  const dbTableData = () => {
    const rxData = cableDB[dbCableTab] || [];
    const ampData = ampacityDB[dbCableTab]?.[dbInstallType]?.[dbCoreType] || {};
    return rxData.map(item => ({ 
      size: item.size, 
      r: item.r, 
      x: item.x, 
      amp: ampData[item.size] !== undefined ? ampData[item.size] : 0,
      od: cableOD[item.size] ? cableOD[item.size][dbCoreType] : ''
    }));
  };

  const calculateAmps = (kw, sysType = systemType, volt = calVoltage) => {
    const v = parseFloat(volt) || 400;
    if (!kw || isNaN(kw) || v === 0) return "0";
    const amps = (sysType.includes('1P') || sysType.includes('DC')) ? (parseFloat(kw) * 1000) / v : (parseFloat(kw) * 1000) / (Math.sqrt(3) * v);
    return Math.round(amps * 100) / 100;
  };

  const getSystemVoltage = () => parseFloat(calVoltage) || 400;

  const handleSystemTypeChange = (newSysType) => {
    setSystemType(newSysType);
    setFeeders(prevFeeders => prevFeeders.map(f => ({ ...f, loadA: calculateAmps(f.loadKw, newSysType, calVoltage) })));
  };

  const handleCalVoltageChange = (val) => {
    setCalVoltage(val);
    const newV = parseFloat(val) || 400;
    setFeeders(prevFeeders => prevFeeders.map(f => ({ ...f, loadA: calculateAmps(f.loadKw, systemType, newV) })));
    setGlobalSpecs(prev => ({
      ...prev, trVolt: prev.trVolt.replace(/(\d+)\s*Vac/i, `${newV} Vac`), mdbIc: calculateMdbIc(prev.trKva, prev.trZk, newV)
    }));
  };

  const rowIds = useMemo(() => ['main', ...feeders.map(f => f.id)], [feeders]);

  const copyRowData = (sourceRowId, targetRowId) => {
    if (sourceRowId === targetRowId) return;

    let srcFactor, srcAt, srcAdjust, srcAf, srcInstall, srcRef, srcCores, srcSize, srcAmpCable, srcCa, srcCg, srcSet, srcDist, srcGround;
    let srcLoadKw = "150";

    if (sourceRowId === 'main') {
      const mainCal = globalSpecs.mainCal;
      srcFactor = mainCal.factor;
      srcAt = mainCal.at;
      srcAdjust = mainCal.adjust;
      srcAf = mainCal.af;
      srcInstall = mainCal.install;
      srcRef = mainCal.ref;
      srcCores = mainCal.cores;
      srcSize = mainCal.size;
      srcAmpCable = mainCal.ampCable;
      srcCa = mainCal.ca;
      srcCg = mainCal.cg;
      srcSet = mainCal.set;
      srcDist = mainCal.dist;
      srcGround = mainCal.ground;
    } else {
      const f = feeders.find(x => x.id === sourceRowId);
      if (!f) return;
      srcLoadKw = f.loadKw;
      srcFactor = f.cal.factor;
      srcAt = f.cal.at;
      srcAdjust = f.cal.adjust;
      srcAf = f.cal.af;
      srcInstall = f.cal.install;
      srcRef = f.cal.ref;
      srcCores = f.cal.cores;
      srcSize = f.cal.size;
      srcAmpCable = f.cal.ampCable;
      srcCa = f.cal.ca;
      srcCg = f.cal.cg;
      srcSet = f.cal.set;
      srcDist = f.cal.dist;
      srcGround = f.cal.ground;
    }

    if (targetRowId === 'main') {
      setGlobalSpecs(prev => ({
        ...prev,
        mainCal: {
          ...prev.mainCal,
          factor: srcFactor,
          at: srcAt,
          adjust: srcAdjust,
          af: srcAf,
          install: srcInstall,
          ref: srcRef,
          cores: srcCores,
          size: srcSize,
          ampCable: srcAmpCable,
          ca: srcCa,
          cg: srcCg,
          set: srcSet,
          dist: srcDist,
          ground: srcGround
        }
      }));
    } else {
      setFeeders(prevFeeders => prevFeeders.map(f => {
        if (f.id === targetRowId) {
          const newLoadA = calculateAmps(srcLoadKw, systemType, calVoltage);
          const updatedFeeder = {
            ...f,
            loadKw: srcLoadKw,
            loadA: newLoadA,
            cal: {
              ...f.cal,
              circType: 'Feeder',
              factor: srcFactor,
              at: srcAt,
              adjust: srcAdjust,
              af: srcAf,
              install: srcInstall,
              ref: srcRef,
              cores: srcCores,
              size: srcSize,
              ampCable: srcAmpCable,
              ca: srcCa,
              cg: srcCg,
              set: srcSet,
              dist: srcDist,
              ground: srcGround
            }
          };
          const adj = srcAdjust !== '' && !isNaN(srcAdjust) ? parseFloat(srcAdjust) : 1;
          const coreM = systemType.includes('3P 4W') ? "4x" : systemType.includes('3P 3W') ? "3x" : "2x";
          const cableCoreStr = srcCores === '1C' ? `${coreM}1C` : srcCores;
          const sets = parseInt(srcSet) || 1;
          updatedFeeder.cable1 = sets === 1 ? `${cableCoreStr}-${srcSize} sq.mm., CV` : `${sets}(${cableCoreStr}-${srcSize}) sq.mm., CV`;
          updatedFeeder.cable2 = `1C-${srcGround} sq.mm.,(G)`;
          updatedFeeder.ataf = `${srcAt} AT / ${srcAf} AF${adj !== 1 ? ` (Adj.${(srcAt * adj).toFixed(0)}A)` : ''}`;
          return updatedFeeder;
        }
        return f;
      }));
    }
  };

  useEffect(() => {
    if (!isDragFilling) return;
    const handleGlobalMouseUp = () => {
      if (dragFillStartIdx !== null && dragFillCurrentIdx !== null) {
        const start = Math.min(dragFillStartIdx, dragFillCurrentIdx);
        const end = Math.max(dragFillStartIdx, dragFillCurrentIdx);
        const sourceRowId = rowIds[dragFillStartIdx];
        for (let i = start; i <= end; i++) {
          if (i === dragFillStartIdx) continue;
          copyRowData(sourceRowId, rowIds[i]);
        }
      }
      setIsDragFilling(false);
      setDragFillStartIdx(null);
      setDragFillCurrentIdx(null);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragFilling, dragFillStartIdx, dragFillCurrentIdx, rowIds]);

  const getCellClass = (rowId, idx, cellPos) => {
    const isSelected = selectedRowId === rowId;
    const isInDragRange = isDragFilling && 
      dragFillStartIdx !== null && 
      dragFillCurrentIdx !== null && 
      idx >= Math.min(dragFillStartIdx, dragFillCurrentIdx) && 
      idx <= Math.max(dragFillStartIdx, dragFillCurrentIdx);

    if (isSelected) {
      let borderClasses = "border-t-2 border-b-2 border-blue-600 bg-blue-50/20";
      if (cellPos === 'first') borderClasses += " border-l-2";
      if (cellPos === 'last') borderClasses += " border-r-2";
      return borderClasses;
    }
    if (isInDragRange) {
      let borderClasses = "border-t-2 border-b-2 border-dashed border-blue-400 bg-blue-100/50";
      if (cellPos === 'first') borderClasses += " border-l-2";
      if (cellPos === 'last') borderClasses += " border-r-2";
      return borderClasses;
    }
    return "";
  };

  const focusInput = (tab, fieldId) => {
    setActiveTab(tab); 
    if(!isSidebarOpen) setIsSidebarOpen(true);
    setHighlightedField(fieldId);
    setTimeout(() => { const el = inputRefs.current[fieldId]; if (el) { el.focus(); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } }, 100);
  };

  const updateGlobal = (field, value) => {
    setGlobalSpecs(prev => {
      const newState = { ...prev, [field]: value };
      if (field === 'trVolt') {
        const newVMatch = value.match(/(\d+)\s*Vac/i);
        if (newVMatch) {
          const voltVal = parseInt(newVMatch[1]);
          setCalVoltage(voltVal);
          setFeeders(prevFs => prevFs.map(f => ({ ...f, loadA: calculateAmps(f.loadKw, systemType, voltVal) })));
          newState.mdbIc = calculateMdbIc(prev.trKva, prev.trZk, voltVal);
        }
      } else if (field === 'trKva') {
        const zk = getIecImpedance(value);
        newState.trZk = zk;
        newState.mdbIc = calculateMdbIc(value, zk, calVoltage);
      } else if (field === 'trZk') {
        newState.mdbIc = calculateMdbIc(prev.trKva, value, calVoltage);
      } else if (field === 'mdbType') {
        if (value === 'Indoor') {
          newState.mdbSpec = 'Indoor IP31 Form 2A';
        } else if (value === 'Outdoor') {
          newState.mdbSpec = 'Outdoor IP54 Form 2A';
        }
      } else if (field === 'mdbSpec') {
        if (value.toLowerCase().includes('indoor')) {
          newState.mdbType = 'Indoor';
        } else if (value.toLowerCase().includes('outdoor')) {
          newState.mdbType = 'Outdoor';
        }
      }
      return newState;
    });
  };

  const updateMainCalData = (field, value) => {
    setGlobalSpecs(prev => {
        const newCal = { ...prev.mainCal, [field]: value };
        if (field === 'install') {
            newCal.ref = getInstallRef(value);
        }
        if (field === 'install' || field === 'cores' || field === 'size') {
          const cableType = 'CV(XLPE)-0.6/1kV'; 
          const fetchedAmp = ampacityDB[cableType]?.[newCal.install]?.[newCal.cores]?.[newCal.size];
          if (fetchedAmp !== undefined && fetchedAmp !== '') newCal.ampCable = fetchedAmp;
        }
        if (['circType', 'at', 'adjust', 'size', 'set'].includes(field)) {
          newCal.ground = getMainGroundSize(newCal.size, parseInt(newCal.set) || 1);
        }
        
        let newSpecs = { ...prev, mainCal: newCal };
        
        if (field === 'af' || field === 'at') {
            newSpecs.mainCbType = newCal.af >= 1000 ? "ACB 3P" : "MCCB 3P";
            newSpecs.busbar = `${newCal.af}A, 100%N, 25%G`;
        }

        // Auto step-up Transformer Logic
        const adj = newCal.adjust !== '' && !isNaN(newCal.adjust) ? parseFloat(newCal.adjust) : 1;
        const tripA = newCal.at * adj;

        const kvaMatch = String(newSpecs.trKva).replace(/,/g, '').match(/\d+(\.\d+)?/);
        let currentKva = kvaMatch ? parseFloat(kvaMatch[0]) : 0;
        const v = parseFloat(calVoltage) || 400;
        let trAmp = currentKva > 0 && v > 0 ? (currentKva * 1000) / (Math.sqrt(3) * v) : 0;

        if (tripA > trAmp && currentKva > 0) {
            const stdKva = [50, 100, 160, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000];
            let nextKva = stdKva.find(k => k > currentKva && ((k * 1000) / (Math.sqrt(3) * v)) >= tripA);
            
            if (!nextKva) {
                const currentIndex = stdKva.findIndex(k => k >= currentKva);
                if (currentIndex !== -1 && currentIndex < stdKva.length - 1) {
                    nextKva = stdKva[currentIndex + 1];
                }
            }
            
            if (nextKva) {
                newSpecs.trKva = `${nextKva.toLocaleString()} kVA`;
                newSpecs.trZk = getIecImpedance(newSpecs.trKva);
                newSpecs.mdbIc = calculateMdbIc(newSpecs.trKva, newSpecs.trZk, v);
            }
        }

        return newSpecs;
    });
  };

  const updateFeeder = (id, field, value) => {
    setFeeders(feeders.map(f => {
      if (f.id === id) {
        let updatedFeeder = { ...f, [field]: value };
        if (field === 'loadKw') {
            const newLoadA = calculateAmps(value, systemType, calVoltage);
            updatedFeeder.loadA = newLoadA;
            const newCal = runAutoSizing(updatedFeeder, value, newLoadA, systemType, calVoltage, globalPf, cableDB, ampacityDB, maxVd);
            updatedFeeder.cal = newCal;
            
            const adj = newCal.adjust !== '' && !isNaN(newCal.adjust) ? parseFloat(newCal.adjust) : 1;
            const coreM = systemType.includes('3P 4W') ? "4x" : systemType.includes('3P 3W') ? "3x" : (systemType.includes('DC') ? "2x" : "2x");
            const cableCoreStr = newCal.cores === '1C' ? `${coreM}1C` : newCal.cores;
            const sets = parseInt(newCal.set) || 1;
            updatedFeeder.cable1 = sets === 1 ? `${cableCoreStr}-${newCal.size} sq.mm., CV` : `${sets}(${cableCoreStr}-${newCal.size}) sq.mm., CV`;
            updatedFeeder.cable2 = `1C-${newCal.ground} sq.mm.,(G)`;
            updatedFeeder.ataf = `${newCal.at} AT / ${newCal.af} AF${adj !== 1 ? ` (Adj.${(newCal.at * adj).toFixed(0)}A)` : ''}`;
        }
        return updatedFeeder;
      }
      return f;
    }));
  };

  const updateCalData = (id, field, value) => {
    setFeeders(feeders.map(f => {
      if (f.id === id) {
        const newCal = { ...f.cal, [field]: value };
        if (field === 'install') {
            newCal.ref = getInstallRef(value);
        }
        if (field === 'install' || field === 'cores' || field === 'size') {
          const cableType = 'CV(XLPE)-0.6/1kV'; 
          const fetchedAmp = ampacityDB[cableType]?.[newCal.install]?.[newCal.cores]?.[newCal.size];
          if (fetchedAmp !== undefined && fetchedAmp !== '') newCal.ampCable = fetchedAmp;
        }
        if (['circType', 'at', 'adjust', 'size', 'set'].includes(field)) {
          if (newCal.circType === 'Main') newCal.ground = getMainGroundSize(newCal.size, parseInt(newCal.set) || 1);
          else {
            const adj = newCal.adjust !== '' && !isNaN(newCal.adjust) ? parseFloat(newCal.adjust) : 1;
            newCal.ground = getEquipmentGroundSize(newCal.at * adj);
          }
        }
        return { ...f, cal: newCal };
      }
      return f;
    }));
  };

  const renumberFeeders = (list) => {
    return list.map((f, idx) => {
      const newIndex = idx + 1;
      const newTitle = `Feeder ${newIndex}`;
      let newLoadTitle = f.loadTitle;
      if (/\d+$/.test(f.loadTitle)) {
        newLoadTitle = f.loadTitle.replace(/\d+$/, newIndex);
      }
      return {
        ...f,
        title: newTitle,
        loadTitle: newLoadTitle
      };
    });
  };

  const addFeeder = () => {
    const newId = feeders.length > 0 ? feeders[feeders.length - 1].id + 1 : 1;
    const newList = [...feeders, { ...feeders[0], id: newId, title: `Feeder ${newId}`, loadTitle: `Inverter ${newId}`, cal: {...initialCal} }];
    setFeeders(renumberFeeders(newList));
  };

  const removeFeeder = (id) => {
    if (window.confirm("คุณต้องการลบ Feeder นี้ใช่หรือไม่?")) {
      const remaining = feeders.filter(f => f.id !== id);
      setFeeders(renumberFeeders(remaining));
    }
  };
  const openCalModal = (id) => { setActiveCalFeederId(id); setIsCalModalOpen(true); };

  const handleApplyCalToDiagram = () => {
    setFeeders(feeders.map(f => {
      const adj = f.cal.adjust !== '' && !isNaN(f.cal.adjust) ? parseFloat(f.cal.adjust) : 1;
      const coreM = systemType.includes('3P 4W') ? "4x" : systemType.includes('3P 3W') ? "3x" : (systemType.includes('DC') ? "2x" : "2x");
      const cableCoreStr = f.cal.cores === '1C' ? `${coreM}1C` : f.cal.cores;
      const sets = parseInt(f.cal.set) || 1;
      const cable1 = sets === 1 ? `${cableCoreStr}-${f.cal.size} sq.mm., CV` : `${sets}(${cableCoreStr}-${f.cal.size}) sq.mm., CV`;
      return { ...f, ataf: `${f.cal.at} AT / ${f.cal.af} AF${adj !== 1 ? ` (Adj.${(f.cal.at * adj).toFixed(0)}A)` : ''}`, cable1, cable2: `1C-${f.cal.ground} sq.mm.,(G)`, install: f.cal.install };
    }));

    setGlobalSpecs(prev => {
        const newCal = prev.mainCal;
        const adj = newCal.adjust !== '' && !isNaN(newCal.adjust) ? parseFloat(newCal.adjust) : 1;
        const coreM = systemType.includes('3P 4W') ? "4x" : systemType.includes('3P 3W') ? "3x" : "2x";
        const cableCoreStr = newCal.cores === '1C' ? `${coreM}1C` : newCal.cores;
        const sets = parseInt(newCal.set) || 1;
        const mainPhaseCable = sets === 1 ? `${cableCoreStr}-${newCal.size} sq.mm., CV` : `${sets}(${cableCoreStr}-${newCal.size}) sq.mm., CV`;
        return {
            ...prev,
            mainPhaseCable,
            mainGroundCable: `1C-${newCal.ground} sq.mm.,(G)`,
            mainCbType: newCal.af >= 1000 ? "ACB 3P" : "MCCB 3P",
            mainCbAtAf: `${newCal.at}/${newCal.af} AT/AF${adj !== 1 ? ` (Adj.${(newCal.at * adj).toFixed(0)}A)` : ''}`,
            busbar: `${newCal.af}A, 100%N, 25%G`
        };
    });

    setIsCalModalOpen(false);
  };


  const inputEngineeringStyle = "w-full bg-[#f1f5f9] text-[#0f172a] border border-[#cbd5e1] rounded text-center focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono text-[13px] py-1 shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  const mainKw = totalLoadKw;
  const mainAmpV = totalLoadA;
  const mainFactor = parseFloat(globalSpecs.mainCal.factor) || 1.2;
  const mainTotalA = mainAmpV * mainFactor;
  const mainAmpDerate = (parseFloat(globalSpecs.mainCal.ampCable)||0) * (parseFloat(globalSpecs.mainCal.ca)||1) * (parseFloat(globalSpecs.mainCal.cg)||1) * (parseInt(globalSpecs.mainCal.set)||1);
  const mainAdj = globalSpecs.mainCal.adjust !== '' && !isNaN(globalSpecs.mainCal.adjust) ? parseFloat(globalSpecs.mainCal.adjust) : 1;
  const mainAtAdjustVal = globalSpecs.mainCal.at * mainAdj;
  const isMainAmpPass = mainAmpDerate >= mainAtAdjustVal;
  const mainVd = getCalculatedVd({ loadA: mainAmpV, cal: globalSpecs.mainCal }, systemType, calVoltage, globalPf, cableDB);

  // Login protection screen
  if (!currentUser) {
    return <AuthWall handleLoginUser={handleLoginUser} handleRegisterUser={handleRegisterUser} />;
  }

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden selection:bg-cyan-500 selection:text-white font-sarabun relative">
      
      {/* Floating Toggle Sidebar Button */}
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`absolute top-4 ${isSidebarOpen ? 'left-[436px]' : 'left-4'} z-50 p-2.5 rounded-xl shadow-2xl transition-all duration-300 border ${isSidebarOpen ? 'bg-[#1e293b] border-[#334155] text-cyan-400 hover:bg-[#334155]' : 'bg-white border-slate-200 text-slate-600 hover:text-cyan-600 hover:bg-cyan-50'}`}>
         {isSidebarOpen ? <ChevronLeft className="w-5 h-5"/> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar - Collapsible */}
      <div className={`bg-[#1e293b] border-r border-[#334155] shadow-2xl z-20 flex flex-col shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'w-[420px]' : 'w-0 border-r-0'}`}>
        <div className="w-[420px] flex flex-col h-full shrink-0">
          <div className="p-5 border-b border-[#334155] bg-[#0f172a] flex-shrink-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Settings2 className="w-24 h-24" /></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2 rounded-lg shadow-lg">
                  <Layout className="w-6 h-6 text-white" />
              </div>
              <div>
                  <h1 className="text-xl font-black tracking-tight text-white leading-tight">SLD STUDIO Pro</h1>
                  <p className="text-[11px] text-cyan-400 mt-0.5 uppercase tracking-widest font-semibold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 animate-pulse" /> Solar Design Studio
                  </p>
              </div>
            </div>

            {/* User Profile Section */}
            <div className="flex items-center justify-between mt-4 bg-[#1e293b]/80 border border-[#334155]/60 rounded-xl px-3.5 py-2 relative z-10 backdrop-blur-sm shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm border border-cyan-500/30 shadow-inner">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="text-[12px] font-bold text-white truncate max-w-[150px] leading-tight">{currentUser.name}</div>
                  <span className={`inline-block text-[9px] font-extrabold px-1.5 py-0.5 mt-0.5 rounded uppercase tracking-wider ${
                    currentUser.role === 'Admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                    currentUser.role === 'Viewer' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
              </div>
              <button onClick={handleLogoutUser} className="text-[10px] font-black text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> LOG OUT
              </button>
            </div>
            
            {/* Top Action Bar for Export/Import */}
            <div className="flex gap-2 mt-4 relative z-10 flex-wrap">
               <button onClick={() => loadProjectInputRef.current?.click()} className="flex-1 min-w-[50px] flex items-center justify-center gap-1.5 bg-[#1e293b] hover:bg-cyan-900/50 text-cyan-400 border border-cyan-800/50 py-1.5 rounded-md text-[11px] font-bold transition-all"><FolderOpen className="w-3.5 h-3.5"/> Load</button>
               <input type="file" ref={loadProjectInputRef} onChange={handleLoadProject} accept=".json" className="hidden" />
               <button onClick={handleSaveProject} className="flex-1 min-w-[50px] flex items-center justify-center gap-1.5 bg-[#1e293b] hover:bg-emerald-900/50 text-emerald-400 border border-emerald-800/50 py-1.5 rounded-md text-[11px] font-bold transition-all"><Save className="w-3.5 h-3.5"/> Save</button>
               
               <button onClick={handleExportCSV} className="flex-1 min-w-[50px] flex items-center justify-center gap-1.5 bg-[#1e293b] hover:bg-blue-900/50 text-blue-400 border border-blue-800/50 py-1.5 rounded-md text-[11px] font-bold transition-all"><FileSpreadsheet className="w-3.5 h-3.5"/> CSV</button>
               <button onClick={handleExportHTML} className="flex-1 min-w-[50px] flex items-center justify-center gap-1.5 bg-[#1e293b] hover:bg-orange-900/50 text-orange-400 border border-orange-800/50 py-1.5 rounded-md text-[11px] font-bold transition-all"><Globe className="w-3.5 h-3.5"/> HTML</button>
               <button onClick={handleExportPDF} className="flex-1 min-w-[50px] flex items-center justify-center gap-1.5 bg-[#1e293b] hover:bg-red-900/50 text-red-400 border border-red-800/50 py-1.5 rounded-md text-[11px] font-bold transition-all"><FileText className="w-3.5 h-3.5"/> PDF</button>
               <button onClick={() => handleExportImage('png')} className="flex-1 min-w-[50px] flex items-center justify-center gap-1.5 bg-[#1e293b] hover:bg-teal-900/50 text-teal-400 border border-teal-800/50 py-1.5 rounded-md text-[11px] font-bold transition-all"><ImageIcon className="w-3.5 h-3.5"/> PNG</button>
               <button onClick={() => handleExportImage('jpeg')} className="flex-1 min-w-[50px] flex items-center justify-center gap-1.5 bg-[#1e293b] hover:bg-yellow-900/50 text-yellow-400 border border-yellow-800/50 py-1.5 rounded-md text-[11px] font-bold transition-all"><Camera className="w-3.5 h-3.5"/> JPEG</button>
               <button onClick={() => setIsSummaryModalOpen(true)} className="flex-1 min-w-[50px] flex items-center justify-center gap-1.5 bg-[#1e293b] hover:bg-purple-900/50 text-purple-400 border border-purple-800/50 py-1.5 rounded-md text-[11px] font-bold transition-all"><ClipboardList className="w-3.5 h-3.5"/> Summary</button>
            </div>
          </div>

          <div className="flex bg-[#1e293b] border-b border-[#334155] flex-shrink-0 shadow-sm relative z-10 flex-wrap">
            <button onClick={() => setActiveTab('global')} className={`flex-1 min-w-[20%] py-3.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'global' ? 'text-cyan-400 border-cyan-400 bg-[#2d3748]' : 'text-slate-400 border-transparent hover:bg-[#2d3748]/50'}`}>Global</button>
            <button onClick={() => setActiveTab('feeders')} className={`flex-1 min-w-[20%] py-3.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 flex items-center justify-center gap-1.5 ${activeTab === 'feeders' ? 'text-cyan-400 border-cyan-400 bg-[#2d3748]' : 'text-slate-400 border-transparent hover:bg-[#2d3748]/50'}`}>Feeders <span className="bg-slate-700 text-white text-[9px] px-1.5 py-0.5 rounded-full">{feeders.length}</span></button>
            <button onClick={() => setActiveTab('raceways')} className={`flex-1 min-w-[20%] py-3.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 flex items-center justify-center gap-1.5 ${activeTab === 'raceways' ? 'text-amber-400 border-amber-400 bg-[#2d3748]' : 'text-slate-400 border-transparent hover:bg-[#2d3748]/50'}`}><Columns className="w-3.5 h-3.5"/> Raceways</button>
            <button onClick={() => setActiveTab('database')} className={`flex-1 min-w-[20%] py-3.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'database' ? 'text-purple-400 border-purple-400 bg-[#2d3748]' : 'text-slate-400 border-transparent hover:bg-[#2d3748]/50'}`}>DB</button>
            {currentUser && currentUser.role === 'Admin' && (
              <button onClick={() => setActiveTab('users')} className={`flex-1 min-w-[20%] py-3.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 flex items-center justify-center gap-1 ${activeTab === 'users' ? 'text-rose-400 border-rose-400 bg-[#2d3748]' : 'text-slate-400 border-transparent hover:bg-[#2d3748]/50'}`}><Users className="w-3.5 h-3.5" /> Users</button>
            )}
          </div>

          <div className="p-4 space-y-6 overflow-y-auto flex-1 bg-[#1e293b] custom-scrollbar">
            {activeTab === 'global' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-left duration-200">
                <section className="border border-[#334155] rounded-xl overflow-hidden shadow-lg bg-[#2d3748]/30">
                  <SectionHeader icon={FileText} title="Project Details" colorClass="text-emerald-400" />
                  <div className="p-0 border-b border-[#334155]">
                    <SidebarTableRow id="projectName" label="Project Name" value={globalSpecs.projectName} onChange={(v) => updateGlobal('projectName', v)} highlightedField={highlightedField} setHighlightedField={setHighlightedField} inputRef={el => inputRefs.current['projectName'] = el} />
                  </div>
                  <SectionHeader icon={Cpu} title="Transformer & Solar Specs" colorClass="text-cyan-400" />
                  <div className="p-3 bg-slate-800/40 border-b border-[#334155] flex items-center justify-between gap-4">
                    <span className="text-[12px] font-bold text-slate-300">หม้อแปลง (Transformer)</span>
                    <div className="flex bg-[#1e293b] p-0.5 rounded-lg border border-[#334155]">
                      <button 
                        type="button"
                        onClick={() => updateGlobal('hasTransformer', true)}
                        className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${globalSpecs.hasTransformer !== false ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        มี (Yes)
                      </button>
                      <button 
                        type="button"
                        onClick={() => updateGlobal('hasTransformer', false)}
                        className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${globalSpecs.hasTransformer === false ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        ไม่มี (No)
                      </button>
                    </div>
                  </div>
                  <div className="p-0">
                    <SidebarTableRow id="trTitle" label="TR ID" value={globalSpecs.trTitle} onChange={(v) => updateGlobal('trTitle', v)} highlightedField={highlightedField} setHighlightedField={setHighlightedField} inputRef={el => inputRefs.current['trTitle'] = el} disabled={globalSpecs.hasTransformer === false} />
                    <SidebarTableRow id="trKva" label="Rating (kVA)" value={globalSpecs.trKva} onChange={(v) => updateGlobal('trKva', v)} highlightedField={highlightedField} setHighlightedField={setHighlightedField} inputRef={el => inputRefs.current['trKva'] = el} disabled={globalSpecs.hasTransformer === false} list="trKva-list" />
                    <datalist id="trKva-list">
                      {["30 kVA", "50 kVA", "100 kVA", "160 kVA", "250 kVA", "315 kVA", "400 kVA", "500 kVA", "630 kVA", "800 kVA", "1,000 kVA", "1,250 kVA", "1,500 kVA", "1,600 kVA", "2,000 kVA", "2,500 kVA", "3,000 kVA", "3,150 kVA", "4,000 kVA", "5,000 kVA", "6,300 kVA", "8,000 kVA", "10,000 kVA"].map(val => (
                        <option key={val} value={val} />
                      ))}
                    </datalist>
                    <SidebarTableRow id="trVolt" label="Voltage Info" value={globalSpecs.trVolt} onChange={(v) => updateGlobal('trVolt', v)} type="textarea" highlightedField={highlightedField} setHighlightedField={setHighlightedField} inputRef={el => inputRefs.current['trVolt'] = el} disabled={globalSpecs.hasTransformer === false} />
                    <SidebarTableRow id="trVector" label="Vector & Tap" value={globalSpecs.trVector} onChange={(v) => updateGlobal('trVector', v)} highlightedField={highlightedField} setHighlightedField={setHighlightedField} inputRef={el => inputRefs.current['trVector'] = el} disabled={globalSpecs.hasTransformer === false} />
                    <SidebarTableRow id="trZk" label="Impedance (%Z)" value={globalSpecs.trZk} onChange={(v) => updateGlobal('trZk', v)} highlightedField={highlightedField} setHighlightedField={setHighlightedField} inputRef={el => inputRefs.current['trZk'] = el} disabled={globalSpecs.hasTransformer === false} />
                    {globalSpecs.hasTransformer !== false && (() => {
                      const { hvAmp, lvAmp } = calculateTransformerCurrents(globalSpecs.trKva, globalSpecs.trVolt);
                      return (
                        <>
                          <div className="grid grid-cols-[100px_10px_1fr] items-center gap-2 border-b border-[#2d3748] py-2 px-3 bg-[#0f172a]/20">
                            <label className="text-[12px] font-semibold text-slate-400 tracking-wide">HV Current (FLC)</label>
                            <div className="text-slate-500 font-bold text-[12px] text-center">:</div>
                            <div className="text-[13px] font-mono font-bold text-rose-400">{hvAmp.toFixed(2)} A</div>
                          </div>
                          <div className="grid grid-cols-[100px_10px_1fr] items-center gap-2 border-b border-[#2d3748] py-2 px-3 bg-[#0f172a]/20">
                            <label className="text-[12px] font-semibold text-slate-400 tracking-wide">LV Current (FLC)</label>
                            <div className="text-slate-500 font-bold text-[12px] text-center">:</div>
                            <div className="text-[13px] font-mono font-bold text-emerald-400">{lvAmp.toFixed(2)} A</div>
                          </div>
                        </>
                      );
                    })()}
                    {globalSpecs.hasTransformer === false && (
                      <SidebarTableRow id="existingMdbText" label="ข้อความชี้ไป" value={globalSpecs.existingMdbText || "To Existing MDB-03"} onChange={(v) => updateGlobal('existingMdbText', v)} highlightedField={highlightedField} setHighlightedField={setHighlightedField} inputRef={el => inputRefs.current['existingMdbText'] = el} />
                    )}
                  </div>
                </section>
                 <section className="border border-[#334155] rounded-xl overflow-hidden shadow-lg bg-[#2d3748]/30">
                   <SectionHeader icon={Database} title="MDB Settings" colorClass="text-indigo-400" />
                   <div className="p-3 bg-slate-800/40 border-b border-[#334155] flex items-center justify-between gap-4">
                     <span className="text-[12px] font-bold text-slate-300">ตู้ MDB (Cabinet Type)</span>
                     <div className="flex bg-[#1e293b] p-0.5 rounded-lg border border-[#334155]">
                       <button 
                         type="button"
                         onClick={() => updateGlobal('mdbType', 'Indoor')}
                         className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${globalSpecs.mdbType === 'Indoor' ? 'bg-[#6366f1] text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                       >
                         Indoor (ภายใน)
                       </button>
                       <button 
                         type="button"
                         onClick={() => updateGlobal('mdbType', 'Outdoor')}
                         className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${globalSpecs.mdbType !== 'Indoor' ? 'bg-[#6366f1] text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                       >
                         Outdoor (ภายนอก)
                       </button>
                     </div>
                   </div>
                   <div className="p-0">
                     <SidebarTableRow id="mdbTitle" label="MDB ID" value={globalSpecs.mdbTitle} onChange={(v) => updateGlobal('mdbTitle', v)} highlightedField={highlightedField} setHighlightedField={setHighlightedField} inputRef={el => inputRefs.current['mdbTitle'] = el} />
                     <SidebarTableRow id="mdbSpec" label="Form / IP" value={globalSpecs.mdbSpec} onChange={(v) => updateGlobal('mdbSpec', v)} highlightedField={highlightedField} setHighlightedField={setHighlightedField} inputRef={el => inputRefs.current['mdbSpec'] = el} />
                      <SidebarTableRow id="mdbIc" label="Short Circuit" value={globalSpecs.mdbIc} onChange={(v) => updateGlobal('mdbIc', v)} highlightedField={highlightedField} setHighlightedField={setHighlightedField} inputRef={el => inputRefs.current['mdbIc'] = el} />
                      <div className="grid grid-cols-[100px_10px_1fr] items-center gap-2 border-b border-[#2d3748] py-2.5 px-3 bg-[#0f172a]/20">
                        <label className="text-[12px] font-semibold text-slate-300 tracking-wide">Main Breaker</label>
                        <div className="text-slate-500 font-bold text-[12px] text-center">:</div>
                        <div className="text-[13px] font-mono font-bold text-cyan-400">
                          {globalSpecs.mainCbType} {globalSpecs.mainCal.at} AT / {globalSpecs.mainCal.af} AF
                        </div>
                      </div>

                      {(() => {
                        if (globalSpecs.hasTransformer === false) return null;
                        const { lvAmp } = calculateTransformerCurrents(globalSpecs.trKva, globalSpecs.trVolt);
                        if (globalSpecs.mainCal.at > lvAmp) {
                          return (
                            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl m-3 flex flex-col gap-1.5 animate-pulse">
                              <div className="flex items-center gap-2 text-amber-400 font-bold text-[11px]">
                                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
                                <span>คำเตือน: AT Main Breaker เกินขนาดหม้อแปลง</span>
                              </div>
                              <p className="text-[10px] text-slate-300 leading-relaxed">
                                ค่า AT Main Breaker (${globalSpecs.mainCal.at} A) มีค่ามากกว่ากระแสด้านแรงต่ำของหม้อแปลง (${lvAmp.toFixed(1)} A)
                                กรุณาปรับลดขนาด AT Main Breaker หรือเพิ่มขนาดพิกัดหม้อแปลงไฟฟ้า
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })()}
                   </div>
                 </section>
                {feeders.length > 1 && (
                  <section className="border border-[#334155] rounded-xl overflow-hidden shadow-lg bg-[#2d3748]/30">
                    <SectionHeader icon={Settings2} title="Busbar Spec" colorClass="text-emerald-400" />
                    <div className="p-0">
                      <SidebarTableRow id="busbar" label="Busbar Info" value={globalSpecs.busbar} onChange={(v) => updateGlobal('busbar', v)} highlightedField={highlightedField} setHighlightedField={setHighlightedField} inputRef={el => inputRefs.current['busbar'] = el} />
                    </div>
                  </section>
                )}
              </div>
            )}
            
            {activeTab === 'feeders' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right duration-200">
                {currentUser.role !== 'Viewer' && (
                  <button onClick={addFeeder} className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl flex items-center justify-center gap-2 hover:from-cyan-500 hover:to-blue-500 font-bold text-[13px] shadow-lg shadow-cyan-900/50 transition-all border border-cyan-400/30">
                    <Plus className="w-4 h-4" /> ADD FEEDER CIRCUIT
                  </button>
                )}
                
                {feeders.map((f, idx) => (
                  <div key={f.id} className={`border rounded-xl overflow-hidden transition-all shadow-lg ${highlightedField?.startsWith(`f-${f.id}`) ? 'ring-2 ring-cyan-400 border-cyan-400 bg-[#1e293b]' : 'border-[#334155] bg-[#2d3748]/30'}`}>
                    <div className="bg-[#1a202c] px-4 py-2.5 border-b border-[#334155] flex justify-between items-center">
                      <span className="text-[12px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-500"></div> FEEDER {idx + 1}</span>
                      <div className="flex items-center gap-1.5">
                        {currentUser.role !== 'Viewer' && (
                          <>
                            <button onClick={() => moveFeeder(idx, -1)} className="text-slate-400 hover:text-white hover:bg-slate-700 p-1 rounded-md transition-all"><ArrowUp className="w-3.5 h-3.5" /></button>
                            <button onClick={() => moveFeeder(idx, 1)} className="text-slate-400 hover:text-white hover:bg-slate-700 p-1 rounded-md transition-all mr-2"><ArrowDown className="w-3.5 h-3.5" /></button>
                          </>
                        )}
                        <button onClick={() => openCalModal(f.id)} className="flex items-center gap-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm hover:bg-blue-600 hover:text-white transition-all"><Calculator className="w-3.5 h-3.5" /> CALC</button>
                        {currentUser.role !== 'Viewer' && (
                          <button onClick={() => removeFeeder(f.id)} className="text-red-400/70 hover:text-red-400 hover:bg-red-400/10 p-1.5 rounded-md transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                        )}
                      </div>
                    </div>
                    <div className="p-0">
                      <SidebarTableRow id={`f-${f.id}-title`} label="Feeder ID" value={f.title} onChange={(v) => updateFeeder(f.id, 'title', v)} highlightedField={highlightedField} setHighlightedField={setHighlightedField} inputRef={el => inputRefs.current[`f-${f.id}-title`] = el} />
                      <SidebarTableRow id={`f-${f.id}-loadTitle`} label="Load Name" value={f.loadTitle} onChange={(v) => updateFeeder(f.id, 'loadTitle', v)} highlightedField={highlightedField} setHighlightedField={setHighlightedField} inputRef={el => inputRefs.current[`f-${f.id}-loadTitle`] = el} />
                      <SidebarTableRow id={`f-${f.id}-loadKw`} label="Load" value={f.loadKw} onChange={(v) => updateFeeder(f.id, 'loadKw', v)} suffix="kW" highlightedField={highlightedField} setHighlightedField={setHighlightedField} inputRef={el => inputRefs.current[`f-${f.id}-loadKw`] = el} />
                      
                      <div className="grid grid-cols-[100px_10px_1fr] items-center gap-2 border-b border-[#334155] p-3 bg-[#0f172a]/40">
                          <label className="text-[11px] font-bold text-slate-400 tracking-wide">Calc. Current</label>
                          <div className="text-slate-600 text-center">:</div>
                          <div className="text-[13px] font-mono font-bold text-cyan-400">{f.loadA} A <span className="text-[10px] font-normal text-slate-500 italic ml-1 font-sans">(@{getSystemVoltage()}V)</span></div>
                      </div>

                      <SidebarTableRow id={`f-${f.id}-ataf`} label="MCCB Spec" value={f.ataf} onChange={(v) => updateFeeder(f.id, 'ataf', v)} highlightedField={highlightedField} setHighlightedField={setHighlightedField} inputRef={el => inputRefs.current[`f-${f.id}-ataf`]} />
                      <SidebarTableRow id={`f-${f.id}-cable1`} label="Phase Cable" value={f.cable1} onChange={(v) => updateFeeder(f.id, 'cable1', v)} highlightedField={highlightedField} setHighlightedField={setHighlightedField} inputRef={el => inputRefs.current[`f-${f.id}-cable1`]} type="textarea" />
                      <SidebarTableRow id={`f-${f.id}-cable2`} label="Ground Cable" value={f.cable2} onChange={(v) => updateFeeder(f.id, 'cable2', v)} highlightedField={highlightedField} setHighlightedField={setHighlightedField} inputRef={el => inputRefs.current[`f-${f.id}-cable2`]} />
                      <SidebarTableRow id={`f-${f.id}-install`} label="Installation" value={f.install} onChange={(v) => updateFeeder(f.id, 'install', v)} highlightedField={highlightedField} setHighlightedField={setHighlightedField} inputRef={el => inputRefs.current[`f-${f.id}-install`]} />
                      
                      <div className="grid grid-cols-[100px_10px_1fr] items-center gap-2 border-b border-[#334155] p-3 bg-[#0f172a]/40">
                          <label className="text-[11px] font-bold text-slate-400 tracking-wide">Volt. Drop</label>
                          <div className="text-slate-600 text-center">:</div>
                          <div className={`text-[13px] font-mono font-bold ${getCalculatedVd(f, systemType, calVoltage, globalPf, cableDB) > (parseFloat(maxVd) || 2.5) ? 'text-red-400' : 'text-emerald-400'}`}>
                            {getCalculatedVd(f, systemType, calVoltage, globalPf, cableDB).toFixed(2)} % <span className="text-[10px] font-normal text-slate-500 italic ml-1 font-sans">(Max {maxVd}%)</span>
                          </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'raceways' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
                 <div className="bg-[#1a202c] rounded-xl p-4 border border-[#334155] shadow-lg flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2"><Columns className="w-4 h-4"/> Raceway Dashboard</h3>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">ดูตารางขนาดรางไฟแบบเต็มที่ Canvas ด้านขวา <br/>เพื่อปรับแก้ (Override) ขนาดรางแบบ Manual</p>
                    </div>
                    <Calculator className="w-8 h-8 text-[#334155]" />
                 </div>

                 {(() => {
                   const mainR = calculateRaceway(globalSpecs.mainCal, systemType, cableOD, conduitSizes, traySizes);
                   return (
                     <div className="border border-indigo-500/30 rounded-xl overflow-hidden shadow-lg bg-[#2d3748]/30">
                        <div className="bg-indigo-900/30 px-4 py-2 border-b border-indigo-500/30 flex justify-between items-center">
                          <span className="text-[12px] font-bold text-indigo-300 uppercase tracking-widest">Main Incomer</span>
                          <span className="text-[10px] font-bold bg-indigo-500 text-white px-2 py-0.5 rounded-full">{mainR.type}</span>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex justify-between items-center border-b border-[#334155] pb-2">
                             <span className="text-[11px] text-slate-400">Total {mainR.type === 'Conduit' ? 'Area/Set' : 'Width'}:</span>
                             <span className="text-[13px] font-mono font-bold text-cyan-400">{mainR.calcValue} {mainR.unit}</span>
                          </div>
                          <div className="flex justify-between items-center bg-indigo-500/10 p-2 rounded border border-indigo-500/20 mt-2">
                             <span className="text-[12px] font-bold text-indigo-300">Selected Size:</span>
                             <span className="text-[13px] font-black text-white text-right">{mainR.finalSize}</span>
                          </div>
                        </div>
                     </div>
                   );
                 })()}

                 {feeders.map((f, idx) => {
                   const fR = getFeederRacewaySize(f, idx);
                   return (
                     <div key={f.id} className="border border-[#334155] rounded-xl overflow-hidden shadow-lg bg-[#2d3748]/30">
                        <div className="bg-[#1a202c] px-4 py-2 border-b border-[#334155] flex justify-between items-center">
                          <span className="text-[12px] font-bold text-slate-300 uppercase tracking-widest">{f.title}</span>
                          <span className="text-[10px] font-bold bg-slate-600 text-white px-2 py-0.5 rounded-full">{fR.type}</span>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex justify-between items-center bg-amber-500/10 p-2 rounded border border-amber-500/20 mt-2">
                             <span className="text-[12px] font-bold text-amber-400">Selected Size:</span>
                             <span className="text-[13px] font-black text-white text-right">{fR.finalSize}</span>
                          </div>
                        </div>
                     </div>
                   );
                 })}
              </div>
            )}

            {activeTab === 'database' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-right duration-200">
                <h3 className="text-[11px] font-black text-slate-500 tracking-widest mb-4 px-2 uppercase flex items-center gap-2"><Settings2 className="w-3 h-3"/> System Database</h3>
                {['Cable data', 'Raceway', 'EIT Table', 'Transformer', 'Dropout fuse'].map(item => (
                   <button key={item} onClick={() => setDbSubTab(item)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[13px] font-bold transition-all shadow-md border ${dbSubTab === item ? 'bg-purple-600/20 text-purple-300 border-purple-500/50' : 'bg-[#2d3748] text-slate-400 border-[#334155] hover:bg-[#334155]'}`}>
                      <Server className={`w-5 h-5 ${dbSubTab === item ? 'text-purple-400' : 'text-slate-500'}`} />
                      {item}
                   </button>
                ))}

              </div>
            )}


            {activeTab === 'users' && currentUser && currentUser.role === 'Admin' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[11px] font-black text-slate-500 tracking-widest uppercase flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-rose-400"/> User Management ({usersList.length})
                  </h3>
                  <button 
                    onClick={handleFetchUsers} 
                    disabled={isLoadingUsers} 
                    className="p-1.5 bg-[#2d3748] hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
                    title="Reload users list"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {isLoadingUsers ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500 gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                    <span className="text-xs">กำลังโหลดรายชื่อผู้ใช้...</span>
                  </div>
                ) : usersList.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    ไม่พบรายชื่อผู้ใช้งานในระบบ
                  </div>
                ) : (
                  <div className="space-y-3">
                    {usersList.map((user: any) => {
                      const isSelf = user.email.toLowerCase() === currentUser.email.toLowerCase();
                      return (
                        <div key={user.email} className="bg-[#2d3748] rounded-xl p-3.5 border border-[#334155] shadow-md space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                {user.name} 
                                {isSelf && <span className="bg-slate-600 text-[9px] text-slate-300 px-1 py-0.2 rounded font-normal">คุณ</span>}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">{user.email}</div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                user.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {user.status === 'Approved' ? 'Approved' : 'Pending Approval'}
                              </span>
                              <span className="text-[9px] text-slate-500 font-mono">
                                Role: <span className="font-bold text-slate-300">{user.role}</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2 border-t border-[#334155]/60 flex-wrap">
                            {user.status === 'Pending' && (
                              <button 
                                onClick={() => handleUpdateUserStatus(user.email, 'Approved', '')}
                                className="flex-1 min-w-[70px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] py-1.5 rounded-lg shadow transition-all flex items-center justify-center gap-1"
                              >
                                <Check className="w-3 h-3" /> Approve
                              </button>
                            )}
                            
                            {!isSelf && (
                              <>
                                <select 
                                  value={user.role} 
                                  onChange={(e) => handleUpdateUserStatus(user.email, '', e.target.value)}
                                  className="bg-[#1a202c] text-slate-300 text-[10px] font-bold rounded-lg px-2 py-1 border border-[#334155] focus:outline-none focus:border-cyan-500 transition-all cursor-pointer h-[28px]"
                                >
                                  <option value="Admin">Admin</option>
                                  <option value="User">User</option>
                                  <option value="Viewer">Viewer</option>
                                </select>

                                <button 
                                  onClick={() => handleDeleteUser(user.email)}
                                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-[10px] px-2.5 py-1.5 rounded-lg border border-red-500/20 transition-all flex items-center gap-1 h-[28px] ml-auto"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Main Canvas - Blueprint Style */}
      <div className={`flex-1 overflow-hidden flex justify-center items-start relative ${['database','raceways'].includes(activeTab) ? 'bg-[#0f172a] p-8' : 'bg-[#e2e8f0]'}`}
           onWheel={!['database','raceways'].includes(activeTab) ? handleWheel : undefined}
           onMouseDown={!['database','raceways'].includes(activeTab) ? handleMouseDown : undefined}
           onMouseMove={!['database','raceways'].includes(activeTab) ? handleMouseMove : undefined}
           onMouseUp={!['database','raceways'].includes(activeTab) ? handleMouseUp : undefined}
           onMouseLeave={handleMouseUp}>
        
        {['database','raceways'].includes(activeTab) ? (
          <div className="w-full max-w-full space-y-6 animate-in fade-in zoom-in-95 duration-200 h-full flex flex-col pl-12 pr-6">
            <div className="bg-[#1e293b] rounded-2xl shadow-xl border border-[#334155] p-6 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center border shadow-inner ${activeTab === 'raceways' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-purple-500/20 text-purple-400 border-purple-500/30'}`}>
                  {activeTab === 'raceways' ? <Columns className="w-7 h-7" /> : <Server className="w-7 h-7" />}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase">{activeTab === 'raceways' ? 'RACEWAY CALCULATION' : dbSubTab}</h2>
                  <p className="text-[13px] text-slate-400 mt-1">{activeTab === 'raceways' ? 'Auto calculated raceway dimensions for Main & Feeders based on EIT' : 'Manage electrical specifications & standards data'}</p>
                </div>
              </div>
              {activeTab === 'database' && currentUser.role === 'Admin' && (
                <button onClick={() => setIsDbEditMode(!isDbEditMode)} className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg border transition-all shadow-md ${isDbEditMode ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 hover:bg-amber-500/30' : 'bg-[#334155] text-slate-200 border-[#475569] hover:bg-[#475569]'}`}>
                  <Edit className="w-4 h-4" /> {isDbEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
                </button>
              )}
            </div>
            
            {activeTab === 'raceways' ? (
              <div className="flex gap-6 flex-1 min-h-0 w-full overflow-hidden">
                {/* Left side: Table */}
                <div className="flex-[7] bg-[#1e293b] rounded-2xl shadow-xl border border-[#334155] overflow-hidden flex flex-col min-h-0">
                  <div className="overflow-auto custom-scrollbar flex-1">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead className="sticky top-0 z-10 shadow-sm">
                        <tr className="bg-[#0f172a] text-slate-300 text-[12px] uppercase tracking-wider font-bold">
                          <th className="py-4 px-4 border-r border-[#334155] min-w-[160px] w-[180px]">Circuit Name</th>
                          <th className="py-4 px-4 border-r border-[#334155] min-w-[120px] w-[130px]">Raceway Type</th>
                          <th className="py-4 px-4 border-r border-[#334155] min-w-[220px] w-[240px]">Cable Configuration</th>
                          <th className="py-4 px-4 border-r border-[#334155] bg-[#1e293b] min-w-[220px] w-[240px]">Calculated Size ({systemType.includes('3P') ? '3-Phase' : '1-Phase'})</th>
                          <th className="py-4 px-4 border-r border-[#334155] text-amber-400 bg-amber-900/10 min-w-[220px] w-[240px]">Recommended Raceway</th>
                        </tr>
                      </thead>
                      <tbody className="bg-[#1e293b]">
                        {(() => {
                           const mR = calculateRaceway(globalSpecs.mainCal, systemType, cableOD, conduitSizes, traySizes);
                           return (
                            <tr className="text-[13px] border-b border-[#334155] bg-indigo-900/10 hover:bg-indigo-900/20 transition-colors">
                              <td className="py-4 px-4 font-bold text-indigo-300 border-r border-[#334155]">MAIN INCOMER</td>
                              <td className="py-4 px-4 text-slate-300 border-r border-[#334155]"><span className="bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full text-[11px] font-bold border border-indigo-500/30">{mR.type}</span></td>
                              <td className="py-4 px-4 text-slate-300 border-r border-[#334155] font-mono text-[12px]">{globalSpecs.mainPhaseCable} <br/> <span className="text-emerald-400">{globalSpecs.mainGroundCable}</span></td>
                              <td className="py-4 px-4 text-slate-400 border-r border-[#334155] bg-[#1a202c]">
                                {mR.type === 'Conduit' ? `Total Area/Set = ` : `Total Width = `}
                                <span className="text-cyan-400 font-bold font-mono">{mR.calcValue} {mR.unit}</span>
                                {mR.spareInfo && <span className="text-slate-500 ml-2 text-[12px] font-mono">{mR.spareInfo}</span>}
                              </td>
                              <td className="py-4 px-4 bg-amber-900/10 border-r border-[#334155]">
                                <input 
                                  list="main-opts"
                                  value={globalSpecs.mainCal.racewayOverride || ""}
                                  onChange={(e) => updateMainCalData('racewayOverride', e.target.value)}
                                  placeholder={`Auto: ${mR.requiredSize}`}
                                  className="w-full bg-transparent border border-amber-500/50 text-amber-300 placeholder-amber-600/50 rounded px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 font-bold text-[13px]"
                                />
                                <datalist id="main-opts">
                                  {mR.type === 'Conduit' 
                                     ? conduitSizes.map(c => {
                                         const sets = parseInt(globalSpecs.mainCal.set) || 1;
                                         return <option key={c.size} value={`${sets > 1 ? sets + ' x ' : ''}${c.size} IMC/EMT`} />
                                       })
                                     : traySizes.map(t => <option key={t} value={`Tray/Ladder ${t} mm`} />)
                                  }
                                </datalist>
                              </td>
                            </tr>
                           );
                        })()}
                        
                        {feeders.map((f, index) => {
                           const fR = getFeederRacewaySize(f, index);
                           return (
                            <tr key={f.id} className="text-[13px] border-b border-[#334155] hover:bg-[#2d3748] transition-colors">
                              <td className="py-4 px-4 font-bold text-slate-200 border-r border-[#334155]">
                                <div className="flex items-center flex-wrap gap-1.5">
                                  <span>{f.title}</span>
                                  {fR.isGrouped && (
                                    <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-bold border border-amber-500/30 whitespace-nowrap">
                                      {fR.groupLabel}
                                    </span>
                                  )}
                                </div>
                                <span className="text-slate-500 text-[11px] font-normal block">{f.loadTitle}</span>
                              </td>
                              <td className="py-4 px-4 text-slate-300 border-r border-[#334155]"><span className="bg-slate-700 text-slate-200 px-2.5 py-1 rounded-full text-[11px] font-bold border border-slate-600">{fR.type}</span></td>
                              <td className="py-4 px-4 text-slate-300 border-r border-[#334155] font-mono text-[12px]">{f.cable1} <br/> <span className="text-emerald-400">{f.cable2}</span></td>
                              <td className="py-4 px-4 text-slate-400 border-r border-[#334155] bg-[#1a202c]">
                                {fR.type === 'Conduit' ? `Total Area/Set = ` : `Total Width = `}
                                <span className="text-cyan-400 font-bold font-mono">{fR.calcValue} {fR.unit}</span>
                                {fR.spareInfo && <span className="text-slate-500 ml-2 text-[12px] font-mono">{fR.spareInfo}</span>}
                              </td>
                              <td className="py-4 px-4 bg-amber-900/5 border-r border-[#334155]">
                                <input 
                                  list={`opts-${f.id}`}
                                  value={f.cal.racewayOverride || ""}
                                  onChange={(e) => updateCalData(f.id, 'racewayOverride', e.target.value)}
                                  placeholder={`Auto: ${fR.requiredSize}`}
                                  className="w-full bg-transparent border border-amber-500/50 text-amber-400 placeholder-amber-700/50 rounded px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 font-bold text-[13px]"
                                />
                                <datalist id={`opts-${f.id}`}>
                                  {fR.type === 'Conduit' 
                                     ? conduitSizes.map(c => {
                                         const sets = parseInt(f.cal.set) || 1;
                                         return <option key={c.size} value={`${sets > 1 ? sets + ' x ' : ''}${c.size} IMC/EMT`} />
                                       })
                                     : traySizes.map(t => <option key={t} value={`Tray/Ladder ${t} mm`} />)
                                  }
                                </datalist>
                              </td>
                            </tr>
                           );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 bg-amber-500/10 border-t border-amber-500/20 shrink-0">
                    <div className="flex gap-3 items-start">
                      <Info className="w-5 h-5 text-amber-400 mt-0.5 shrink-0"/>
                      <div className="text-[12px] text-amber-200/80 leading-relaxed">
                        <strong className="text-amber-400">Conduit Method:</strong> ค้นหาขนาดท่อที่พื้นที่หน้าตัดรวมของสาย ไม่เกิน 40% ของพื้นที่ท่อ (แยกท่อตามจำนวน Set)<br/>
                        <strong className="text-amber-400">Tray/Ladder Method:</strong> หาความกว้างรวมของสายทั้งหมด (จัดเรียง 1 ชั้น) และเผื่อพื้นที่ว่างอีก 20% <span className="text-rose-400 font-bold">*ไม่คิดรวมสายดิน (ตามมาตรฐาน)</span><br/>
                        <strong className="text-emerald-400 mt-1 block">Manual Override:</strong> ช่อง Recommended สามารถพิมพ์แก้ไข หรือเลือกขนาดใหม่เองได้เลย (ระบบจะนำค่านี้ไปใช้งานจริงและ Export)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side: Group Raceway Control Panel */}
                <div className="flex-[3] min-w-[320px] max-w-[400px] bg-[#1e293b] rounded-2xl shadow-xl border border-[#334155] p-5 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
                  <div className="flex items-center justify-between mb-4 border-b border-[#334155] pb-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-amber-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Group Raceway</h3>
                    </div>
                    <button 
                      onClick={handleAddRacewayGroup}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 shadow-md shadow-cyan-900/40"
                    >
                      <Plus className="w-3.5 h-3.5" /> ADD
                    </button>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    {racewayGroups.length > 0 && (
                      <div className="text-[12px] font-bold text-slate-400 mb-2 uppercase tracking-wider px-1">Feeder to Feeder</div>
                    )}
                    {racewayGroups.map((group, gIdx) => {
                      const gSize = getGroupRacewaySize(group.startNum, group.endNum);
                      return (
                        <div key={group.id} className="grid grid-cols-[55px_24px_55px_1fr_30px] items-center gap-2 bg-[#0f172a]/20 border border-slate-700/60 rounded-xl p-2 hover:border-slate-500/40 transition-all relative group">
                          {/* Start Feeder select */}
                          <select 
                            value={group.startNum}
                            onChange={(e) => handleUpdateRacewayGroup(group.id, 'startNum', parseInt(e.target.value))}
                            className="bg-transparent border border-emerald-500/80 text-emerald-400 text-center font-mono text-[13px] font-bold rounded px-1.5 py-1.5 w-full outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                          >
                            {feeders.map((_, idx) => (
                              <option key={idx} value={idx + 1} className="bg-[#1e293b] text-slate-200">{idx + 1}</option>
                            ))}
                          </select>
                          
                          {/* connector label */}
                          <span className="text-[12px] text-slate-400 font-bold text-center">to</span>
                          
                          {/* End Feeder select */}
                          <select 
                            value={group.endNum}
                            onChange={(e) => handleUpdateRacewayGroup(group.id, 'endNum', parseInt(e.target.value))}
                            className="bg-transparent border border-emerald-500/80 text-emerald-400 text-center font-mono text-[13px] font-bold rounded px-1.5 py-1.5 w-full outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                          >
                            {feeders.map((_, idx) => (
                              <option key={idx} value={idx + 1} className="bg-[#1e293b] text-slate-200">{idx + 1}</option>
                            ))}
                          </select>
                          
                          {/* Recommended raceway output */}
                          <div className="border border-amber-500 bg-amber-500/5 text-amber-400 text-[12px] font-bold font-mono rounded px-2.5 py-1.5 text-center truncate min-w-0" title={gSize.finalSize}>
                            {gSize.finalSize}
                          </div>
                          
                          {/* Delete group action */}
                          <button 
                            onClick={() => handleRemoveRacewayGroup(group.id)}
                            className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors flex items-center justify-center"
                            title="ลบกลุ่ม"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                    {racewayGroups.length === 0 && (
                      <div className="text-center py-8 text-slate-500 border border-dashed border-[#334155] rounded-xl bg-slate-800/10">
                        <Layers className="w-8 h-8 mx-auto text-slate-600 mb-2 opacity-50" />
                        <p className="text-[12px] font-bold">No Groups Configured</p>
                        <p className="text-[10px] text-slate-600 mt-1">Cables will be calculated individually.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : dbSubTab === 'Cable data' ? (
              <div className="bg-[#1e293b] rounded-2xl shadow-xl border border-[#334155] overflow-hidden flex-1 flex flex-col min-h-0">
                <div className="flex border-b border-[#334155] overflow-x-auto bg-[#0f172a]/50 p-2 gap-2 custom-scrollbar shrink-0">
                  {cableTypeOptions.map(tab => (
                    <button key={tab} onClick={() => setDbCableTab(tab)} className={`px-5 py-2.5 text-[13px] font-bold whitespace-nowrap transition-all rounded-lg ${dbCableTab === tab ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:bg-[#334155] hover:text-slate-200'}`}>{tab}</button>
                  ))}
                </div>
                <div className="p-6 bg-[#1e293b] border-b border-[#334155] flex flex-wrap items-center gap-8 shrink-0">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Installation Method</label>
                    <select value={dbInstallType} onChange={(e) => setDbInstallType(e.target.value)} className="bg-[#0f172a] border border-[#334155] text-slate-200 text-[13px] rounded-lg px-4 py-2.5 w-64 focus:ring-1 focus:ring-purple-500 outline-none font-sarabun">
                      {installOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Cable Cores (Show OD For)</label>
                    <div className="flex bg-[#0f172a] rounded-lg border border-[#334155] shadow-inner overflow-hidden p-1 gap-1">
                      {['1C', '2C', '3C', '4C'].map(c => (
                        <button key={c} onClick={() => setDbCoreType(c)} className={`px-6 py-1.5 rounded-md text-[13px] font-bold transition-all ${dbCoreType === c ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:bg-[#334155] hover:text-slate-200'}`}>{c}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="overflow-auto custom-scrollbar flex-1">
                  <table className="w-full text-center border-collapse min-w-[800px]">
                    <thead className="sticky top-0 z-10 shadow-sm">
                      <tr className="bg-[#0f172a] text-slate-300 text-[12px] font-bold uppercase tracking-wider">
                        <th className="py-4 border-r border-[#334155]">Cable Size (sq.mm.)</th>
                        <th className="py-4 border-r border-[#334155] text-amber-400">Ampacity (A)</th>
                        <th className="py-4 border-r border-[#334155] text-emerald-400">OD (mm) for {dbCoreType}</th>
                        <th className="py-4 border-r border-[#334155]">Resistance (R)</th>
                        <th className="py-4">Reactance (X)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#1e293b]">
                      {dbTableData().map((row, i) => (
                        <tr key={i} className={`text-[13px] border-b border-[#334155] font-mono hover:bg-[#2d3748] transition-colors ${i % 2 === 0 ? 'bg-[#1e293b]' : 'bg-[#1a202c]'}`}>
                          <td className="py-3.5 px-4 font-bold text-slate-200">{row.size}</td>
                          <td className={`py-3.5 px-4 font-bold ${row.amp === 0 && !isDbEditMode ? 'text-amber-600/50' : 'text-amber-400'} border-r border-[#334155]`}>
                            {isDbEditMode ? (<input type="number" value={row.amp} onChange={(e) => handleDbChange(row.size, 'amp', e.target.value)} className="w-24 bg-[#0f172a] border border-amber-500/50 text-amber-300 rounded px-2 py-1 text-center font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 font-sarabun" />) : (row.amp || '-')}
                          </td>
                          <td className={`py-3.5 px-4 font-bold ${row.od === '' && !isDbEditMode ? 'text-emerald-600/50' : 'text-emerald-400'} border-r border-[#334155]`}>
                            {isDbEditMode ? (<input type="number" step="0.1" value={row.od} onChange={(e) => handleDbChange(row.size, 'od', e.target.value)} className="w-24 bg-[#0f172a] border border-emerald-500/50 text-emerald-300 rounded px-2 py-1 text-center font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sarabun" />) : (row.od || '-')}
                          </td>
                          <td className="py-3.5 px-4 text-cyan-400 border-r border-[#334155]">
                            {isDbEditMode ? (<input type="number" step="0.001" value={row.r} onChange={(e) => handleDbChange(row.size, 'r', e.target.value)} className="w-24 bg-[#0f172a] border border-cyan-500/50 text-cyan-300 rounded px-2 py-1 text-center focus:outline-none focus:ring-1 focus:ring-cyan-500 font-sarabun" />) : (row.r)}
                          </td>
                          <td className="py-3.5 px-4 text-indigo-400">
                            {isDbEditMode ? (<input type="number" step="0.001" value={row.x} onChange={(e) => handleDbChange(row.size, 'x', e.target.value)} className="w-24 bg-[#0f172a] border border-indigo-500/50 text-indigo-300 rounded px-2 py-1 text-center focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sarabun" />) : (row.x)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : dbSubTab === 'Raceway' ? (
              <div className="bg-[#1e293b] rounded-2xl shadow-xl border border-[#334155] overflow-hidden flex flex-col flex-1 min-h-0">
                <div className="p-6 overflow-y-auto custom-scrollbar h-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-[#334155] pb-2">
                        <h4 className="text-amber-400 font-bold uppercase tracking-widest text-[13px]">Tray / Ladder Sizes (mm)</h4>
                        {isDbEditMode && <button onClick={handleAddTray} className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-1 rounded flex items-center gap-1 hover:bg-amber-500/40 transition-colors"><Plus className="w-3 h-3"/> Add Size</button>}
                      </div>
                      <table className="w-full text-center border-collapse bg-[#0f172a] rounded-lg overflow-hidden border border-[#334155]">
                        <thead><tr className="bg-[#1a202c] text-slate-400 text-[11px]"><th className="py-3 border-b border-[#334155]">Standard Width (mm)</th>{isDbEditMode && <th className="py-3 border-b border-[#334155] w-16">Action</th>}</tr></thead>
                        <tbody>
                          {traySizes.map((val, idx) => (
                            <tr key={idx} className="border-b border-[#334155] hover:bg-[#1e293b] transition-colors">
                              <td className="py-2.5 px-2">
                                {isDbEditMode ? (
                                  <input type="number" value={val} onChange={(e) => {
                                      const newArr = [...traySizes];
                                      newArr[idx] = Number(e.target.value);
                                      setTraySizes(newArr);
                                  }} className="bg-[#0f172a] border border-amber-500/50 text-amber-300 rounded px-2 py-1 text-center font-bold outline-none focus:ring-1 focus:ring-amber-500 w-32 font-sarabun" />
                                ) : (
                                  <span className="text-amber-400 font-bold font-mono">{val}</span>
                                )}
                              </td>
                              {isDbEditMode && (
                                <td className="py-2.5 px-2">
                                  <button onClick={() => handleRemoveTray(idx)} className="text-red-400 hover:text-red-300 hover:bg-red-400/20 p-1.5 rounded transition-colors"><Trash2 className="w-4 h-4 mx-auto"/></button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-[#334155] pb-2">
                        <h4 className="text-emerald-400 font-bold uppercase tracking-widest text-[13px]">Conduit Sizes (IMC/EMT)</h4>
                        {isDbEditMode && <button onClick={handleAddConduit} className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded flex items-center gap-1 hover:bg-emerald-500/40 transition-colors"><Plus className="w-3 h-3"/> Add Size</button>}
                      </div>
                      <table className="w-full text-center border-collapse bg-[#0f172a] rounded-lg overflow-hidden border border-[#334155]">
                        <thead><tr className="bg-[#1a202c] text-slate-400 text-[11px]"><th className="py-3 border-b border-[#334155] border-r">Size (Inch)</th><th className="py-3 border-b border-[#334155] border-r">Inner Dia. (mm)</th><th className="py-3 border-b border-[#334155]">40% Area (sq.mm)</th>{isDbEditMode && <th className="py-3 border-b border-[#334155] w-16">Action</th>}</tr></thead>
                        <tbody>
                          {conduitSizes.map((c, idx) => (
                            <tr key={idx} className="border-b border-[#334155] hover:bg-[#1e293b] transition-colors">
                              <td className="py-2.5 px-2 border-r border-[#334155]">
                                {isDbEditMode ? (
                                  <input type="text" value={c.size} onChange={(e) => {
                                      const newArr = [...conduitSizes];
                                      newArr[idx].size = e.target.value;
                                      setConduitSizes(newArr);
                                  }} className="bg-[#0f172a] border border-slate-500/50 text-slate-300 rounded px-2 py-1 text-center font-bold outline-none focus:ring-1 focus:ring-slate-500 w-full max-w-[80px] font-sarabun" />
                                ) : (
                                  <span className="text-slate-300 font-bold font-mono">{c.size}</span>
                                )}
                              </td>
                              <td className="py-2.5 px-2 border-r border-[#334155]">
                                {isDbEditMode ? (
                                  <input type="number" step="0.1" value={c.id} onChange={(e) => {
                                      const newArr = [...conduitSizes];
                                      newArr[idx].id = Number(e.target.value);
                                      setConduitSizes(newArr);
                                  }} className="bg-[#0f172a] border border-cyan-500/50 text-cyan-300 rounded px-2 py-1 text-center font-bold outline-none focus:ring-1 focus:ring-cyan-500 w-full max-w-[80px] font-sarabun" />
                                ) : (
                                  <span className="text-cyan-400 font-bold font-mono">{c.id}</span>
                                )}
                              </td>
                              <td className="py-2.5 px-2">
                                {isDbEditMode ? (
                                  <input type="number" value={c.area40} onChange={(e) => {
                                      const newArr = [...conduitSizes];
                                      newArr[idx].area40 = Number(e.target.value);
                                      setConduitSizes(newArr);
                                  }} className="bg-[#0f172a] border border-emerald-500/50 text-emerald-300 rounded px-2 py-1 text-center font-bold outline-none focus:ring-1 focus:ring-emerald-500 w-full max-w-[80px] font-sarabun" />
                                ) : (
                                  <span className="text-emerald-400 font-bold font-mono">{c.area40}</span>
                                )}
                              </td>
                              {isDbEditMode && (
                                <td className="py-2.5 px-2">
                                  <button onClick={() => handleRemoveConduit(idx)} className="text-red-400 hover:text-red-300 hover:bg-red-400/20 p-1.5 rounded transition-colors"><Trash2 className="w-4 h-4 mx-auto"/></button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </div>
                </div>
              </div>
            ) : dbSubTab === 'EIT Table' ? (
              <div className="bg-[#1e293b] rounded-2xl shadow-xl border border-[#334155] overflow-hidden flex flex-col flex-1 min-h-0">
                <div className="p-6 border-b border-[#334155] flex justify-between items-center bg-[#0f172a] shrink-0">
                  <div>
                    <h3 className="text-[16px] font-bold text-white">EIT Reference Tables</h3>
                    <p className="text-[12px] text-slate-400 mt-1">จัดการรูปภาพตารางอ้างอิงมาตรฐาน วสท.</p>
                  </div>
                  <button onClick={() => setIsAddEitModalOpen(true)} className="bg-purple-600 text-white px-5 py-2.5 rounded-lg text-[13px] font-bold shadow-lg shadow-purple-900/50 flex items-center gap-2 hover:bg-purple-500 transition-colors">
                    <Plus className="w-4 h-4" /> Add Table
                  </button>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-auto custom-scrollbar">
                  {eitTables.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-500 bg-[#1a202c] border-2 border-dashed border-[#334155] rounded-xl">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p className="text-[14px] font-medium">No EIT tables uploaded yet.</p>
                    </div>
                  ) : eitTables.map(table => (
                    <div key={table.id} className="border border-[#334155] rounded-xl overflow-hidden shadow-lg group bg-[#0f172a] hover:border-purple-500/50 transition-all">
                      <div className="h-56 bg-[#1e293b] relative flex items-center justify-center p-3 cursor-pointer" onClick={() => setViewingEitTable(table)}>
                        <img src={table.image} alt={table.name} className="max-w-full max-h-full object-contain rounded-lg" />
                        <div className="absolute inset-0 bg-[#0f172a]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <button onClick={(e) => { e.stopPropagation(); confirmDeleteEitTable(table.id); }} className="bg-red-500 text-white p-3 rounded-full absolute top-4 right-4 hover:bg-red-600 shadow-lg transform hover:scale-110 transition-transform">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <span className="text-white font-bold text-sm bg-purple-600 px-5 py-2.5 rounded-full shadow-lg">Click to View</span>
                        </div>
                      </div>
                      <div className="p-4 border-t border-[#334155]">
                        <p className="font-bold text-[14px] text-slate-200 truncate text-center">{table.name}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {isAddEitModalOpen && (
                  <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1e293b] rounded-2xl shadow-2xl w-[480px] overflow-hidden border border-[#334155]">
                      <div className="px-6 py-5 border-b border-[#334155] bg-[#0f172a] flex justify-between items-center">
                        <h3 className="text-[16px] font-bold text-white">Upload EIT Table</h3>
                        <button onClick={() => setIsAddEitModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                      </div>
                      <div className="p-6 space-y-5">
                        <div>
                          <label className="block text-[12px] font-bold text-slate-400 mb-2 uppercase tracking-wide">Table Name / Reference</label>
                          <input type="text" placeholder="e.g. ตาราง 5-20 (EIT 2564)" value={newEitName} onChange={(e) => setNewEitName(e.target.value)} className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-[14px] text-white focus:ring-1 focus:ring-purple-500 outline-none font-sarabun" />
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-slate-400 mb-2 uppercase tracking-wide">Image File</label>
                          <div className="border-2 border-dashed border-[#475569] rounded-xl h-48 flex flex-col items-center justify-center bg-[#0f172a] cursor-pointer overflow-hidden hover:border-purple-500 transition-colors group" onClick={() => fileInputRef.current?.click()}>
                            {newEitImage ? (
                              <img src={newEitImage} alt="Preview" className="h-full w-full object-contain p-2" />
                            ) : (
                              <div className="text-center">
                                <div className="w-12 h-12 bg-[#1e293b] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                  <Upload className="w-5 h-5 text-purple-400" />
                                </div>
                                <p className="text-[13px] text-slate-300 font-bold mb-1">Click to upload image</p>
                                <p className="text-[11px] text-slate-500">PNG, JPG up to 5MB</p>
                              </div>
                            )}
                            <input type="file" ref={fileInputRef} onChange={handleEitImageUpload} accept="image/*" className="hidden" />
                          </div>
                        </div>
                        <button onClick={saveEitTable} disabled={!newEitName || !newEitImage} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-[14px] py-3.5 rounded-xl hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/50 transition-all">
                          Save Table
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : dbSubTab === 'Transformer' ? (
              <div className="bg-[#1e293b] rounded-2xl shadow-xl border border-[#334155] overflow-hidden flex-1 flex flex-col min-h-0">
                <div className="p-6 border-b border-[#334155] bg-[#0f172a] shrink-0">
                  <h3 className="text-[16px] font-bold text-white">Standard Distribution Transformer Database</h3>
                  <p className="text-[12px] text-slate-400 mt-1">ตารางพิกัดกระแสและค่า Impedance มาตรฐานของหม้อแปลงไฟฟ้า (22 kV / 400 Vac 3Ph)</p>
                </div>
                <div className="overflow-auto custom-scrollbar flex-1">
                  <table className="w-full text-center border-collapse min-w-[600px]">
                    <thead className="sticky top-0 z-10 shadow-sm">
                      <tr className="bg-[#0f172a] text-slate-300 text-[12px] font-bold uppercase tracking-wider">
                        <th className="py-4 border-r border-[#334155]">Rating (kVA)</th>
                        <th className="py-4 border-r border-[#334155]">Vector Group</th>
                        <th className="py-4 border-r border-[#334155] text-amber-400">Impedance (%Zk)</th>
                        <th className="py-4 border-r border-[#334155] text-rose-400">FLC HV @22kV (A)</th>
                        <th className="py-4 text-emerald-400">FLC LV @400V (A)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#1e293b]">
                      {[
                        { kva: "30 kVA", vector: "Dyn11", zk: "4%Zk", hv: "0.79 A", lv: "43.3 A" },
                        { kva: "50 kVA", vector: "Dyn11", zk: "4%Zk", hv: "1.31 A", lv: "72.2 A" },
                        { kva: "100 kVA", vector: "Dyn11", zk: "4%Zk", hv: "2.62 A", lv: "144.3 A" },
                        { kva: "160 kVA", vector: "Dyn11", zk: "4%Zk", hv: "4.20 A", lv: "230.9 A" },
                        { kva: "250 kVA", vector: "Dyn11", zk: "4%Zk", hv: "6.56 A", lv: "360.8 A" },
                        { kva: "315 kVA", vector: "Dyn11", zk: "4%Zk", hv: "8.27 A", lv: "454.7 A" },
                        { kva: "400 kVA", vector: "Dyn11", zk: "4%Zk", hv: "10.50 A", lv: "577.4 A" },
                        { kva: "500 kVA", vector: "Dyn11", zk: "4%Zk", hv: "13.12 A", lv: "721.7 A" },
                        { kva: "630 kVA", vector: "Dyn11", zk: "4%Zk", hv: "16.53 A", lv: "909.3 A" },
                        { kva: "800 kVA", vector: "Dyn11", zk: "5%Zk", hv: "20.99 A", lv: "1,154.7 A" },
                        { kva: "1,000 kVA", vector: "Dyn11", zk: "6%Zk", hv: "26.24 A", lv: "1,443.4 A" },
                        { kva: "1,250 kVA", vector: "Dyn11", zk: "6%Zk", hv: "32.80 A", lv: "1,804.2 A" },
                        { kva: "1,500 kVA", vector: "Dyn11", zk: "6%Zk", hv: "39.36 A", lv: "2,165.1 A" },
                        { kva: "1,600 kVA", vector: "Dyn11", zk: "6%Zk", hv: "41.99 A", lv: "2,309.4 A" },
                        { kva: "2,000 kVA", vector: "Dyn11", zk: "6%Zk", hv: "52.49 A", lv: "2,886.8 A" },
                        { kva: "2,500 kVA", vector: "Dyn11", zk: "6%Zk", hv: "65.61 A", lv: "3,608.4 A" },
                        { kva: "3,000 kVA", vector: "Dyn11", zk: "7%Zk", hv: "78.73 A", lv: "4,330.1 A" },
                        { kva: "3,150 kVA", vector: "Dyn11", zk: "7%Zk", hv: "82.7 A", lv: "4,546.6 A" },
                        { kva: "4,000 kVA", vector: "Dyn11", zk: "7%Zk", hv: "105.0 A", lv: "5,773.5 A" },
                        { kva: "5,000 kVA", vector: "Dyn11", zk: "8%Zk", hv: "131.2 A", lv: "7,216.9 A" },
                        { kva: "6,300 kVA", vector: "Dyn11", zk: "8%Zk", hv: "165.3 A", lv: "9,093.3 A" },
                        { kva: "8,000 kVA", vector: "Dyn11", zk: "8%Zk", hv: "209.9 A", lv: "11,547.0 A" },
                        { kva: "10,000 kVA", vector: "Dyn11", zk: "8%Zk", hv: "262.4 A", lv: "14,433.8 A" },
                      ].map((row, i) => (
                        <tr key={i} className={`text-[13px] border-b border-[#334155] font-mono hover:bg-[#2d3748] transition-colors ${i % 2 === 0 ? 'bg-[#1e293b]' : 'bg-[#1a202c]'}`}>
                          <td className="py-3 px-4 font-bold text-slate-200 border-r border-[#334155]">{row.kva}</td>
                          <td className="py-3 px-4 text-slate-300 border-r border-[#334155]">{row.vector}</td>
                          <td className="py-3 px-4 text-amber-400 font-bold border-r border-[#334155]">{row.zk}</td>
                          <td className="py-3 px-4 text-rose-400 font-bold border-r border-[#334155]">{row.hv}</td>
                          <td className="py-3 px-4 text-emerald-400 font-bold">{row.lv}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : dbSubTab === 'Dropout fuse' ? (
              <div className="bg-[#1e293b] rounded-2xl shadow-xl border border-[#334155] overflow-hidden flex-1 flex flex-col min-h-0">
                <div className="p-6 border-b border-[#334155] bg-[#0f172a] shrink-0">
                  <h3 className="text-[16px] font-bold text-white">Dropout Fuse Link Selection Table</h3>
                  <p className="text-[12px] text-slate-400 mt-1">ตารางแนะนำการเลือกขนาดฟิวส์แรงสูง (Dropout Fuse Link) สำหรับระบบ 22 kV มาตรฐาน PEA / MEA</p>
                </div>
                <div className="overflow-auto custom-scrollbar flex-1">
                  <table className="w-full text-center border-collapse min-w-[600px]">
                    <thead className="sticky top-0 z-10 shadow-sm">
                      <tr className="bg-[#0f172a] text-slate-300 text-[12px] font-bold uppercase tracking-wider">
                        <th className="py-4 border-r border-[#334155]">Rating (kVA)</th>
                        <th className="py-4 border-r border-[#334155] text-rose-400">FLC HV @22kV (A)</th>
                        <th className="py-4 border-r border-[#334155] text-amber-400">Standard Fuse Link (A)</th>
                        <th className="py-4 text-emerald-400">PEA Recommended Fuse (A)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#1e293b]">
                      {[
                        { kva: "30 kVA", currentHv: "0.79 A", fuseStandard: "3 A", fusePea: "3 A" },
                        { kva: "50 kVA", currentHv: "1.31 A", fuseStandard: "3 A", fusePea: "3 A" },
                        { kva: "100 kVA", currentHv: "2.62 A", fuseStandard: "5 A", fusePea: "5 A" },
                        { kva: "160 kVA", currentHv: "4.20 A", fuseStandard: "6 A", fusePea: "6 A" },
                        { kva: "250 kVA", currentHv: "6.56 A", fuseStandard: "10 A", fusePea: "10 A" },
                        { kva: "315 kVA", currentHv: "8.27 A", fuseStandard: "12 A", fusePea: "12 A" },
                        { kva: "400 kVA", currentHv: "10.50 A", fuseStandard: "15 A", fusePea: "15 A" },
                        { kva: "500 kVA", currentHv: "13.12 A", fuseStandard: "20 A", fusePea: "20 A" },
                        { kva: "630 kVA", currentHv: "16.53 A", fuseStandard: "25 A", fusePea: "25 A" },
                        { kva: "800 kVA", currentHv: "20.99 A", fuseStandard: "30 A", fusePea: "30 A" },
                        { kva: "1,000 kVA", currentHv: "26.24 A", fuseStandard: "40 A", fusePea: "40 A" },
                        { kva: "1,250 kVA", currentHv: "32.80 A", fuseStandard: "50 A", fusePea: "50 A" },
                        { kva: "1,500 kVA", currentHv: "39.36 A", fuseStandard: "65 A", fusePea: "65 A" },
                        { kva: "1,600 kVA", currentHv: "41.99 A", fuseStandard: "65 A", fusePea: "65 A" },
                        { kva: "2,000 kVA", currentHv: "52.49 A", fuseStandard: "80 A", fusePea: "80 A" },
                        { kva: "2,500 kVA", currentHv: "65.61 A", fuseStandard: "100 A", fusePea: "100 A" },
                        { kva: "3,000 kVA", currentHv: "78.73 A", fuseStandard: "120 A", fusePea: "120 A" },
                        { kva: "3,150 kVA", currentHv: "82.67 A", fuseStandard: "140 A", fusePea: "140 A" },
                        { kva: "4,000 kVA", currentHv: "104.97 A", fuseStandard: "200 A", fusePea: "200 A" },
                        { kva: "5,000 kVA", currentHv: "131.22 A", fuseStandard: "250 A", fusePea: "250 A" },
                        { kva: "6,300 kVA", currentHv: "165.33 A", fuseStandard: "300 A", fusePea: "300 A" },
                        { kva: "8,000 kVA", currentHv: "209.95 A", fuseStandard: "400 A", fusePea: "400 A" },
                        { kva: "10,000 kVA", currentHv: "262.43 A", fuseStandard: "500 A", fusePea: "500 A" },
                      ].map((row, i) => (
                        <tr key={i} className={`text-[13px] border-b border-[#334155] font-mono hover:bg-[#2d3748] transition-colors ${i % 2 === 0 ? 'bg-[#1e293b]' : 'bg-[#1a202c]'}`}>
                          <td className="py-3 px-4 font-bold text-slate-200 border-r border-[#334155]">{row.kva}</td>
                          <td className="py-3 px-4 text-rose-400 font-bold border-r border-[#334155]">{row.currentHv}</td>
                          <td className="py-3 px-4 text-amber-400 font-bold border-r border-[#334155]">{row.fuseStandard}</td>
                          <td className="py-3 px-4 text-emerald-400 font-bold">{row.fusePea}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-[#1e293b] rounded-2xl shadow-xl border border-[#334155] p-24 text-center flex-1 flex flex-col items-center justify-center min-h-0">
                <div className="w-20 h-20 bg-[#0f172a] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-[#334155]">
                  <FileText className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-300">Module under construction</h3>
                <p className="text-slate-500 mt-2">The '{dbSubTab}' database module will be available in future updates.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="relative flex justify-center items-center w-full min-h-full cursor-grab active:cursor-grabbing p-8" style={{ overflow: 'hidden' }}>
            
            <div className="absolute bottom-6 right-6 flex gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-lg border border-slate-200 z-50">
               <button onClick={() => setCanvasView(prev => ({...prev, scale: prev.scale * 1.2}))} className="p-2 text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg"><ZoomIn className="w-5 h-5"/></button>
               <button onClick={resetCanvasView} className="p-2 text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg"><Move className="w-5 h-5"/></button>
               <button onClick={() => setCanvasView(prev => ({...prev, scale: prev.scale * 0.8}))} className="p-2 text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg"><ZoomOut className="w-5 h-5"/></button>
            </div>

            <div className="bg-white rounded-md overflow-hidden border border-slate-300 shadow-2xl relative" style={{ transformOrigin: 'top left', transform: `translate(${canvasView.x}px, ${canvasView.y}px) scale(${canvasView.scale})`, transition: isDragging ? 'none' : 'transform 0.1s ease-out' }}>
              <svg ref={svgRef} viewBox={`0 0 ${svgWidth} 1000`} width={svgWidth} height={1000} className="block relative z-10" style={{ backgroundColor: 'white' }}>
                 <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect width="20" height="20" fill="none" />
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                  </pattern>
                  <pattern id="grid-large" width="100" height="100" patternUnits="userSpaceOnUse">
                    <rect width="100" height="100" fill="url(#grid)" />
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                  </pattern>
                  <marker id="arrow-blue-start" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 10 0 L 0 5 L 10 10 z" fill="#2563eb" />
                  </marker>
                  <marker id="arrow-blue-end" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb" />
                  </marker>
                </defs>
                <rect width="100%" height="100%" fill="white" />
                <rect width="100%" height="100%" fill="url(#grid-large)" />
                
                <rect x="20" y="20" width="180" height="60" fill="white" stroke="#64748b" strokeWidth="2" />
                <text x="30" y="40" fontSize="12" fill="#1e293b" style={{ fontWeight: 'bold', fontFamily: 'Sarabun, sans-serif', letterSpacing: '0.1em' }}>SINGLE LINE DIAGRAM</text>
                <text x="30" y="55" fontSize="10" fill="#0369a1" style={{ fontFamily: 'Sarabun, monospace' }}>PROJ: {globalSpecs.projectName}</text>
                <text x="30" y="70" fontSize="10" fill="#64748b" style={{ fontFamily: 'Sarabun, monospace' }}>ENG: KANG</text>

                <g>
                  {globalSpecs.hasTransformer !== false ? (
                    <g>
                      <circle cx={centerX} cy="70" r="35" fill="white" stroke="#1e293b" strokeWidth="3" />
                      <circle cx={centerX} cy="115" r="35" fill="white" stroke="#1e293b" strokeWidth="3" />
                      <line x1={centerX} y1="150" x2={centerX} y2={feeders.length === 1 ? 480 : 280} stroke="#1e293b" strokeWidth="3" />
                    </g>
                  ) : (
                    <g>
                      <line x1={centerX} y1="90" x2={centerX} y2={feeders.length === 1 ? 480 : 280} stroke="#1e293b" strokeWidth="3" />
                      <polygon points={`${centerX},70 ${centerX - 8},90 ${centerX + 8},90`} fill="#1e293b" />
                    </g>
                  )}
                  
                  <rect x={centerX - (renderItems.length * feederWidth / 2) - 60} y="220" width={(renderItems.length * feederWidth) + 120} height="320" fill="transparent" stroke="#94a3b8" strokeWidth="2" strokeDasharray="12,6" rx="8" />
                  <text x={centerX - (renderItems.length * feederWidth / 2) - 45} y="245" fontSize="14" fill="#1e293b" style={{ fontWeight: 'bold' }}>MAIN DISTRIBUTION BOARD</text>
                  
                  {feeders.length > 1 && (
                    <>
                      <line x1={centerX} y1="315" x2={centerX} y2="420" stroke="#1e293b" strokeWidth="4" />
                      <line x1={centerX - (renderItems.length * feederWidth / 2) + feederWidth / 2} y1="420" x2={centerX + (renderItems.length * feederWidth / 2) - feederWidth / 2} y2="420" stroke="#0891b2" strokeWidth="8" strokeLinecap="round" />
                    </>
                  )}
                  
                  {renderItems.map((item, i) => { 
                    const xPos = centerX - (renderItems.length * feederWidth / 2) + (i * feederWidth) + feederWidth / 2; 
                    if (item.type === 'skip') {
                      return (
                        <g key={`l-skip-${i}`}>
                          <line x1={xPos} y1="420" x2={xPos} y2="740" stroke="#94a3b8" strokeWidth="3" strokeDasharray="8,6" />
                        </g>
                      );
                    }
                    const f = item.feeder;
                    return (
                      <g key={`l-${f.id}`}>
                        {feeders.length > 1 && <line x1={xPos} y1="420" x2={xPos} y2="480" stroke="#1e293b" strokeWidth="3" />}
                        <line x1={xPos} y1="515" x2={xPos} y2="740" stroke="#1e293b" strokeWidth="3" />
                      </g>
                    ) 
                  })}
                </g>

                <g>
                  {feeders.length > 1 && (
                    <g>
                      <IECBreaker x={centerX} y={300} title={globalSpecs.mainCbType} ataf={globalSpecs.mainCbAtAf} fieldId="mainCbType" focusInput={focusInput} />
                      <text x={centerX + 18} y={326} fontSize="10" fill="#64748b" style={{ fontFamily: 'Sarabun, monospace', fontWeight: 'bold' }}>({totalLoadKw.toFixed(2)} kW / {totalLoadA.toFixed(2)} A)</text>
                    </g>
                  )}
                  {renderItems.map((item, i) => { 
                    const xPos = centerX - (renderItems.length * feederWidth / 2) + (i * feederWidth) + feederWidth / 2; 
                    if (item.type === 'skip') {
                      const firstIndex = feeders.findIndex(f => f.id === item.firstFeeder.id);
                      const lastIndex = feeders.findIndex(f => f.id === item.lastFeeder.id);
                      const startNum = firstIndex + 2;
                      const endNum = lastIndex;
                      const count = lastIndex - firstIndex - 1;
                      const label = startNum === endNum ? `FEEDER ${startNum}` : `FEEDER ${startNum} - ${endNum}`;
                      return (
                        <g key={`c-skip-${i}`}>
                          <rect x={xPos - 60} y="475" width="120" height="50" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="6,3" rx="8" />
                          <text x={xPos} y="495" textAnchor="middle" fontSize="11" fill="#475569" style={{ fontWeight: 'bold' }}>{label}</text>
                          <text x={xPos} y="512" textAnchor="middle" fontSize="9" fill="#64748b" style={{ fontWeight: 'bold' }}>({count} CIRCUITS)</text>
                          
                          {/* Double-headed blue arrow indicating Same Detail */}
                          <line 
                            x1={xPos - feederWidth + 57} 
                            y1="772.5" 
                            x2={xPos + feederWidth - 57} 
                            y2="772.5" 
                            stroke="#2563eb" 
                            strokeWidth="2" 
                            markerStart="url(#arrow-blue-start)" 
                            markerEnd="url(#arrow-blue-end)" 
                          />
                          <text 
                            x={xPos} 
                            y="792" 
                            textAnchor="middle" 
                            fontSize="11" 
                            fill="#2563eb" 
                            style={{ fontWeight: 'bold', fontFamily: 'Sarabun, monospace' }}
                          >
                            Same Detail
                          </text>
                        </g>
                      );
                    }
                    const f = item.feeder;
                    return (
                      <g key={`c-${f.id}`}>
                        <IECBreaker x={xPos} y={500} title={f.type} ataf={f.ataf} fieldId={`f-${f.id}-ataf`} tab="feeders" focusInput={focusInput} />
                        
                        <g cursor="pointer" onClick={() => focusInput('feeders', `f-${f.id}-loadKw`)} style={{ cursor: 'pointer' }}>
                          <rect x={xPos - 55} y={740} width="110" height="65" fill="#f8fafc" stroke="#334155" strokeWidth="2.5" rx="6" />
                          <path d={`M ${xPos - 55} 760 L ${xPos + 55} 760`} stroke="#cbd5e1" strokeWidth="1" />
                          <text x={xPos} y={755} textAnchor="middle" fontSize="11" fill="#1e293b" style={{ fontWeight: 'bold' }}>{f.loadTitle}</text>
                          <text x={xPos} y={778} textAnchor="middle" fontSize="14" fill="#0369a1" style={{ fontWeight: 'bold', fontFamily: 'Sarabun, monospace' }}>{f.loadKw} kW</text>
                          <text x={xPos} y={793} textAnchor="middle" fontSize="11" fill="#64748b" style={{ fontFamily: 'Sarabun, monospace' }}>({f.loadA} A)</text>
                        </g>
                      </g>
                    ); 
                  })}
                </g>

                <g className="labels">
                  {globalSpecs.hasTransformer !== false ? (
                    <g transform={`translate(${centerX + 60}, 30)`} cursor="pointer" onClick={() => focusInput('global', 'trTitle')}>
                      <rect x="-10" y="-20" width="280" height="150" fill="white" fillOpacity="0.8" rx="4" />
                      {[
                        { val: globalSpecs.trTitle, fs: 18, c: '#1e3a8a', b: true }, 
                        { val: globalSpecs.trKva, fs: 16, c: '#1e293b', b: true }, 
                        { val: globalSpecs.trVolt, fs: 12, c: '#475569', b: false }, 
                        { val: `${globalSpecs.trVector}${globalSpecs.trVector && globalSpecs.trZk ? ', ' : ''}${globalSpecs.trZk}`, fs: 12, c: '#475569', b: false },
                        { val: `FLC (HV): ${calculateTransformerCurrents(globalSpecs.trKva, globalSpecs.trVolt).hvAmp.toFixed(1)} A`, fs: 11, c: '#b91c1c', b: true },
                        { val: `FLC (LV): ${calculateTransformerCurrents(globalSpecs.trKva, globalSpecs.trVolt).lvAmp.toFixed(1)} A`, fs: 11, c: '#047857', b: true }
                      ].filter(item => item.val).map((item, idx) => (
                        <text key={idx} y={idx * 20} fontSize={item.fs} fill={item.c} style={{ fontWeight: item.b ? 'bold' : 'normal', fontFamily: 'Sarabun, monospace' }}>{item.val}</text>
                      ))}
                    </g>
                  ) : (
                    <g transform={`translate(${centerX}, 55)`} cursor="pointer" onClick={() => focusInput('global', 'existingMdbText')}>
                      <text textAnchor="middle" fontSize="16" fill="#1e3a8a" style={{ fontWeight: 'bold', fontFamily: 'Sarabun, monospace' }}>{globalSpecs.existingMdbText || "To Existing MDB-03"}</text>
                    </g>
                  )}

                  {feeders.length > 1 && (() => {
                    const mainR = calculateRaceway(globalSpecs.mainCal, systemType, cableOD, conduitSizes, traySizes);
                    return (
                      <g transform={`translate(${centerX + 15}, 190)`} cursor="pointer" onClick={() => focusInput('global', 'mainPhaseCable')}>
                        <text x="0" y="0" fontSize="11" fill="#1e293b" style={{ fontWeight: 'bold', fontFamily: 'Sarabun, monospace' }}>{globalSpecs.mainPhaseCable}</text>
                        <text x="0" y="14" fontSize="11" fill="#047857" style={{ fontWeight: 'bold', fontFamily: 'Sarabun, monospace' }}>{globalSpecs.mainGroundCable}</text>
                        <text x="0" y="28" fontSize="11" fill="#b45309" style={{ fontWeight: 'bold', fontFamily: 'Sarabun, monospace' }}>{mainR.finalSize}</text>
                      </g>
                    );
                  })()}
                  
                  <g transform={`translate(${centerX - (renderItems.length * feederWidth / 2) - 40}, 270)`} cursor="pointer" onClick={() => focusInput('global', 'mdbTitle')}>
                    <text fontSize="16" fill="#1e293b" style={{ fontWeight: 'bold', fontFamily: 'Sarabun, monospace' }}>{globalSpecs.mdbTitle}</text>
                    <text y="20" fontSize="12" fill="#475569" style={{ fontFamily: 'Sarabun, monospace' }}>{globalSpecs.mdbSpec}</text>
                    <text y="38" fontSize="12" fill="#d97706" style={{ fontWeight: 'bold', fontFamily: 'Sarabun, monospace' }}>{globalSpecs.mdbIc}</text>
                  </g>
                  
                  {feeders.length > 1 && (
                    <g cursor="pointer" onClick={() => focusInput('global', 'busbar')}>
                      <rect x={centerX - (renderItems.length * feederWidth / 2) + feederWidth / 2} y="393" width="130" height="18" fill="white" />
                      <text x={centerX - (renderItems.length * feederWidth / 2) + feederWidth / 2} y="405" fontSize="13" fill="#155e75" style={{ fontWeight: 'bold', fontFamily: 'Sarabun, monospace' }}>Busbar {globalSpecs.busbar}</text>
                    </g>
                  )}
                  
                  {renderItems.map((item, i) => { 
                    const xPos = centerX - (renderItems.length * feederWidth / 2) + (i * feederWidth) + feederWidth / 2; 
                    if (item.type === 'skip') return null;
                    const f = item.feeder;
                    const feederIdx = feeders.findIndex(fe => fe.id === f.id);
                    const fR = getFeederRacewaySize(f, feederIdx);
                    return (
                      <g key={`fl-${f.id}`} cursor="pointer" onClick={() => focusInput('feeders', `f-${f.id}-title`)}>
                        <text x={xPos - 20} y="445" fontSize="13" fill="#334155" style={{ fontWeight: 'bold', letterSpacing: '0.05em' }}>{f.title}</text>
                        <g transform={`rotate(-90, ${xPos - 25}, 710)`} onClick={(e) => { e.stopPropagation(); focusInput('feeders', `f-${f.id}-cable1`); }}>
                          <text x={xPos - 25} y="690" fontSize="11" fill="#1e293b" style={{ fontWeight: 'bold', fontFamily: 'Sarabun, monospace', textTransform: 'uppercase' }}>{f.cable1}</text>
                          <text x={xPos - 25} y="705" fontSize="11" fill="#047857" style={{ fontWeight: 'bold', fontFamily: 'Sarabun, monospace', textTransform: 'uppercase' }}>{f.cable2}</text>
                          <text x={xPos - 25} y="720" fontSize="10.5" fill="#b45309" style={{ fontWeight: 'bold', fontFamily: 'Sarabun, monospace', textTransform: 'uppercase' }}>{fR.finalSize}</text>
                          <text x={xPos - 25} y="745" fontSize="10" fill="#64748b" style={{ fontStyle: 'italic', fontFamily: 'Sarabun, monospace' }}>{f.install}</text>
                        </g>
                      </g>
                    ); 
                  })}
                </g>
              </svg>
            </div>
          </div>
        )}
      </div>

      {isSummaryModalOpen && (
        <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#1e293b] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#334155] flex flex-col max-h-[90vh] overflow-hidden">
             <div className="px-6 py-4 border-b border-[#334155] bg-[#0f172a] flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 border border-purple-500/30">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-white">Project Summary Report</h3>
                    <p className="text-[12px] text-slate-400">สรุปรายการอุปกรณ์สายและรางไฟทั้งหมด</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={copyToClipboard} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-bold transition-all border ${copySuccess ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-cyan-600 hover:bg-cyan-500 text-white border-transparent shadow-lg shadow-cyan-900/50'}`}>
                    {copySuccess ? <><Check className="w-4 h-4"/> COPIED!</> : 'COPY TEXT'}
                  </button>
                  <button onClick={() => setIsSummaryModalOpen(false)} className="p-2 text-slate-400 hover:text-white bg-[#1e293b] rounded-lg transition-colors"><X className="w-5 h-5" /></button>
                </div>
             </div>
             <div className="p-6 overflow-auto custom-scrollbar flex-1 bg-[#1e293b]">
               <textarea 
                  readOnly 
                  value={generateSummaryText()}
                  className="w-full h-full min-h-[400px] bg-[#0f172a] border border-[#334155] rounded-xl p-4 text-slate-300 font-mono text-[13px] outline-none resize-none shadow-inner"
               />
             </div>
          </div>
        </div>
      )}

      {isCalModalOpen && (
        <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-md z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white w-full h-full flex flex-col overflow-hidden">
            <div className="bg-[#1e293b] px-6 py-4 flex justify-between items-center shadow-md z-10 shrink-0 border-b border-slate-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/30">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white tracking-wide">AC Cable Sizing Dashboard</h2>
                  <p className="text-[12px] text-cyan-400 font-mono">Real-time load flow & ampacity calculation</p>
                </div>
              </div>
              <div className="flex gap-4">
                {!isViewer && <button onClick={addFeeder} className="flex items-center gap-2 text-[12px] font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-900/30 px-4 py-2 rounded-lg border border-cyan-800/50 transition-all"><Plus className="w-4 h-4"/> ADD FEEDER</button>}
                <button onClick={handleExportCSV} className="flex items-center gap-2 text-[12px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-900/30 px-4 py-2 rounded-lg border border-emerald-800/50 transition-all"><FileSpreadsheet className="w-4 h-4"/> EXCEL EXPORT</button>
                <button onClick={() => setIsCalModalOpen(false)} className="text-slate-400 hover:text-white bg-[#0f172a] p-2 rounded-lg transition-colors border border-[#334155]"><X className="w-6 h-6" /></button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto bg-[#f1f5f9] flex flex-col">
              <div className="bg-white px-6 py-4 border-b border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-6 shrink-0 sticky top-0 z-10">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200 shadow-inner">
                    <span className="text-[12px] font-black text-slate-700 uppercase tracking-widest px-2"><Settings2 className="w-4 h-4 inline mr-1"/> System</span>
                    {['1P 2W', '3P 3W', '3P 4W Full N', 'DC System'].map(sys => (
                      <label key={sys} className={`flex items-center gap-2 ${isViewer ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} px-3 py-1.5 rounded-md transition-all ${systemType === sys ? 'bg-cyan-100 text-cyan-800 shadow-sm font-bold border border-cyan-200' : 'text-slate-600 hover:bg-slate-200'}`}>
                        <input type="checkbox" checked={systemType === sys} onChange={() => !isViewer && handleSystemTypeChange(sys)} disabled={isViewer} className="hidden" />
                        <span className="text-[13px]">{sys}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-300 shadow-sm">
                    <span className="text-[12px] font-bold text-slate-500 uppercase">Voltage (V):</span>
                    <input type="number" value={calVoltage} onChange={(e) => handleCalVoltageChange(e.target.value)} disabled={isViewer} className="w-20 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 px-2 py-1 text-center font-bold text-[14px] text-cyan-800 outline-none font-sarabun disabled:opacity-60" />
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-300 shadow-sm">
                    <span className="text-[12px] font-bold text-slate-500 uppercase">PF:</span>
                    <input type="number" step="0.01" value={globalPf} onChange={(e) => setGlobalPf(e.target.value)} className="w-16 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 px-2 py-1 text-center font-bold text-[14px] text-cyan-800 outline-none font-sarabun disabled:opacity-60" disabled={systemType.includes('DC') || isViewer} />
                  </div>
                  <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200 shadow-sm">
                    <span className="text-[12px] font-bold text-amber-700 uppercase">Max VD (%):</span>
                    <input type="number" step="0.1" value={maxVd} onChange={(e) => setMaxVd(e.target.value)} disabled={isViewer} className="w-16 bg-white border border-amber-300 rounded focus:ring-1 focus:ring-amber-500 px-2 py-1 text-center font-bold text-[14px] text-amber-700 outline-none font-sarabun disabled:opacity-60" />
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 overflow-hidden min-h-[400px]">
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 h-full flex flex-col">
                  <div className="overflow-auto custom-scrollbar flex-1">
                    <table className="w-full text-left border-collapse min-w-max">
                      <thead className="sticky top-0 z-10 shadow-sm">
                        <tr className="bg-[#1e293b] text-slate-300 text-[11px] uppercase tracking-wider font-bold text-center border-b-2 border-cyan-500">
                          <th className="py-4 px-2 border-r border-[#334155] rounded-tl-lg bg-[#0f172a] shadow-r">Equipment ID</th>
                          <th className="py-4 px-2 border-r border-[#334155] bg-[#0f172a] text-purple-400">Action</th>
                          <th className="py-4 px-2 border-r border-[#334155] bg-blue-900/30">Load (kW)</th>
                          <th className="py-4 px-2 border-r border-[#334155] bg-blue-900/30">Amp (A)</th>
                          <th className="py-4 px-2 border-r border-[#334155] bg-blue-900/30">D.F.</th>
                          <th className="py-4 px-2 border-r border-[#334155] bg-blue-900/50 text-cyan-400">Total (A)</th>
                          <th className="py-4 px-2 border-r border-[#334155] bg-amber-900/20 text-amber-400">AT(A)</th>
                          <th className="py-4 px-2 border-r border-[#334155] bg-amber-900/20 text-amber-400">Adj</th>
                          <th className="py-4 px-2 border-r border-[#334155] bg-amber-900/40 text-amber-300">Trip (A)</th>
                          <th className="py-4 px-2 border-r border-[#334155]">AF(A)</th>
                          <th className="py-4 px-2 border-r border-[#334155] bg-slate-800">Installation</th>
                          <th className="py-4 px-2 border-r border-[#334155]">Ref.</th>
                          <th className="py-4 px-2 border-r border-[#334155] bg-emerald-900/20">Cores</th>
                          <th className="py-4 px-2 border-r border-[#334155] bg-emerald-900/20 text-emerald-400">Size</th>
                          <th className="py-4 px-2 border-r border-[#334155] bg-emerald-900/20">Iz (A)</th>
                          <th className="py-4 px-2 border-r border-[#334155]">Ca</th>
                          <th className="py-4 px-2 border-r border-[#334155]">Cg</th>
                          <th className="py-4 px-2 border-r border-[#334155] text-purple-400">Sets</th>
                          <th className="py-4 px-2 border-r border-[#334155] bg-[#0f172a] text-cyan-400">I_derate</th>
                          <th className="py-4 px-2 border-r border-[#334155] bg-[#0f172a]">Status</th>
                          <th className="py-4 px-2 border-r border-[#334155]">Dist(m)</th>
                          <th className="py-4 px-2 border-r border-[#334155] text-amber-400">%VD</th>
                          <th className="py-4 px-2">GND</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white select-none">
                        
                        {/* --- MAIN INCOMER ROW --- */}
                        <tr 
                          onMouseEnter={() => { if (isDragFilling) setDragFillCurrentIdx(0); }}
                          className="text-[12px] text-center border-b-4 border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/80 group relative"
                        >
                          <td 
                            onClick={() => setSelectedRowId('main')}
                            className={`py-3 px-3 font-black text-indigo-900 border-r border-indigo-200 text-left sticky left-0 shadow-r z-0 whitespace-nowrap bg-indigo-100/80 cursor-pointer select-none hover:bg-indigo-200 ${getCellClass('main', 0, 'first')}`}
                          >
                            MAIN INCOMER
                          </td>
                          <td className={`py-2 px-2 border-r border-indigo-100 bg-indigo-100/50 ${getCellClass('main', 0, 'middle')}`}>
                            {!isViewer && (
                              <button onClick={handleAutoSizeMain} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-1.5 rounded shadow-sm hover:from-amber-400 hover:to-orange-400 hover:scale-105 transition-all flex items-center gap-1 text-[10px] mx-auto font-bold" title="Auto Size Main">
                                <Wand2 className="w-3.5 h-3.5"/> AUTO
                              </button>
                            )}
                          </td>
                          <td className={`py-2 px-2 w-[80px] bg-blue-50/30 text-slate-600 font-mono border-r border-indigo-100 ${getCellClass('main', 0, 'middle')}`}>{mainKw.toFixed(1)}</td>
                          <td className={`py-2 px-2 text-slate-600 font-mono bg-blue-50/30 border-r border-indigo-100 ${getCellClass('main', 0, 'middle')}`}>{mainAmpV.toFixed(2)}</td>
                          <td className={`py-2 px-2 w-[70px] bg-blue-50/30 border-r border-indigo-100 ${getCellClass('main', 0, 'middle')}`}><input type="number" step="0.1" value={globalSpecs.mainCal.factor} onChange={(e) => updateMainCalData('factor', e.target.value)} disabled={isViewer} className={inputEngineeringStyle} /></td>
                          <td className={`py-2 px-2 text-indigo-700 font-bold bg-blue-100/40 font-mono border-r border-indigo-100 ${getCellClass('main', 0, 'middle')}`}>{mainTotalA.toFixed(2)}</td>
                          <td className={`py-2 px-2 w-[80px] bg-amber-50/30 border-r border-indigo-100 ${getCellClass('main', 0, 'middle')}`}><select value={globalSpecs.mainCal.at} onChange={(e) => updateMainCalData('at', parseInt(e.target.value))} disabled={isViewer} className={`${inputEngineeringStyle} border-amber-200 bg-amber-50 focus:border-amber-500 focus:ring-amber-500`}>{breakerOptions.map(sz => <option key={sz} value={sz}>{sz}</option>)}</select></td>
                          <td className={`py-2 px-2 w-[70px] bg-amber-50/30 border-r border-indigo-100 ${getCellClass('main', 0, 'middle')}`}><input type="number" step="0.01" value={globalSpecs.mainCal.adjust} onChange={(e) => updateMainCalData('adjust', e.target.value)} disabled={isViewer} className={`${inputEngineeringStyle} border-amber-200 bg-amber-50`} /></td>
                          <td className={`py-2 px-2 text-amber-700 font-bold bg-amber-100/50 font-mono border-r border-indigo-100 ${getCellClass('main', 0, 'middle')}`}>{mainAtAdjustVal.toFixed(1)}</td>
                          <td className={`py-2 px-2 w-[80px] border-r border-indigo-100 ${getCellClass('main', 0, 'middle')}`}><select value={globalSpecs.mainCal.af} onChange={(e) => updateMainCalData('af', parseInt(e.target.value))} disabled={isViewer} className={inputEngineeringStyle}>{breakerOptions.map(sz => <option key={sz} value={sz}>{sz}</option>)}</select></td>
                          <td className={`py-2 px-2 min-w-[150px] bg-indigo-50/50 border-r border-indigo-100 ${getCellClass('main', 0, 'middle')}`}><select value={globalSpecs.mainCal.install} onChange={(e) => updateMainCalData('install', e.target.value)} disabled={isViewer} className={`${inputEngineeringStyle} border-indigo-200`}>{installOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></td>
                          <td className={`py-2 px-2 w-[80px] border-r border-indigo-100 ${getCellClass('main', 0, 'middle')}`}><input type="text" value={globalSpecs.mainCal.ref} onChange={(e) => updateMainCalData('ref', e.target.value)} disabled={isViewer} className={inputEngineeringStyle} /></td>
                          <td className={`py-2 px-2 w-[70px] bg-emerald-50/30 border-r border-indigo-100 ${getCellClass('main', 0, 'middle')}`}><select value={globalSpecs.mainCal.cores} onChange={(e) => updateMainCalData('cores', e.target.value)} disabled={isViewer} className={`${inputEngineeringStyle} bg-emerald-50 border-emerald-200`}>{['1C','2C','3C','4C'].map(c=><option key={c}>{c}</option>)}</select></td>
                          <td className={`py-2 px-2 w-[80px] bg-emerald-50/30 border-r border-indigo-100 ${getCellClass('main', 0, 'middle')}`}><select value={globalSpecs.mainCal.size} onChange={(e) => updateMainCalData('size', e.target.value)} disabled={isViewer} className={`${inputEngineeringStyle} font-bold text-emerald-800 bg-emerald-50 border-emerald-300`}>{sizeOptions.map(sz => <option key={sz} value={sz}>{sz}</option>)}</select></td>
                          <td className={`py-2 px-2 text-emerald-800 font-bold bg-emerald-50/50 font-mono text-[13px] border-r border-indigo-100 ${getCellClass('main', 0, 'middle')}`}>{globalSpecs.mainCal.ampCable}</td>
                          <td className={`py-2 px-2 w-[60px] border-r border-indigo-100 ${getCellClass('main', 0, 'middle')}`}><input type="number" step="0.1" value={globalSpecs.mainCal.ca} onChange={(e) => updateMainCalData('ca', e.target.value)} disabled={isViewer} className={inputEngineeringStyle} /></td>
                          <td className={`py-2 px-2 w-[60px] border-r border-indigo-100 ${getCellClass('main', 0, 'middle')}`}><input type="number" step="0.1" value={globalSpecs.mainCal.cg} onChange={(e) => updateMainCalData('cg', e.target.value)} disabled={isViewer} className={inputEngineeringStyle} /></td>
                          <td className={`py-2 px-2 w-[60px] border-r border-indigo-100 ${getCellClass('main', 0, 'middle')}`}><input type="number" value={globalSpecs.mainCal.set} onChange={(e) => updateMainCalData('set', e.target.value)} disabled={isViewer} className={`${inputEngineeringStyle} border-indigo-400 bg-indigo-100 text-indigo-900 font-bold`} /></td>
                          <td className={`py-2 px-2 font-bold text-indigo-800 bg-indigo-100 font-mono border-r border-indigo-200 ${getCellClass('main', 0, 'middle')}`}>{mainAmpDerate.toFixed(1)}</td>
                          <td className={`py-2 px-2 bg-indigo-50 border-r border-indigo-100 ${getCellClass('main', 0, 'middle')}`}>
                            <div className={`px-2 py-1 rounded shadow-sm text-[10px] font-black uppercase tracking-wider ${isMainAmpPass ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white animate-pulse'}`}>{isMainAmpPass ? 'OK' : 'FAIL'}</div>
                          </td>
                          <td className={`py-2 px-2 w-[70px] border-r border-indigo-100 ${getCellClass('main', 0, 'middle')}`}><input type="number" value={globalSpecs.mainCal.dist} onChange={(e) => updateMainCalData('dist', e.target.value)} disabled={isViewer} className={inputEngineeringStyle} /></td>
                          <td className={`py-2 px-2 font-bold font-mono w-[70px] border-r border-indigo-100 ${mainVd > parseFloat(maxVd) ? 'text-red-600 bg-red-50 border-x border-red-200' : 'text-emerald-700 bg-emerald-50/50'} ${getCellClass('main', 0, 'middle')}`}>
                            {mainVd.toFixed(2)}
                          </td>
                          <td className={`py-2 px-2 w-[70px] relative ${getCellClass('main', 0, 'last')}`}>
                            <input type="text" value={globalSpecs.mainCal.ground} onChange={(e) => updateMainCalData('ground', e.target.value)} disabled={isViewer} className={inputEngineeringStyle} />
                            {selectedRowId === 'main' && !isViewer && (
                              <div 
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  setIsDragFilling(true);
                                  setDragFillStartIdx(rowIds.indexOf('main'));
                                  setDragFillCurrentIdx(rowIds.indexOf('main'));
                                }}
                                className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 border border-white cursor-crosshair z-30 rounded-none shadow" 
                                title="Drag to copy"
                              />
                            )}
                          </td>
                        </tr>

                        {/* --- FEEDER ROWS --- */}
                        {feeders.map((f, i) => {
                          const ampV = parseFloat(f.loadA) || 0; const factorV = parseFloat(f.cal.factor) || 1; const totalA = ampV * factorV;
                          const ampDerate = (parseFloat(f.cal.ampCable)||0) * (parseFloat(f.cal.ca)||1) * (parseFloat(f.cal.cg)||1) * (parseInt(f.cal.set)||1);
                          const isRowActive = f.id === activeCalFeederId; const adj = f.cal.adjust !== '' && !isNaN(f.cal.adjust) ? parseFloat(f.cal.adjust) : 1;
                          const atAdjustVal = f.cal.at * adj; const isAmpPass = ampDerate >= atAdjustVal; const calcVd = getCalculatedVd(f, systemType, calVoltage, globalPf, cableDB); const vdLimit = parseFloat(maxVd) || 2.5;
                          const rowIdx = i + 1;

                          return (
                            <tr 
                              key={f.id} 
                              onMouseEnter={() => { if (isDragFilling) setDragFillCurrentIdx(rowIdx); }}
                              className={`text-[12px] text-center border-b border-slate-200 transition-colors ${isRowActive ? 'bg-cyan-50' : i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-blue-50/80 group relative`}
                            >
                              <td 
                                onClick={() => setSelectedRowId(f.id)}
                                className={`py-3 px-3 font-bold text-slate-800 border-r border-slate-200 bg-slate-100/50 group-hover:bg-blue-100/50 text-left sticky left-0 shadow-r z-0 whitespace-nowrap cursor-pointer select-none hover:bg-slate-200 ${getCellClass(f.id, rowIdx, 'first')}`}
                              >
                                <div className="flex items-center justify-between gap-2 w-full">
                                  <div className="flex items-center gap-1 flex-1 min-w-0">
                                    <span className="shrink-0 text-slate-500 font-semibold text-[11px]">{f.title}:</span>
                                    <input 
                                      type="text" 
                                      value={f.loadTitle} 
                                      onChange={(e) => updateFeeder(f.id, 'loadTitle', e.target.value)} 
                                      disabled={isViewer}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedRowId(f.id);
                                      }}
                                      className="bg-transparent hover:bg-slate-200/50 focus:bg-white border-0 border-b border-transparent focus:border-cyan-500 focus:ring-0 px-1 py-0.5 rounded text-[12px] font-bold text-slate-800 w-full outline-none transition-all disabled:opacity-70" 
                                    />
                                  </div>
                                  {!isViewer && (
                                    <button 
                                      onClick={(e) => { 
                                        e.stopPropagation(); 
                                        removeFeeder(f.id); 
                                      }} 
                                      className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-all flex items-center justify-center shrink-0" 
                                      title="Delete Feeder"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                              <td className={`py-2 px-2 bg-purple-50/30 ${getCellClass(f.id, rowIdx, 'middle')}`}>
                                {!isViewer && (
                                  <button onClick={() => handleAutoSize(f.id)} className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-1.5 rounded shadow-sm hover:from-purple-400 hover:to-indigo-400 hover:scale-105 transition-all flex items-center justify-center gap-1 text-[10px] mx-auto font-bold" title="Auto Size">
                                    <Wand2 className="w-3.5 h-3.5"/> AUTO
                                  </button>
                                )}
                              </td>
                              <td className={`py-2 px-2 w-[80px] bg-blue-50/30 ${getCellClass(f.id, rowIdx, 'middle')}`}><input type="number" step="0.1" value={f.loadKw} onChange={(e) => updateFeeder(f.id, 'loadKw', e.target.value)} disabled={isViewer} className={inputEngineeringStyle} /></td>
                              <td className={`py-2 px-2 text-slate-600 font-mono bg-blue-50/30 ${getCellClass(f.id, rowIdx, 'middle')}`}>{ampV.toFixed(2)}</td>
                              <td className={`py-2 px-2 w-[70px] bg-blue-50/30 ${getCellClass(f.id, rowIdx, 'middle')}`}><input type="number" step="0.1" value={f.cal.factor} onChange={(e) => updateCalData(f.id, 'factor', e.target.value)} disabled={isViewer} className={inputEngineeringStyle} /></td>
                              <td className={`py-2 px-2 text-cyan-700 font-bold bg-blue-100/40 font-mono ${getCellClass(f.id, rowIdx, 'middle')}`}>{totalA.toFixed(2)}</td>
                              <td className={`py-2 px-2 w-[80px] bg-amber-50/30 ${getCellClass(f.id, rowIdx, 'middle')}`}><select value={f.cal.at} onChange={(e) => updateCalData(f.id, 'at', parseInt(e.target.value))} disabled={isViewer} className={`${inputEngineeringStyle} border-amber-200 bg-amber-50 focus:border-amber-500 focus:ring-amber-500`}>{breakerOptions.map(sz => <option key={sz} value={sz}>{sz}</option>)}</select></td>
                              <td className={`py-2 px-2 w-[70px] bg-amber-50/30 ${getCellClass(f.id, rowIdx, 'middle')}`}><input type="number" step="0.01" value={f.cal.adjust} onChange={(e) => updateCalData(f.id, 'adjust', e.target.value)} disabled={isViewer} className={`${inputEngineeringStyle} border-amber-200 bg-amber-50`} /></td>
                              <td className={`py-2 px-2 text-amber-700 font-bold bg-amber-100/50 font-mono ${getCellClass(f.id, rowIdx, 'middle')}`}>{(f.cal.at * adj).toFixed(1)}</td>
                              <td className={`py-2 px-2 w-[80px] ${getCellClass(f.id, rowIdx, 'middle')}`}><select value={f.cal.af} onChange={(e) => updateCalData(f.id, 'af', parseInt(e.target.value))} disabled={isViewer} className={inputEngineeringStyle}>{breakerOptions.map(sz => <option key={sz} value={sz}>{sz}</option>)}</select></td>
                              <td className={`py-2 px-2 min-w-[150px] bg-slate-50 ${getCellClass(f.id, rowIdx, 'middle')}`}><select value={f.cal.install} onChange={(e) => updateCalData(f.id, 'install', e.target.value)} disabled={isViewer} className={inputEngineeringStyle}>{installOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></td>
                              <td className={`py-2 px-2 w-[80px] ${getCellClass(f.id, rowIdx, 'middle')}`}><input type="text" value={f.cal.ref} onChange={(e) => updateCalData(f.id, 'ref', e.target.value)} disabled={isViewer} className={inputEngineeringStyle} /></td>
                              <td className={`py-2 px-2 w-[70px] bg-emerald-50/30 ${getCellClass(f.id, rowIdx, 'middle')}`}><select value={f.cal.cores} onChange={(e) => updateCalData(f.id, 'cores', e.target.value)} disabled={isViewer} className={`${inputEngineeringStyle} bg-emerald-50 border-emerald-200`}>{['1C','2C','3C','4C'].map(c=><option key={c}>{c}</option>)}</select></td>
                              <td className={`py-2 px-2 w-[80px] bg-emerald-50/30 ${getCellClass(f.id, rowIdx, 'middle')}`}><select value={f.cal.size} onChange={(e) => updateCalData(f.id, 'size', e.target.value)} disabled={isViewer} className={`${inputEngineeringStyle} font-bold text-emerald-800 bg-emerald-50 border-emerald-300`}>{sizeOptions.map(sz => <option key={sz} value={sz}>{sz}</option>)}</select></td>
                              <td className={`py-2 px-2 text-emerald-800 font-bold bg-emerald-50/50 font-mono text-[13px] ${getCellClass(f.id, rowIdx, 'middle')}`}>{f.cal.ampCable}</td>
                              <td className={`py-2 px-2 w-[60px] ${getCellClass(f.id, rowIdx, 'middle')}`}><input type="number" step="0.1" value={f.cal.ca} onChange={(e) => updateCalData(f.id, 'ca', e.target.value)} disabled={isViewer} className={inputEngineeringStyle} /></td>
                              <td className={`py-2 px-2 w-[60px] ${getCellClass(f.id, rowIdx, 'middle')}`}><input type="number" step="0.1" value={f.cal.cg} onChange={(e) => updateCalData(f.id, 'cg', e.target.value)} disabled={isViewer} className={inputEngineeringStyle} /></td>
                              <td className={`py-2 px-2 w-[60px] ${getCellClass(f.id, rowIdx, 'middle')}`}><input type="number" value={f.cal.set} onChange={(e) => updateCalData(f.id, 'set', e.target.value)} disabled={isViewer} className={`${inputEngineeringStyle} border-purple-300 bg-purple-50 text-purple-800 font-bold`} /></td>
                              <td className={`py-2 px-2 font-bold text-cyan-800 bg-slate-100 font-mono ${getCellClass(f.id, rowIdx, 'middle')}`}>{ampDerate.toFixed(1)}</td>
                              <td className={`py-2 px-2 bg-slate-50 ${getCellClass(f.id, rowIdx, 'middle')}`}>
                                <div className={`px-2 py-1 rounded shadow-sm text-[10px] font-black uppercase tracking-wider ${isAmpPass ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white animate-pulse'}`}>{isAmpPass ? 'OK' : 'FAIL'}</div>
                              </td>
                              <td className={`py-2 px-2 w-[70px] ${getCellClass(f.id, rowIdx, 'middle')}`}><input type="number" value={f.cal.dist} onChange={(e) => updateCalData(f.id, 'dist', e.target.value)} disabled={isViewer} className={inputEngineeringStyle} /></td>
                              <td className={`py-2 px-2 font-bold font-mono w-[70px] ${calcVd > vdLimit ? 'text-red-600 bg-red-50 border-x border-red-200' : 'text-emerald-700 bg-emerald-50/50'} ${getCellClass(f.id, rowIdx, 'middle')}`}>
                                {calcVd.toFixed(2)}
                              </td>
                              <td className={`py-2 px-2 w-[70px] relative ${getCellClass(f.id, rowIdx, 'last')}`}>
                                <input type="text" value={f.cal.ground} onChange={(e) => updateCalData(f.id, 'ground', e.target.value)} disabled={isViewer} className={inputEngineeringStyle} />
                                {selectedRowId === f.id && !isViewer && (
                                  <div 
                                    onMouseDown={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      setIsDragFilling(true);
                                      setDragFillStartIdx(rowIds.indexOf(f.id));
                                      setDragFillCurrentIdx(rowIds.indexOf(f.id));
                                    }}
                                    className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 border border-white cursor-crosshair z-30 rounded-none shadow"
                                    title="Drag to copy"
                                  />
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#f8fafc] px-6 py-5 border-t border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] relative z-20 shrink-0">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-[15px] font-bold text-slate-800 flex items-center gap-2"><Info className="w-4 h-4 text-cyan-600" /> Note: สูตรคำนวณที่ใช้ในระบบ</h4>
                  <button onClick={handleApplyCalToDiagram} className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-2.5 rounded-lg shadow-md hover:from-cyan-500 hover:to-blue-500 text-[13px] font-bold tracking-wide flex items-center gap-2 transition-transform transform hover:scale-105">
                    UPDATE DIAGRAM & CLOSE
                  </button>
                </div>
                
                <div className="grid grid-cols-5 gap-4">
                  <div className="space-y-1.5 border-r border-slate-200 pr-4">
                    <p className="text-[12px] font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">1. สูตรหา Amp (A)</p>
                    <p className="text-[11px] text-cyan-700 font-bold">3-Phase: <span className="text-slate-600 font-normal">I = (kW × 1000) / (√3 × V)</span></p>
                    <p className="text-[11px] text-cyan-700 font-bold">1-Phase: <span className="text-slate-600 font-normal">I = (kW × 1000) / V</span></p>
                  </div>
                  
                  <div className="space-y-1.5 border-r border-slate-200 pr-4">
                    <p className="text-[12px] font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">2. สูตรหา Amp Derate</p>
                    <p className="text-[11px] text-slate-600 font-mono">I<sub>derate</sub> = Amp Cable × Ca × Cg × Set</p>
                  </div>
                  
                  <div className="space-y-1.5 border-r border-slate-200 pr-4">
                    <p className="text-[12px] font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">3. สูตรหา %VD</p>
                    <p className="text-[11px] text-cyan-700 font-bold">3-Ph: <span className="text-slate-600 font-normal">(√3 × I × L × (R cosΦ + X sinΦ) × 100) / (1000 × V)</span></p>
                    <p className="text-[11px] text-cyan-700 font-bold">1-Ph: <span className="text-slate-600 font-normal">(2 × I × L × (R cosΦ + X sinΦ) × 100) / (1000 × V)</span></p>
                  </div>
                  
                  <div className="space-y-1.5 border-r border-slate-200 pr-4">
                    <p className="text-[12px] font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">4. สูตรหาขนาดสายดิน (วสท.)</p>
                    <p className="text-[11px] text-cyan-700 font-bold">Feeder (บริภัณฑ์): <span className="text-slate-600 font-normal">อิงเบรกเกอร์ AT(adjust)</span></p>
                    <p className="text-[11px] text-cyan-700 font-bold">Main (ประธาน): <span className="text-slate-600 font-normal">อิงสายเมน (Size × Set)</span></p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <p className="text-[12px] font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">5. สูตรหาค่าลัดวงจร (Ic)</p>
                    <p className="text-[11px] text-cyan-700 font-bold">I<sub>sc(tr)</sub>: <span className="text-slate-600 font-normal">(I<sub>FL</sub> × 100) / %Z</span></p>
                    <p className="text-[11px] text-cyan-700 font-bold">I<sub>sc(total)</sub>: <span className="text-slate-600 font-normal">I<sub>sc(tr)</sub> + I<sub>FL</sub></span></p>
                    <div className="mt-2 p-1.5 border border-slate-200 rounded text-[10px]">
                      <span className="font-bold text-slate-700">CB Standard Step (kA):</span><br/>
                      <span className="text-amber-600 font-bold">10, 16, 25, 36, 50, 65, 85, 100, 125, 150</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500&display=swap');
        
        .font-sarabun, .font-sans, .font-mono {
          font-family: 'Sarabun', sans-serif !important;
        }

        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .shadow-r { box-shadow: 4px 0 6px -1px rgba(0, 0, 0, 0.05); }
      `}} />
    </div>
  );
};

export default App;