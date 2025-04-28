import styles from "./SectionName.module.css";

interface EventSec {
  title: string;
}

const SectionName: React.FC<EventSec> = ({ title }) => {
  return <p className={styles.tage}>{title}</p>;
};

export default SectionName;
