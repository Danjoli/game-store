import { Component, type ErrorInfo, type ReactNode } from "react";

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("Application error", error, info); }
  render() { return this.state.failed ? <main className="fatal-error"><h1>Algo deu errado</h1><p>Não foi possível carregar esta página.</p><button onClick={() => window.location.reload()}>Tentar novamente</button></main> : this.props.children; }
}
