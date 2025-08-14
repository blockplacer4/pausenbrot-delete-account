import { Client, Users } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY); // Scope users.write nötig

  const users = new Users(client);

  // Body parsen
  let body;
  try {
    body = JSON.parse(req.body);
  } catch {
    return res.json({ error: 'Body ist kein gültiges JSON' }, 400);
  }

  const { userId } = body;

  if (!userId) {
    return res.json({ error: 'userId fehlt im Request-Body' }, 400);
  }

  try {
    await users.delete(userId);
    log(`✅ User ${userId} gelöscht`);
    return res.json({ success: `User ${userId} gelöscht` });
  } catch (err) {
    error('❌ Fehler beim Löschen: ' + err.message);
    return res.json({ error: 'Konnte User nicht löschen: ' + err.message }, 500);
  }
};
