import { Headphones, ShieldCheck, Zap } from "lucide-react";

export function Benefits() {
  return (
    <section className="benefits" aria-label="Benefícios">
      <div>
        <Zap />
        <span>
          <b>Entrega instantânea</b>
          <small>Receba sua key na hora</small>
        </span>
      </div>
      <div>
        <ShieldCheck />
        <span>
          <b>Compra protegida</b>
          <small>Pagamento 100% seguro</small>
        </span>
      </div>
      <div>
        <Headphones />
        <span>
          <b>Suporte gamer</b>
          <small>Atendimento todos os dias</small>
        </span>
      </div>
    </section>
  );
}
