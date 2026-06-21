export function decodePolyline(encoded: string): [number, number][] {
  const coords: [number, number][] = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lat += (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    shift = 0; result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lng += (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    coords.push([lat / 1e5, lng / 1e5]);
  }
  return coords;
}

export function polylineToSvgPath(encoded: string, W: number, H: number, padding = 0.12): string {
  const coords = decodePolyline(encoded);
  if (coords.length < 2) return '';
  const lats = coords.map(c => c[0]);
  const lngs = coords.map(c => c[1]);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const latRange = maxLat - minLat || 0.001;
  const lngRange = maxLng - minLng || 0.001;
  const pad = Math.min(W, H) * padding;
  const scaleX = (W - pad * 2) / lngRange;
  const scaleY = (H - pad * 2) / latRange;
  const scale = Math.min(scaleX, scaleY);
  const offX = (W - lngRange * scale) / 2;
  const offY = (H - latRange * scale) / 2;
  return coords.map(([lat, lng], i) => {
    const x = (lng - minLng) * scale + offX;
    const y = H - ((lat - minLat) * scale + offY);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}
