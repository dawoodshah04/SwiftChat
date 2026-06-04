import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface Props {
  children: React.ReactNode;
  extraClass?: string;
}

const Layout = ({ children, extraClass }: Props) => (
  <div className={`app-shell${extraClass ? ` ${extraClass}` : ''}`}>
    <Navbar />
    <Sidebar />
    <main className="app-main">{children}</main>
  </div>
);

export default Layout;
