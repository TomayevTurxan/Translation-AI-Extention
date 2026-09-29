const read = async (k, d) => (await chrome.storage.local.get(k))[k] ?? d;
const write = (k, v) => chrome.storage.local.set({ [k]: v });

export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const getAll = async () => ({
  words: await read('words', []),
  sentences: await read('sentences', []),
  activity: await read('activity', {}),
});

export async function bump(n = 1) {
  const activity = await read('activity', {});
  const k = dayKey();
  activity[k] = (activity[k] || 0) + n;
  await write('activity', activity);
}

export async function saveWord(w) {
  const words = await read('words', []);
  if (words.some((x) => x.word.toLowerCase() === w.word.toLowerCase())) return false;
  words.unshift({
    id: crypto.randomUUID(), status: 'new', level: 0, correct: 0, wrong: 0,
    nextReview: Date.now(), createdAt: Date.now(), ...w,
  });
  await write('words', words);
  await bump();
  return true;
}

export async function saveSentence(s) {
  const list = await read('sentences', []);
  if (list.some((x) => x.text === s.text)) return false;
  list.unshift({ id: crypto.randomUUID(), status: 'new', createdAt: Date.now(), ...s });
  await write('sentences', list);
  await bump();
  return true;
}

const patcher = (key) => async (id, patch) => {
  const list = await read(key, []);
  await write(key, list.map((x) => (x.id === id ? { ...x, ...patch } : x)));
};
const remover = (key) => async (id) => write(key, (await read(key, [])).filter((x) => x.id !== id));

export const updateWord = patcher('words');
export const updateSentence = patcher('sentences');
export const removeWord = remover('words');
export const removeSentence = remover('sentences');
export const clearAll = () => chrome.storage.local.clear();

export function computeStreak(activity) {
  const d = new Date();
  if (!activity[dayKey(d)]) d.setDate(d.getDate() - 1);
  let streak = 0;
  while (activity[dayKey(d)] > 0) { streak++; d.setDate(d.getDate() - 1); }
  return streak;
}
