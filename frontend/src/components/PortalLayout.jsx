import Sidebar from "./Sidebar"

function PortalLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 p-4">{children}</main>
    </div>
  )
}

export default PortalLayout

