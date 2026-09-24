// Vercel serverless function: receives the estimate form and creates/updates the contact in Omnisend.
// Set OMNISEND_API_KEY in Vercel → Project → Settings → Environment Variables. Never put the key in the HTML.
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const key = process.env.OMNISEND_API_KEY;
  if (!key) return res.status(500).json({ ok: false, error: 'missing key' });

  const d = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  if (d.company) return res.status(200).json({ ok: true }); // honeypot: bots fill this, people don't
  const email = String(d.email || '').trim().toLowerCase();
  if (!email || !d.first_name || !d.phone) return res.status(400).json({ ok: false, error: 'missing fields' });

  const digits = String(d.phone).replace(/\D/g, '');
  const phone = digits.length === 10 ? '+1' + digits : (digits.length === 11 && digits[0] === '1' ? '+' + digits : null);
  const services = Array.isArray(d.service) ? d.service : (d.service ? [d.service] : []);
  const now = new Date().toISOString();
  const smsOk = d.sms_consent === 'yes';

  const identifiers = [{ type: 'email', id: email, channels: { email: { status: 'subscribed', statusDate: now } } }];
  if (phone) identifiers.push({ type: 'phone', id: phone, channels: { sms: { status: smsOk ? 'subscribed' : 'nonSubscribed', statusDate: now } } });

  const headers = { 'Content-Type': 'application/json', 'X-API-KEY': key };
  const props = {
    service: services.join(', '),
    town: d.town || '',
    timeline: d.timeline || '',
    description: String(d.description || '').slice(0, 2000),
    lead_source: d.source || '',
    estimate_status: 'requested',
    requested_at: now
  };

  try {
    const r = await fetch('https://api.omnisend.com/v3/contacts', {
      method: 'POST', headers,
      body: JSON.stringify({
        identifiers,
        firstName: d.first_name, lastName: d.last_name || '',
        address: d.address || '', city: d.town || '', state: 'SC', countryCode: 'US',
        tags: ['estimate-request', 'website'].concat(services.map(s => 'service: ' + s)),
        customProperties: props
      })
    });
    if (!r.ok) { console.error('Omnisend contact', r.status, await r.text()); return res.status(502).json({ ok: false }); }

    // Custom event for triggering the follow-up automation. Non-fatal if it fails.
    await fetch('https://api.omnisend.com/v5/events', {
      method: 'POST', headers,
      body: JSON.stringify({ eventName: 'estimate requested', origin: 'api', contact: { email, phone: phone || undefined, firstName: d.first_name, lastName: d.last_name || '' }, properties: props })
    }).then(e => { if (!e.ok) console.error('Omnisend event', e.status); }).catch(e => console.error(e));

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ ok: false });
  }
};
