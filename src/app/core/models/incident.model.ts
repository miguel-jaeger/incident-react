export interface Incident {
  id?: number;
  ticketCode?: string;
  title: string;
  description: string;
  message?: string; // NOTA: En la UI esto representa "Razones del rechazo / Notas de resolución" (rejectionReason en el prototipo)
  status: 'Active' | 'Inactive' | string;
  severity?: string;
  category?: string;
  priority: 'High' | 'Medium' | 'Low' | string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}
