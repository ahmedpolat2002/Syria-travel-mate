import { useState } from "react";
import { CiFilter } from "react-icons/ci";
import { SlArrowDown } from "react-icons/sl";
import { PiCityLight } from "react-icons/pi";
import { FiHome } from "react-icons/fi";
import styles from "./Sidebar.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface SidebarProps {
  onLocationClick: (lat: number, lng: number, name: string) => void;
  selectedLocation: {
    id: string;
    name: string;
    lat: number;
    lng: number;
    type?: string;
  } | null;
  filters: string[];
  onFilterChange: (filters: string[]) => void;
  filterOptions: string[];
  governorates: {
    name: string;
    lat: number;
    lng: number;
  }[];
}

const Sidebar: React.FC<SidebarProps> = ({
  onLocationClick,
  selectedLocation,
  filters,
  onFilterChange,
  filterOptions,
  governorates,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showGovs, setShowGovs] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  const handleCheckboxChange = (type: string) => {
    const newFilters = filters.includes(type)
      ? filters.filter((f) => f !== type)
      : [...filters, type];
    onFilterChange(newFilters);
  };

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.closed : ""}`}>
      <div
        className={styles.menuButton}
        onClick={() => setCollapsed(!collapsed)}
      >
        <Image
          src="/icon.png"
          alt="Logo"
          width={40}
          height={40}
          style={{ marginLeft: "10px" }}
        />
        {!collapsed && <span className={styles.label2}>TravelMate</span>}
      </div>

      <ul className={styles.menuList}>
        {/* الصفحة الرئيسية */}
        <li className={styles.menuItem} onClick={() => router.push("/")}>
          <div className={styles.iconWrapper}>
            <FiHome
              className={`${styles.icon} ${collapsed ? styles.closedicon : ""}`}
            />
          </div>
          {!collapsed && <span className={styles.label}>الصفحة الرئيسية</span>}
        </li>
        {/* المحافظات */}
        <li className={styles.menuItem} onClick={() => setShowGovs(!showGovs)}>
          <div className={styles.iconWrapper}>
            <PiCityLight
              className={`${styles.icon} ${collapsed ? styles.closedicon : ""}`}
            />
            {/* {collapsed && <span className={styles.tooltip}>المحافظات</span>} */}
          </div>
          {!collapsed && <span className={styles.label}>المحافظات</span>}
          {!collapsed && (
            <SlArrowDown
              className={`${styles.dropDownIcon} ${
                showGovs ? styles.rotate : ""
              }`}
            />
          )}
        </li>

        {!collapsed && (
          <ul
            className={`${styles.subMenu} ${
              showGovs ? styles.open : styles.closed
            }`}
          >
            {governorates.map((gov) => (
              <li
                key={gov.name}
                className={styles.menuItem}
                style={{ paddingLeft: "40px" }}
                onClick={() => onLocationClick(gov.lat, gov.lng, gov.name)}
              >
                <span className={styles.labelofgovrment}>{gov.name}</span>
              </li>
            ))}
          </ul>
        )}

        {/* الفلترة */}
        <li
          className={styles.menuItem}
          onClick={() => setShowFilters(!showFilters)}
        >
          <div className={styles.iconWrapper}>
            <CiFilter
              className={`${styles.icon} ${collapsed ? styles.closedicon : ""}`}
            />
            {/* {collapsed && <span className={styles.tooltip}>فلترة</span>} */}
          </div>
          {!collapsed && <span className={styles.label}>فلترة</span>}
          {!collapsed && (
            <SlArrowDown
              className={`${styles.dropDownIcon} ${
                showFilters ? styles.rotate : ""
              }`}
            />
          )}
        </li>

        {!collapsed && (
          <ul
            className={`${styles.subMenu} ${
              showFilters ? styles.open : styles.closed
            }`}
          >
            <div className={styles.filtersWrapper}>
              {filterOptions.map((type, index) => (
                <label key={index} className={styles.filterLabel}>
                  <input
                    className={styles.filterInput}
                    type="checkbox"
                    checked={filters.includes(type)}
                    onChange={() => handleCheckboxChange(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </ul>
        )}

        {/* تفاصيل الموقع */}
        {selectedLocation &&
          !collapsed &&
          !governorates.some(
            (gov) =>
              gov.name === selectedLocation.name &&
              gov.lat === selectedLocation.lat &&
              gov.lng === selectedLocation.lng
          ) && (
            <div className={styles.detailsBox}>
              <h4 style={{ color: "white", marginBottom: "10px" }}>
                تفاصيل الموقع
              </h4>
              <p style={{ color: "#d0d9cb" }}>{selectedLocation.name}</p>
              <button
                className={styles.detailsButton}
                onClick={() => {
                  if (!selectedLocation) return;
                  const isEvent = selectedLocation.type === "فعالية";
                  const basePath = isEvent ? "/events" : "/places";
                  router.push(`${basePath}/${selectedLocation.id}`);
                }}
              >
                عرض المزيد
              </button>
            </div>
          )}
      </ul>
    </div>
  );
};

export default Sidebar;