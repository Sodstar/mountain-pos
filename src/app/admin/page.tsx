import React from 'react';

function page() {
  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panels</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <a href="#" className="text-gray-300 hover:text-white">Dashboard</a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white">Products</a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white">Orders</a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white">Settings</a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Admin Dashboard</h1>
        <p className="text-gray-600">
          Use the sidebar to navigate through the admin functionalities.
        </p>
      </main>
    </div>
  );
}

export default page;