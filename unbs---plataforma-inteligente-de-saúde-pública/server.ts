import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './src/server/mockDb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // ==============================================================================
  // API REST v1 ROUTES
  // ==============================================================================

  app.get('/api/v1/health', (req, res) => {
    res.json({
      status: 'healthy',
      platform: 'UNBS v4.0',
      timestamp: new Date().toISOString(),
      database: 'PostgreSQL Ready',
    });
  });

  // Current User / Session Switcher
  app.get('/api/v1/users', (req, res) => {
    res.json(db.users);
  });

  // Municipalities & Health Units
  app.get('/api/v1/municipalities', (req, res) => {
    res.json(db.municipalities);
  });

  app.get('/api/v1/health-units', (req, res) => {
    res.json(db.healthUnits);
  });

  app.get('/api/v1/services', (req, res) => {
    const { unitId } = req.query;
    if (unitId) {
      return res.json(db.services.filter((s) => s.healthUnitId === unitId));
    }
    res.json(db.services);
  });

  // Appointment Slots
  app.get('/api/v1/slots', (req, res) => {
    const { unitId, serviceId, date } = req.query;
    let filtered = db.slots;
    if (unitId) filtered = filtered.filter((s) => s.healthUnitId === unitId);
    if (serviceId) filtered = filtered.filter((s) => s.serviceId === serviceId);
    if (date) filtered = filtered.filter((s) => s.slotDate === date);
    res.json(filtered);
  });

  // Appointments
  app.get('/api/v1/appointments', (req, res) => {
    const { citizenId, unitId, date } = req.query;
    let filtered = db.appointments;
    if (citizenId) filtered = filtered.filter((a) => a.citizenId === citizenId);
    if (unitId) filtered = filtered.filter((a) => a.healthUnitId === unitId);
    if (date) filtered = filtered.filter((a) => a.appointmentDate === date);
    res.json(filtered);
  });

  // Book Appointment (Atomic Concurrency Guard)
  app.post('/api/v1/appointments', (req, res) => {
    const result = db.bookAppointment(req.body);
    if (!result.success) {
      return res.status(409).json({ error: result.error });
    }
    res.status(201).json(result.appointment);
  });

  // Cancel Appointment
  app.post('/api/v1/appointments/:id/cancel', (req, res) => {
    const { citizenId, reason } = req.body;
    const result = db.cancelAppointment(req.params.id, citizenId, reason);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json({ message: 'Agendamento cancelado com sucesso.' });
  });

  // Update Status (Reception check-in, attendance, absence)
  app.patch('/api/v1/appointments/:id/status', (req, res) => {
    const { status, staffUserId, notes } = req.body;
    const staff = db.users.find((u) => u.id === staffUserId) || db.users[1];
    const result = db.updateAppointmentStatus(req.params.id, status, staff, notes);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json(result.appointment);
  });

  // Queues & Tickets
  app.get('/api/v1/queues', (req, res) => {
    const { unitId } = req.query;
    let list = db.queue;
    if (unitId) list = list.filter((q) => q.healthUnitId === unitId);
    res.json(list);
  });

  app.post('/api/v1/queues/tickets', (req, res) => {
    const ticket = db.generateQueueTicket(req.body);
    res.status(201).json(ticket);
  });

  app.post('/api/v1/queues/tickets/:id/call', (req, res) => {
    const { deskNumber, staffUserId } = req.body;
    const staff = db.users.find((u) => u.id === staffUserId) || db.users[1];
    const result = db.callTicket(req.params.id, deskNumber, staff);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json(result.ticket);
  });

  // Vaccines & Batches
  app.get('/api/v1/vaccines', (req, res) => {
    res.json(db.vaccines);
  });

  app.get('/api/v1/vaccines/batches', (req, res) => {
    const { unitId } = req.query;
    let list = db.batches;
    if (unitId) list = list.filter((b) => b.healthUnitId === unitId);
    res.json(list);
  });

  app.get('/api/v1/immunizations', (req, res) => {
    const { citizenId, unitId } = req.query;
    let list = db.immunizations;
    if (citizenId) list = list.filter((im) => im.citizenId === citizenId);
    if (unitId) list = list.filter((im) => im.healthUnitId === unitId);
    res.json(list);
  });

  app.post('/api/v1/immunizations', (req, res) => {
    const { citizenId, citizenName, vaccineId, batchId, doseNumber, healthUnitId, staffUserId, notes } = req.body;
    const staff = db.users.find((u) => u.id === staffUserId) || db.users[4];
    const result = db.recordVaccination({
      citizenId,
      citizenName,
      vaccineId,
      batchId,
      doseNumber,
      healthUnitId,
      professionalUser: staff,
      notes,
    });
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.status(201).json(result.record);
  });

  // Inventory
  app.get('/api/v1/inventory', (req, res) => {
    const { unitId } = req.query;
    let list = db.inventory;
    if (unitId) list = list.filter((i) => i.healthUnitId === unitId);
    res.json(list);
  });

  // Announcements
  app.get('/api/v1/announcements', (req, res) => {
    res.json(db.announcements);
  });

  app.post('/api/v1/announcements', (req, res) => {
    const { municipalityId, healthUnitId, title, content, category, isUrgent, publishedByName } = req.body;
    const ann = {
      id: `ann-${Date.now()}`,
      municipalityId,
      healthUnitId,
      title,
      content,
      category,
      isUrgent: !!isUrgent,
      publishedAt: new Date().toISOString(),
      publishedByName: publishedByName || 'Administração da Saúde',
    };
    db.announcements.unshift(ann);
    res.status(201).json(ann);
  });

  // Service Requests & Ombudsman
  app.get('/api/v1/requests', (req, res) => {
    const { citizenId, unitId } = req.query;
    let list = db.serviceRequests;
    if (citizenId) list = list.filter((r) => r.citizenId === citizenId);
    if (unitId) list = list.filter((r) => r.healthUnitId === unitId);
    res.json(list);
  });

  app.post('/api/v1/requests', (req, res) => {
    const { citizenId, citizenName, healthUnitId, category, title, description } = req.body;
    const protocol = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq = {
      id: `req-${Date.now()}`,
      protocol,
      citizenId,
      citizenName,
      healthUnitId,
      category,
      title,
      description,
      status: 'ABERTO' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.serviceRequests.unshift(newReq);
    res.status(201).json(newReq);
  });

  // Municipal Dashboard KPIs
  app.get('/api/v1/dashboard/kpis', (req, res) => {
    res.json(db.getMunicipalKpis());
  });

  // Audit Logs
  app.get('/api/v1/audit', (req, res) => {
    res.json(db.auditLogs);
  });

  // ==============================================================================
  // VITE DEV SERVER / MIDDLEWARE
  // ==============================================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[UNBS] Plataforma de Saúde Pública executando em http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[UNBS] Erro fatal ao iniciar servidor:', err);
  process.exit(1);
});
