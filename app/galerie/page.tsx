import MediaGallery from '@/components/MediaGallery';

export const dynamic = 'force-dynamic';

export default function GaleriePage() {
  return (
    <>
      <div className="page-title-block">
        <h1>Galerie</h1>
        <p>Photos et vidéos de ta progression — témoins de chaque effort</p>
      </div>
      <MediaGallery />
    </>
  );
}
