// Supprime définitivement le compte de l'utilisateur authentifié qui appelle
// cette fonction. Toutes ses données liées (profil, préférences, défis,
// streak, badges...) sont supprimées automatiquement via les `on delete
// cascade` déjà en place dans docs/schema.sql — rien d'autre à faire ici.
//
// Sécurité : l'identifiant de l'utilisateur à supprimer n'est JAMAIS lu
// depuis le corps de la requête ou un paramètre envoyé par le client. Il est
// dérivé uniquement du JWT vérifié côté serveur (auth.getUser()), donc un
// appelant ne peut supprimer que son propre compte.
//
// SUPABASE_URL, SUPABASE_ANON_KEY et SUPABASE_SERVICE_ROLE_KEY sont fournis
// automatiquement par l'environnement d'exécution des Edge Functions — pas
// besoin de les configurer manuellement via `supabase secrets set`.

import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Méthode non autorisée.' }, 405);
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse({ error: 'Configuration serveur manquante.' }, 500);
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return jsonResponse({ error: 'Authentification requise.' }, 401);
  }

  // Client "anon" porteur du JWT de l'appelant : sert uniquement à vérifier
  // qui fait la demande. auth.getUser() valide le token côté serveur — on ne
  // fait confiance à aucun identifiant envoyé par le client.
  const callerClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: userError,
  } = await callerClient.auth.getUser();

  if (userError || !user) {
    return jsonResponse({ error: 'Session invalide ou expirée.' }, 401);
  }

  // Client "service role" : seul client habilité à supprimer un compte, et
  // uniquement pour l'utilisateur authentifié ci-dessus.
  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);

  if (deleteError) {
    return jsonResponse({ error: deleteError.message }, 500);
  }

  return jsonResponse({ success: true }, 200);
});
