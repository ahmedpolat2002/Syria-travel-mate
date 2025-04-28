import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.overlay} />

            <div className={styles.content}>
                {/* Logo & Description */}
                <div className={styles.column}>
                    <h2 className={styles.logo}>✈️ Syria Travels</h2>
                    <p className={styles.text}>
                        مغامرتك تبدأ من هنا — اكتشف، استمتع، واستلهم من سحر سوريا.
                    </p>
                </div>

                {/* Links */}
                <div className={styles.column}>
                    <h3 className={styles.title}>استكشاف</h3>
                    <ul className={styles.links}>
                        <li><a href="#">الرئيسية</a></li>
                        <li><a href="#">الوجهات</a></li>
                        <li><a href="#">الفعاليات</a></li>
                        <li><a href="#">تواصل معنا</a></li>
                    </ul>
                </div>

                {/* Social */}
                <div className={styles.column}>
                    <h3 className={styles.title}>تابعنا</h3>
                    <div className={styles.social}>
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fab fa-youtube"></i></a>
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                © {new Date().getFullYear()} Syria Travels — تصميم بإحساس السفر.
            </div>
        </footer>
    );
};

export default Footer;
