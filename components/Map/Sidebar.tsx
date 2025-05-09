import { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { CiLocationOn, CiFilter } from 'react-icons/ci';
import styles from './Sidebar.module.css';

interface SidebarProps {
    onLocationClick: (lat: number, lng: number, name: string) => void;
    selectedLocation: { name: string; lat: number; lng: number } | null;
    filters: string[];
    onFilterChange: (filters: string[]) => void;
}

const governorates = [
    { name: 'دمشق', lat: 33.5138, lng: 36.2765 },
    { name: 'ريف دمشق', lat: 33.5167, lng: 36.8667 },
    { name: 'القنيطرة', lat: 33.1258, lng: 35.8245 },
    { name: 'درعا', lat: 32.6257, lng: 36.106 },
    { name: 'السويداء', lat: 32.704, lng: 36.5649 },
    { name: 'حمص', lat: 34.7314, lng: 36.7096 },
    { name: 'حماة', lat: 35.1318, lng: 36.754 },
    { name: 'طرطوس', lat: 34.889, lng: 35.8866 },
    { name: 'اللاذقية', lat: 35.5196, lng: 35.7915 },
    { name: 'إدلب', lat: 35.9306, lng: 36.6339 },
    { name: 'حلب', lat: 36.2021, lng: 37.1343 },
    { name: 'الرقة', lat: 35.9594, lng: 39.0078 },
    { name: 'دير الزور', lat: 35.3356, lng: 40.1406 },

];

const filterTypes = ['حديقة', 'فندق', 'مطعم'];

const Sidebar: React.FC<SidebarProps> = ({ onLocationClick, selectedLocation, filters, onFilterChange }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [showGovs, setShowGovs] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const handleCheckboxChange = (type: string) => {
        const newFilters = filters.includes(type)
            ? filters.filter(f => f !== type)
            : [...filters, type];
        onFilterChange(newFilters);
    };

    return (
        <div className={`${styles.sidebar} ${collapsed ? styles.closed : ''}`}>
            <div className={styles.menuButton} onClick={() => setCollapsed(!collapsed)}>
                <FaBars />
            </div>

            <ul className={styles.menuList}>
                <li className={styles.menuItem} onClick={() => setShowGovs(!showGovs)}>
                    <CiLocationOn className={styles.icon} />
                    {!collapsed && <span className={styles.label}>المحافظات</span>}
                </li>
                {showGovs && !collapsed && governorates.map(gov => (
                    <li key={gov.name} className={styles.menuItem} onClick={() => onLocationClick(gov.lat, gov.lng, gov.name)}>
                        <ul><li className={styles.label}>{gov.name}</li></ul>
                    </li>
                ))}

                <li className={styles.menuItem} onClick={() => setShowFilters(!showFilters)}>
                    <CiFilter className={styles.icon} />
                    {!collapsed && <span className={styles.label}>فلترة</span>}
                </li>
                {showFilters && !collapsed && (
                    <li className={styles.menuItems}>
                        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '30px' }}>
                            {filterTypes.map((type, index) => (
                                <label key={index} className={styles.filterLabel}>
                                    <input
                                        className={styles.filterInput}
                                        type="checkbox"
                                        checked={filters.includes(type)}
                                        onChange={() => handleCheckboxChange(type)}
                                    /> {type}
                                </label>
                            ))}
                        </div>
                    </li>
                )}

                {selectedLocation && !collapsed && (
                    <div className={styles.detailsBox}>
                        <h4 style={{ color: 'white', marginBottom: '10px' }}>تفاصيل الموقع</h4>
                        <p style={{ color: '#d0d9cb' }}>{selectedLocation.name}</p>
                        <button className={styles.detailsButton}>عرض المزيد</button>
                    </div>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
