"""Reproducible teaching CNN; synthetic harmonic denoising, not speech enhancement.
Run with Python, numpy and scipy. Generates model weights, activations and WAVs.
"""
import json
from pathlib import Path
import numpy as np
from scipy.signal import stft, istft
from scipy.io.wavfile import write

rng = np.random.default_rng(640530)
rate, window, hop = 8000, 256, 128
out = Path(__file__).resolve().parents[1] / "public" / "ai-denoise"
out.mkdir(parents=True, exist_ok=True)


def example():
    t = np.arange(rate * 2) / rate
    f = rng.uniform(170, 390)
    clean = sum(np.sin(2 * np.pi * f * k * t + rng.uniform(0, 6.28)) / k for k in range(1, 7))
    clean *= (0.3 + 0.7 * np.sin(np.pi * t / 2) ** 2) * 0.12
    noisy = clean + rng.normal(0, rng.uniform(0.06, 0.15), len(t))
    return clean, noisy


def spectrum(x):
    return stft(x, fs=rate, nperseg=window, noverlap=window-hop)[2]


def features(z):
    return np.clip((20 * np.log10(np.abs(z) + 1e-8) + 80) / 80, 0, 1)


def patches(x):
    return np.lib.stride_tricks.sliding_window_view(np.pad(x, 1), (3, 3)).reshape(-1, 9)


xs, ys = [], []
for _ in range(24):
    clean, noisy = example()
    s, y = spectrum(clean), spectrum(noisy)
    target = np.clip(np.abs(s) / (np.abs(y) + 1e-8), 0, 1)
    ids = rng.choice(target.size, 1200, replace=False)
    xs.append(patches(features(y))[ids])
    ys.append(target.ravel()[ids, None])
x, target = np.concatenate(xs), np.concatenate(ys)
w = rng.normal(0, 0.35, (9, 4)); b = np.full(4, 0.1)
v = rng.normal(0, 0.35, (4, 1)); c = np.zeros(1)
params = [w, b, v, c]
mom = [np.zeros_like(p) for p in params]; var = [np.zeros_like(p) for p in params]
for step in range(1, 1601):
    ids = rng.integers(0, len(x), 512); a, goal = x[ids], target[ids]
    pre = a @ w + b; h = np.maximum(0, pre)
    pred = 1 / (1 + np.exp(-np.clip(h @ v + c, -30, 30)))
    d = 2 * (pred - goal) * pred * (1-pred) / len(ids)
    dh = (d @ v.T) * (pre > 0)
    grads = [a.T @ dh, dh.sum(0), h.T @ d, d.sum(0)]
    for p, g, m, vv in zip(params, grads, mom, var):
        m *= 0.9; m += 0.1*g; vv *= 0.999; vv += 0.001*g*g
        p -= 0.01 * (m/(1-0.9**step)) / (np.sqrt(vv/(1-0.999**step)) + 1e-8)

clean, noisy = example()  # Held-out signal, never used in training.
z = spectrum(noisy); f = features(z)
pre = patches(f) @ w + b; activations = np.maximum(0, pre)
mask = (1/(1+np.exp(-np.clip(activations @ v+c,-30,30)))).reshape(z.shape)
enhanced = istft(z*mask, fs=rate, nperseg=window, noverlap=window-hop)[1][:len(noisy)]
identity = istft(z, fs=rate, nperseg=window, noverlap=window-hop)[1][:len(noisy)]
assert np.max(np.abs(identity-noisy)) < 1e-10
assert np.isfinite(enhanced).all() and mask.min() >= 0 and mask.max() <= 1
scale = 0.9 / max(np.max(np.abs(noisy)), np.max(np.abs(clean)), np.max(np.abs(enhanced)))
for name, audio in [("input", noisy), ("output", enhanced), ("target", clean)]:
    write(out / f"{name}.wav", rate, (audio*scale*32767).astype(np.int16))
def matrix(a):
    return np.round(a[:64, :64], 5).tolist()
def snr(a):
    return float(10*np.log10(np.sum(clean**2)/np.sum((clean-a)**2)))
data = dict(rate=rate, window=window, hop=hop, waves=[(a[4000:4256]*scale).tolist() for a in [noisy, enhanced]], input=matrix(f),
            output=matrix(features(z*mask)), mask=matrix(mask), magnitude=np.abs(z[:64, :64]).tolist(),
            activations=[matrix(activations[:,i].reshape(z.shape)) for i in range(4)],
            kernels=np.round(w.T.reshape(4,3,3),6).tolist(), bias=b.tolist(),
            head=v.ravel().tolist(), headBias=float(c[0]), snr=[snr(noisy),snr(enhanced)],
            loss=float(np.mean((pred-goal)**2)))
(out / "demo.json").write_text(json.dumps(data, separators=(",", ":")))
print(f"Generated synthetic CNN demo; input/output SNR: {data['snr']}; final batch MSE: {data['loss']:.4f}")
