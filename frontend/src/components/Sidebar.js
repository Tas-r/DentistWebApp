// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, FileText, MessageSquare, HelpCircle, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen flex flex-col">
      <div className="p-5">
        <h2 className="text-xl font-bold">Dashboard</h2>
      </div>
      
      <nav className="flex-1">
        <NavLink to="/" className={({ isActive }) => 
          `flex items-center p-4 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
        }>
          <Home className="w-5 h-5 mr-3" />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/appointments" className={({ isActive }) => 
          `flex items-center p-4 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
        }>
          <Calendar className="w-5 h-5 mr-3" />
          <span>Appointments</span>
        </NavLink>
        
        <NavLink to="/documents" className={({ isActive }) => 
          `flex items-center p-4 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
        }>
          <FileText className="w-5 h-5 mr-3" />
          <span>Documents</span>
        </NavLink>
        
        <NavLink to="/messages" className={({ isActive }) => 
          `flex items-center p-4 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
        }>
          <MessageSquare className="w-5 h-5 mr-3" />
          <span>Messages</span>
        </NavLink>
      </nav>
      
      <div className="p-4 mt-auto border-t border-gray-700">
        <NavLink to="/support" className="flex items-center p-2 hover:bg-gray-700 rounded">
          <HelpCircle className="w-5 h-5 mr-3" />
          <span>Support</span>
        </NavLink>
        
        <NavLink to="/settings" className="flex items-center p-2 hover:bg-gray-700 rounded">
          <Settings className="w-5 h-5 mr-3" />
          <span>Settings</span>
        </NavLink>
        
        <button className="flex items-center p-2 w-full text-left hover:bg-gray-700 rounded">
          <LogOut className="w-5 h-5 mr-3" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;