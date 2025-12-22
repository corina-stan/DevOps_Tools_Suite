import React, { useState } from 'react';
import { Key, Code, Shield, FileText, FileJson, Repeat, Hash, Link, Clock, FileSearch, Home } from 'lucide-react';
import PasswordGenerator from './PasswordGenerator';
import Base64Tool from './Base64Tool';
import JWTDecoder from './JWTDecoder';
import CertDecoder from './CertDecoder';
import JSONFormatter from './JSONFormatter';
import YAMLConverter from './YAMLConverter';
import HashGenerator from './HashGenerator';
import URLEncoder from './URLEncoder';
import TimestampConverter from './TimestampConverter';
import RegexTester from './RegexTester';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const tools = [
    { id: 'password', name: 'Password Generator', icon: Key, component: PasswordGenerator, category: 'Security' },
    { id: 'base64', name: 'Base64 Encoder/Decoder', icon: Code, component: Base64Tool, category: 'Encoding' },
    { id: 'jwt', name: 'JWT Decoder', icon: Shield, component: JWTDecoder, category: 'Security' },
    { id: 'cert', name: 'Certificate Decoder', icon: FileText, component: CertDecoder, category: 'Security' },
    { id: 'json', name: 'JSON Formatter', icon: FileJson, component: JSONFormatter, category: 'Data' },
    { id: 'yaml', name: 'YAML Converter', icon: Repeat, component: YAMLConverter, category: 'Data' },
    { id: 'hash', name: 'Hash Generator', icon: Hash, component: HashGenerator, category: 'Security' },
    { id: 'url', name: 'URL Encoder/Decoder', icon: Link, component: URLEncoder, category: 'Encoding' },
    { id: 'timestamp', name: 'Timestamp Converter', icon: Clock, component: TimestampConverter, category: 'Data' },
    { id: 'regex', name: 'Regex Tester', icon: FileSearch, component: RegexTester, category: 'Testing' }
  ];

  const CurrentComponent = tools.find(t => t.id === currentPage)?.component;

  // Group tools by category
  const categories = [...new Set(tools.map(t => t.category))];
  const groupedTools = categories.map(category => ({
    name: category,
    tools: tools.filter(t => t.category === category)
  }));

  return (
    <div className="min-h-screen bg-gray-100 h-screen justify-between">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">DevOps Tools Suite</h1>
              <p className="text-blue-100 text-sm mt-1">10 Essential Tools for DevOps Engineers</p>
            </div>
            {currentPage !== 'home' && (
              <button
                onClick={() => setCurrentPage('home')}
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md transition-colors"
              >
                <Home size={20} />
                Home
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 mb-auto">
        {currentPage === 'home' ? (
          <div>
            <p className="text-gray-600 mb-8 text-lg">
              Essential utilities for your daily workflow - all in one place
            </p>
            
            {groupedTools.map(group => (
              <div key={group.name} className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm">
                    {group.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({group.tools.length} {group.tools.length === 1 ? 'tool' : 'tools'})
                  </span>
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {group.tools.map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => setCurrentPage(tool.id)}
                      className="bg-white rounded-lg shadow-md p-5 hover:shadow-xl transition-all text-left group hover:-translate-y-1"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <tool.icon className="text-blue-600" size={20} />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {tool.name}
                      </h3>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <CurrentComponent />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>DevOps Tools Suite - Built for Engineers, by Engineers</p>
            <div className="flex gap-4 text-sm text-gray-400">
              <span>{tools.length} Tools Available</span>
              <span>•</span>
              <span>Open Source</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;