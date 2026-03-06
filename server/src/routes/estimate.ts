import { Router, Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { analyzeDevicePhotos } from '../services/vision.js';
import { calculateValuation } from '../services/pricing.js';
import type { FinalizeRequest } from '../../../shared/types.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'image/jpeg',
      'image/png',
      'image/heic',
      'image/heif',
      'image/webp',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Nieobslugiwany format pliku. Uzyj JPEG, PNG lub HEIC.'));
    }
  },
});

async function processImage(
  file: Express.Multer.File
): Promise<{ buffer: Buffer; mimeType: string }> {
  const isHeic =
    file.mimetype === 'image/heic' || file.mimetype === 'image/heif';

  let processed = sharp(file.buffer);

  if (isHeic) {
    processed = processed.jpeg({ quality: 85 });
  }

  // Resize if too large (max 2048px on longest side for API efficiency)
  const metadata = await sharp(file.buffer).metadata();
  const maxDim = 2048;
  if (
    metadata.width &&
    metadata.height &&
    (metadata.width > maxDim || metadata.height > maxDim)
  ) {
    processed = processed.resize(maxDim, maxDim, { fit: 'inside' });
  }

  // Compress to keep under 5MB base64 limit
  const buffer = await processed
    .jpeg({ quality: 85 })
    .toBuffer();

  return { buffer, mimeType: 'image/jpeg' };
}

router.post(
  '/estimate',
  upload.array('photos', 4),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[] | undefined;

      if (!files || files.length < 2) {
        res
          .status(400)
          .json({ error: 'Wymagane sa co najmniej 2 zdjecia urzadzenia.' });
        return;
      }

      const photos = await Promise.all(files.map(processImage));
      const result = await analyzeDevicePhotos(photos);

      res.json(result);
    } catch (err) {
      console.error('Estimate error:', err);
      const message =
        err instanceof Error ? err.message : 'Wystapil nieoczekiwany blad';
      res.status(500).json({ error: message });
    }
  }
);

router.post(
  '/estimate/finalize',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body as FinalizeRequest;

      if (!body.device || !body.visual_assessment || !body.manual_answers) {
        res.status(400).json({ error: 'Brakuje wymaganych danych.' });
        return;
      }

      console.log('Finalize device:', JSON.stringify(body.device));

      const valuation = calculateValuation(
        body.device,
        body.visual_assessment,
        body.manual_answers
      );

      res.json(valuation);
    } catch (err) {
      console.error('Finalize error:', err);
      const message =
        err instanceof Error ? err.message : 'Wystapil nieoczekiwany blad';
      res.status(500).json({ error: message });
    }
  }
);

export default router;
