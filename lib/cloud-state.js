import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { CONFIG } from './config.js';

dotenv.config();

const supabaseUrl = (process.env.SUPABASE_URL || CONFIG.SUPABASE?.URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || CONFIG.SUPABASE?.KEY || '').trim();
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

/**
 * Obtiene un estado persistente desde Supabase (con fallback local transparente)
 */
export async function getCloudState(key, defaultLocalRelativePath = null, defaultValue = null) {
  // 1. Intentar leer desde Supabase
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('system_state')
        .select('value, updated_at')
        .eq('key', key)
        .maybeSingle();

      if (!error && data?.value) {
        if (defaultLocalRelativePath) {
          try {
            const localFile = path.resolve(defaultLocalRelativePath);
            fs.writeFileSync(localFile, JSON.stringify(data.value, null, 2), 'utf8');
          } catch (_) {}
        }
        return data.value;
      }
    } catch (dbErr) {
      console.warn(`[CloudState] Advertencia leyendo clave "${key}" en Supabase:`, dbErr.message);
    }
  }

  // 2. Fallback local desde archivo JSON
  if (defaultLocalRelativePath) {
    try {
      const localFile = path.resolve(defaultLocalRelativePath);
      if (fs.existsSync(localFile)) {
        return JSON.parse(fs.readFileSync(localFile, 'utf8'));
      }
    } catch (fsErr) {
      console.warn(`[CloudState] Fallback local no legible para "${defaultLocalRelativePath}":`, fsErr.message);
    }
  }

  return defaultValue;
}

/**
 * Guarda un estado persistente en Supabase (y en archivo local si es posible)
 */
export async function setCloudState(key, value, defaultLocalRelativePath = null) {
  let savedInCloud = false;

  // 1. Persistir en Supabase
  if (supabase) {
    try {
      const { error } = await supabase
        .from('system_state')
        .upsert({
          key,
          value,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (!error) {
        savedInCloud = true;
      } else {
        console.warn(`[CloudState] Error upsert en Supabase para clave "${key}":`, error.message);
      }
    } catch (dbErr) {
      console.warn(`[CloudState] Excepción upsert en Supabase:`, dbErr.message);
    }
  }

  // 2. Guardar en filesystem local (en entorno serverless puede ser no escribible, se captura de forma segura)
  if (defaultLocalRelativePath) {
    try {
      const localFile = path.resolve(defaultLocalRelativePath);
      fs.writeFileSync(localFile, JSON.stringify(value, null, 2), 'utf8');
    } catch (fsErr) {
      // Normal en entornos serverless de solo lectura
    }
  }

  return savedInCloud;
}

export async function getStorytellingCloudState() {
  return await getCloudState('storytelling_dispatch_state', 'storytelling_dispatch_state.json', {
    currentIndex: 0,
    currentChapter: 1,
    batchSize: 65,
    totalSent: 0,
    history: []
  });
}

export async function saveStorytellingCloudState(state) {
  return await setCloudState('storytelling_dispatch_state', state, 'storytelling_dispatch_state.json');
}

export async function getSocialFeedCloudState() {
  return await getCloudState('social_published_feed', 'social_published_feed.json', []);
}

export async function saveSocialFeedCloudState(feed) {
  return await setCloudState('social_published_feed', feed, 'social_published_feed.json');
}
