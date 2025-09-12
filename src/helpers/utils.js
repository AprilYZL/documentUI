export const X_API_KEY = import.meta.env.VITE_API_KEY
export const BASE_URL = import.meta.env.VITE_BASE_URL

export const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const CLASS_COLORS = {
  "Loss Run": "#6b705c",   // muted olive green
  "Policy": "#386641",     // earthy forest green
  "Other": "#6c757d",      // cool muted gray
  "Invoice": "#a98467",    // warm brown
  "Certificate": "#b5838d",      // dusty rose
  "Notice": "#6d6875",     // muted mauve
  "Statement": "#355070",  // muted indigo/blue
  "Audit": "#817f75",       // soft stone gray
  "Endorsement": "#936639",// muted golden brown
  "Application": "#5a5d61",// charcoal gray
};

export const formatDate = (iso) => new Date(iso).toLocaleDateString();

export const classifications = [
  {
    classification: "Application",
    description: "Insurance applications and forms",
  },
  {
    classification: "Audit",
    description: "Premium audit reports and worksheets",
  },
  {
    classification: "Certificate",
    description: "Certificates of insurance",
  },
  {
    classification: "Endorsement",
    description: "Policy endorsements and amendments",
  },
  {
    classification: "Invoice",
    description: "Premium invoices and billing statements",
  },
  {
    classification: "Loss Run",
    description: "Historical claims data and loss experience",
  },
  {
    classification: "Other",
    description: "Any other insurance-related document",
  },
  {
    classification: "Policy",
    description: "Insurance policy documents and contracts",
  },
  {
    classification: "Quote",
    description: "Insurance quotes and proposals",
  },
];