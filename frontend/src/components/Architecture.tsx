import { ArrowRight } from "lucide-react";

export function Architecture() {
  return (
    <section className="stack" id="arquitetura">
      <div className="stack-copy">
        <p>PROJETO FULL-STACK</p>
        <h2>
          UMA LOJA.
          <br />
          <em>DUAS CAMADAS.</em>
        </h2>
        <span>
          Frontend e backend independentes, conectados por uma API REST
          documentada e prontos para evoluir separadamente.
        </span>
      </div>
      <div className="flow">
        <div>
          <small>FRONTEND</small>
          <b>React + TypeScript</b>
          <span>Interface reativa e tipada</span>
        </div>
        <ArrowRight />
        <div className="api">
          <small>CONTRATO</small>
          <b>REST API</b>
          <span>JSON · Sanctum · OpenAPI</span>
        </div>
        <ArrowRight />
        <div>
          <small>BACKEND</small>
          <b>Laravel + PostgreSQL</b>
          <span>Regras, dados e segurança</span>
        </div>
      </div>
    </section>
  );
}
