import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CALENDAR_FILE = path.join(__dirname, 'buffer-content-calendar.json');
const STATE_FILE = path.join(__dirname, 'buffer_rotation_state.json');
const AUDIT_FEED_FILE = path.resolve('social_published_feed.json');

function loadCatalog() {
  try {
    const raw = fs.readFileSync(CALENDAR_FILE, 'utf8').replace(/^\uFEFF/, '');
    const data = JSON.parse(raw);
    return data.posts || [];
  } catch (err) {
    console.error('Error leyendo buffer-content-calendar.json:', err.message);
    return [];
  }
}

function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    }
  } catch (err) {
    console.warn('Advertencia cargando buffer_rotation_state.json:', err.message);
  }
  return {
    lastPublishedIndex: -1,
    publishedHistory: []
  };
}

function saveState(state) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (err) {
    console.error('Error guardando buffer_rotation_state.json:', err.message);
  }
}

/**
 * Obtiene el historial reciente de imágenes publicadas desde social_published_feed.json y state
 */
function getRecentUsedImages(limit = 10) {
  const usedImages = new Set();
  try {
    if (fs.existsSync(AUDIT_FEED_FILE)) {
      const feed = JSON.parse(fs.readFileSync(AUDIT_FEED_FILE, 'utf8'));
      for (const entry of feed.slice(0, limit)) {
        if (entry.imageUrls && Array.isArray(entry.imageUrls)) {
          entry.imageUrls.forEach(url => usedImages.add(url));
        }
        if (entry.image) {
          usedImages.add(entry.image);
        }
      }
    }
  } catch (err) {
    console.warn('Error leyendo feed para deduplicacion:', err.message);
  }

  const state = loadState();
  if (state.publishedHistory) {
    for (const item of state.publishedHistory.slice(-limit)) {
      if (item.image) usedImages.add(item.image);
    }
  }

  return usedImages;
}

/**
 * REGLA DE ORO ZERO-REPEAT:
 * Selecciona el siguiente post con una imagen NUNCA o MENOS recientemente utilizada.
 * @param {Object} options
 * @param {'FEED' | 'REEL' | 'ANY'} options.format
 */
export function getNextUnusedBufferPost({ format = 'ANY' } = {}) {
  const posts = loadCatalog();
  if (!posts.length) {
    throw new Error('No hay posts disponibles en el catálogo de Buffer');
  }

  // Filtrar por formato si se especifica
  let candidates = posts;
  if (format !== 'ANY') {
    candidates = posts.filter(p => p.format === format);
    if (!candidates.length) candidates = posts;
  }

  const usedImages = getRecentUsedImages(candidates.length);
  const state = loadState();

  // Buscar el primer post cuya imagen NO haya sido usada recientemente
  let selected = candidates.find(c => !usedImages.has(c.image));

  // Si todas ya se usaron, rotar con LRU (Least Recently Used)
  if (!selected) {
    const nextIdx = ((state.lastPublishedIndex || 0) + 1) % candidates.length;
    selected = candidates[nextIdx];
  }

  console.log(`🎯 [ZERO-REPEAT SELECTOR] Post Seleccionado: "${selected.title}"`);
  console.log(`🖼️ [IMAGEN FRESCA]: ${selected.image}`);

  return selected;
}

/**
 * Registra la publicación exitosa en el ledger de estado de rotación
 */
export function recordBufferPostPublication({ post, results = {} }) {
  const state = loadState();
  state.lastPublishedIndex = (state.lastPublishedIndex || 0) + 1;
  state.publishedHistory = state.publishedHistory || [];
  state.publishedHistory.push({
    timestamp: new Date().toISOString(),
    id: post.id,
    title: post.title,
    image: post.image,
    format: post.format,
    results
  });

  // Mantener solo los últimos 100 registros
  if (state.publishedHistory.length > 100) {
    state.publishedHistory = state.publishedHistory.slice(-100);
  }

  saveState(state);
}

/**
 * Compatibilidad con llamados legacy por día de semana
 */
export function getDailyBufferSchedule(dayOfWeek = null) {
  return getNextUnusedBufferPost({ format: 'ANY' });
}

export const WEEKLY_BUFFER_SCHEDULE = loadCatalog();
