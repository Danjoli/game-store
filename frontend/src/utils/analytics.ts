export function initializeAnalytics() {
  const id = import.meta.env.VITE_ANALYTICS_ID;
  if (!id || document.querySelector(`script[data-analytics="${id}"]`)) return;
  const script = document.createElement("script"); script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`; script.dataset.analytics = id; document.head.appendChild(script);
  window.dataLayer = window.dataLayer ?? []; window.gtag = (...args: unknown[]) => window.dataLayer.push(args); window.gtag("js", new Date()); window.gtag("config", id, { anonymize_ip: true });
}

declare global { interface Window { dataLayer: unknown[][]; gtag: (...args: unknown[]) => void } }
