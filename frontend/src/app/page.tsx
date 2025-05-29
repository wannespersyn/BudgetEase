import "../../styles/landing.css";
import Navbar from "../../components/navbar";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="main">
      <Navbar active="Home" />

      <section className="hero">
        <div className="heroContent">
          <h1 className="heroTitle">Welcome to BudgetEase</h1>
          <p className="heroSubtitle">
            Take control of your financial future. Track your spending, manage
            budgets, and reach your goals — all in one powerful, simple platform.
          </p>
          <div className="heroButtons">
            <Link href="/login" className="btn primary">
              Get Started
            </Link>
            <Link href="/register" className="btn secondary">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Why BudgetEase?</h2>
        <div className="featureGrid">
          <div className="featureCard">
            <h3>💳 Budget Tracking</h3>
            <p>Stay on top of where your money goes with smart budget categories.</p>
          </div>
          <div className="featureCard">
            <h3>📈 Expense Analytics</h3>
            <p>Visualize your spending trends and identify areas to save money.</p>
          </div>
          <div className="featureCard">
            <h3>🔔 Smart Alerts</h3>
            <p>Get notified when you're close to your limits or overspending.</p>
          </div>
          <div className="featureCard">
            <h3>🔒 Secure by Design</h3>
            <p>Your financial data is encrypted and protected with bank-level security.</p>
          </div>
        </div>
      </section>

      <section className="testimonialSection">
        <h2>What Our Users Say</h2>
        <div className="testimonials">
          <blockquote>
            "BudgetEase helped me save over €300 in just one month. It’s so intuitive!"
            <footer>— Sarah V., Student</footer>
          </blockquote>
          <blockquote>
            "I finally feel in control of my business expenses. Love the alerts and graphs."
            <footer>— Tom D., Freelancer</footer>
          </blockquote>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} BudgetEase. Built with react by Wannes Persyn.</p>
      </footer>
    </main>
  );
}
