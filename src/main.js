import { Client, Users } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY); // muss Scope users.write haben

  const users = new Users(client);

  const { userId } = req.body ?? {};

  if (!userId) {
    error('❌ Kein userId im Request-Body gefunden.');
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
