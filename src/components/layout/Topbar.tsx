export default function Topbar() {
  return (
    <header className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <h2 className="font-semibold text-lg">Welcome to Graston Dashboard</h2>
      <button className="px-3 py-1 bg-gray-800 text-white rounded">Logout</button>
    </header>
  );
}
