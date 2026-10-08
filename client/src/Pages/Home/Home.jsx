import React from "react"
import { useNavigate } from "react-router-dom"
import {
  Package,
  BarChart3,
  ShieldCheck,
  Users,
  ArrowRight,
  Boxes,
  TrendingUp,
  Bell,
} from "lucide-react"
import styles from "./Home.module.css"

function Home() {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Boxes size={28} />,
      title: "Product Management",
      desc: "Track products, categories, and suppliers in one unified dashboard.",
    },
    {
      icon: <TrendingUp size={28} />,
      title: "Real-time Analytics",
      desc: "Live reports and charts to monitor stock levels and revenue trends.",
    },
    {
      icon: <Bell size={28} />,
      title: "Smart Alerts",
      desc: "Automated low-stock and reorder notifications to prevent stock-outs.",
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "Role-based Access",
      desc: "Secure admin & staff roles with protected routes and permissions.",
    },
    {
      icon: <Users size={28} />,
      title: "Team Collaboration",
      desc: "Manage users, assign roles, and audit activity logs across your team.",
    },
    {
      icon: <BarChart3 size={28} />,
      title: "Custom Reports",
      desc: "Generate PDF & CSV reports for inventory valuation and transactions.",
    },
  ]

  return (
    <div className={styles.page}>
      {/* ---- Decorative gradient orbs ---- */}
      <div className={styles.orbPrimary} />
      <div className={styles.orbAccent} />

      {/* ---- Navbar ---- */}
      <nav className={styles.navbar}>
        <div className={styles.navInner}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>IP</div>
            <span className={styles.logoText}>InvenPro</span>
          </div>

          <div className={styles.navActions}>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ---- Hero Section ---- */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>
            <Package size={14} />
            Inventory Management System
          </span>

          <h1 className={styles.heroTitle}>
            Take Control of Your
            <br />
            <span className={styles.gradientText}>Inventory</span>
          </h1>

          <p className={styles.heroSubtitle}>
            A modern, full-stack inventory management platform built with React
            &amp; Node.js. Track products, manage suppliers, monitor stock
            levels, and generate insightful reports — all in one place.
          </p>

          <div className={styles.heroCTA}>
            <button
              className="btn btn-primary"
              style={{ padding: "14px 28px", fontSize: "1rem" }}
              onClick={() => navigate("/register")}
            >
              Create an Account
              <ArrowRight size={18} />
            </button>
            <button
              className="btn btn-secondary"
              style={{ padding: "14px 28px", fontSize: "1rem" }}
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Floating stat cards */}
        <div className={styles.heroVisual}>
          <div className={`${styles.floatingCard} ${styles.card1}`}>
            <Boxes size={24} style={{ color: "var(--primary)" }} />
            <div>
              <span className={styles.floatValue}>2,450</span>
              <span className={styles.floatLabel}>Products</span>
            </div>
          </div>
          <div className={`${styles.floatingCard} ${styles.card2}`}>
            <TrendingUp size={24} style={{ color: "var(--success)" }} />
            <div>
              <span className={styles.floatValue}>+18.2%</span>
              <span className={styles.floatLabel}>Growth</span>
            </div>
          </div>
          <div className={`${styles.floatingCard} ${styles.card3}`}>
            <Users size={24} style={{ color: "var(--accent)" }} />
            <div>
              <span className={styles.floatValue}>38</span>
              <span className={styles.floatLabel}>Suppliers</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Features Grid ---- */}
      <section className={styles.features} id="features">
        <h2 className={styles.sectionTitle}>
          Everything you need to manage inventory
        </h2>
        <p className={styles.sectionSub}>
          Built for small-to-medium businesses that need powerful, simple tools.
        </p>

        <div className={styles.featureGrid}>
          {features.map((f, i) => (
            <div
              className={`glass-panel ${styles.featureCard}`}
              key={i}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={styles.featureIconWrap}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- CTA Banner ---- */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready to streamline your stock?</h2>
          <p className={styles.ctaSub}>
            Create a free account and start managing your inventory in minutes.
          </p>
          <div className={styles.heroCTA}>
            <button
              className="btn btn-primary"
              style={{ padding: "14px 28px", fontSize: "1rem" }}
              onClick={() => navigate("/register")}
            >
              Sign Up Free
              <ArrowRight size={18} />
            </button>
            <button
              className="btn btn-secondary"
              style={{ padding: "14px 28px", fontSize: "1rem" }}
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} InvenPro — GLA University Project</span>
      </footer>
    </div>
  )
}

export default Home
