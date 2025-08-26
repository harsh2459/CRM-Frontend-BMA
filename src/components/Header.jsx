import '../style/components/Header.css';
import { FaBell } from 'react-icons/fa';

const Header = () => {
    return (
        <header className="dashboard-header">
            <div className="header-left">
                <span className="logo-text">BookMy<strong>Assignment</strong></span>
            </div>

            <div className="header-center">
                <input
                    type="text"
                    placeholder="Search"
                    className="search-input"
                />
            </div>

            <div className="header-right">
                {/* <img src={bell} className="icons" alt="bell" /> */}
                <FaBell className='dark-icons'/>
                <div className="admin-info">
                    <div className="avatar">HB</div>
                    <div className="admin-text">
                        <div className="admin-name">Harsh</div>
                        <div className="admin-role">Admin</div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
