"use client";
import React from "react";
import { FaMapMarkedAlt, FaUserFriends, FaShieldAlt } from "react-icons/fa";
import styles from "./About.module.css";
import Image from "next/image";
import img from "../../public/aboutUs.png";

const About: React.FC = () => {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <Image width={800} height={400} src={img} alt="Syria" />
        </div>

        <div className={styles.content}>
          <div className={styles.sectionTitle}>
            <h2>حول TravelMate دليلك لاستكشاف سوريا</h2>
            {/* <p>
              Explore the rich history, culture, and natural beauty of Syria
            </p> */}
          </div>

          <p>
            TravelMate هو موقع إلكتروني يهدف إلى توفير تجربة فريدة من نوعها
            للمسافرين الذين يرغبون في استكشاف سوريا. نحن نقدم معلومات شاملة عن
            الأماكن السياحية، الفعاليات الثقافية، والأنشطة المتنوعة التي يمكن
            للزوار الاستمتاع بها. هدفنا هو تعزيز السياحة في سوريا من خلال تقديم
            محتوى موثوق ومفيد يساعد الزوار على اكتشاف جمال هذا البلد الغني
            بالتاريخ والثقافة.
          </p>

          <div className={styles.features}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <FaMapMarkedAlt size={20} />
              </div>
              <div className={styles.featureText}>
                <h3>دليل سياحي شامل</h3>
                <p>
                  يتمتع فريق المرشدين المحليين لدينا بشغف كبير بمشاركة التاريخ
                  والثقافة الغنية لسوريا مع الزوار.
                </p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <FaUserFriends size={20} />
              </div>
              <div className={styles.featureText}>
                <h3>تجربة شخصية</h3>
                <p>
                  نحن نقدم تجارب سياحية مصممة خصيصًا لتلبية احتياجات كل زائر،
                  سواء كنت تبحث عن المغامرة أو الاسترخاء.
                </p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <FaShieldAlt size={20} />
              </div>
              <div className={styles.featureText}>
                <h3>أمان وموثوقية</h3>
                <p>
                  نحن نضمن سلامتك وراحتك خلال رحلتك، حيث نقدم معلومات دقيقة
                  ومحدثة عن الوجهات والفعاليات.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
