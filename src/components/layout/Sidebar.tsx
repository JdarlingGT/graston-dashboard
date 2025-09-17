import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/" },
  { name: "Orders", path: "/orders" },
  { name: "Events", path: "/events" },
  { name: "Attendees", path: "/attendees" },
  { name: "Certification", path: "/certification" },
  { name: "CEU", path: "/ceu" },
  { name: "Analytics", path: "/analytics" },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <h1 className="text-xl font-bold mb-6">Graston Dashboard</h1>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`block px-3 py-2 rounded ${
                pathname === item.path ? "bg-gray-700" : "hover:bg-gray-800"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
