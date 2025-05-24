import "../../styles/landing.css";
import Navbar from "../../components/navbar";

export default function LandingPage() {
  return (
    <main className="main">
      <Navbar active="Home" />
      <section className="section">
        <h1 className="heading">BudgetEase</h1>
        <p className="paragraph-large">Een cloud-native personal finance tracker gebouwd voor moderne gebruikers.</p>
        <p>BudgetEase helpt je om inkomsten, uitgaven en budgetten eenvoudig te beheren via een veilige, schaalbare Azure-gebaseerde architectuur.</p>
      </section>
    </main>
  );
}
